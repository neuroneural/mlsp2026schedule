import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const WORKBOOK_PATH = "MLSP 2026 Accepted papers by theme with poster oral assignments.xlsx";
const SUBMISSIONS_PATH = "MLSP 2026 Submission Status.csv";
const OUTPUT_PATH = "data/papers.json";

const sessionDetails = {
  "Oral Session 1 - Foundation & Generative Models for Signals": {
    id: "oral-1", kind: "oral", label: "Oral Session 1", day: "Tuesday", date: "2026-09-29", start: "10:30", end: "12:00",
  },
  "Oral Session 2 - Responsible, Causal & Federated Signal Intelligence": {
    id: "oral-2", kind: "oral", label: "Oral Session 2", day: "Tuesday", date: "2026-09-29", start: "14:00", end: "15:30",
  },
  "Oral Session 3 - Temporal & Sequential Signal Learning": {
    id: "oral-3", kind: "oral", label: "Oral Session 3", day: "Wednesday", date: "2026-09-30", start: "10:30", end: "12:00",
  },
  "Oral Session 4 - ML for Neuroimaging, Neuroscience and Beyond": {
    id: "oral-4", kind: "oral", label: "Oral Session 4", day: "Wednesday", date: "2026-09-30", start: "14:00", end: "15:30",
  },
  "Oral Session 5 - Agentic & Multimodal Learning": {
    id: "oral-5", kind: "oral", label: "Oral Session 5", day: "Thursday", date: "2026-10-01", start: "10:30", end: "12:00",
  },
  "Poster Session 1 - Tue Sep 29": {
    id: "poster-1", kind: "poster", label: "Poster Session 1", day: "Tuesday", date: "2026-09-29", start: "16:00", end: "18:00",
  },
  "Poster Session 2 - Wed Sep 30": {
    id: "poster-2", kind: "poster", label: "Poster Session 2", day: "Wednesday", date: "2026-09-30", start: "16:00", end: "18:00",
  },
  "Poster Session 3 - Thu Oct 1": {
    id: "poster-3", kind: "poster", label: "Poster Session 3", day: "Thursday", date: "2026-10-01", start: "13:00", end: "15:00",
  },
};

const posterSessionOverrides = new Map([
  [134, "Poster Session 1 - Tue Sep 29"],
]);

function cleanTitle(title) {
  return String(title)
    .replaceAll("‚Ñ¢", "™")
    .replaceAll("---", " — ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalized(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenSimilarity(left, right) {
  const a = new Set(normalized(left).split(" ").filter(Boolean));
  const b = new Set(normalized(right).split(" ").filter(Boolean));
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

function decodeXml(text) {
  return String(text)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

async function lookupMetadata(title) {
  const url = new URL("https://export.arxiv.org/api/query");
  url.searchParams.set("search_query", `ti:\"${title.replaceAll('"', "")}\"`);
  url.searchParams.set("start", "0");
  url.searchParams.set("max_results", "3");

  const response = await fetch(url, {
    headers: { "User-Agent": "MLSP-2026-schedule-builder/1.0" },
  });
  if (!response.ok) throw new Error(`arXiv ${response.status}`);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
  const candidates = entries
    .map((entry) => {
      const matchedTitle = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").replace(/\s+/g, " ").trim();
      return { entry, matchedTitle, score: tokenSimilarity(title, matchedTitle) };
    })
    .sort((a, b) => b.score - a.score);
  const best = candidates[0];

  if (!best || best.score < 0.92) {
    return { authors: [], source: null, matchScore: best?.score ?? 0 };
  }

  const source = decodeXml(best.entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? "").replace("http://", "https://");
  const authors = [...best.entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)]
    .map((match) => decodeXml(match[1]).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      profileUrl: `https://arxiv.org/search/?searchtype=author&query=${encodeURIComponent(name)}`,
    }));

  return { authors, source, matchScore: Number(best.score.toFixed(3)) };
}

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const input = await FileBlob.load(WORKBOOK_PATH);
const workbook = await SpreadsheetFile.importXlsx(input);
const rows = workbook.worksheets.getItem("Accepted Papers").getRange("A1:I101").values;
const headers = rows[0];
const records = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));

const csvText = await fs.readFile(SUBMISSIONS_PATH, "utf8");
const submissionsWorkbook = await Workbook.fromCSV(csvText, { sheetName: "Submissions" });
const submissionRows = submissionsWorkbook.worksheets.getItem("Submissions").getRange("A1:Q190").values;
const submissionHeaders = submissionRows[0].map((header) => String(header).replace(/^\uFEFF/, ""));
const submissions = submissionRows.slice(1).map((row) => Object.fromEntries(submissionHeaders.map((header, index) => [header, row[index]])));
const submissionsByNumber = new Map(submissions.map((submission) => [Number(submission.number), submission]));

let authorMatches = 0;
let titleMismatches = 0;
const papers = [];
for (const [index, record] of records.entries()) {
  const title = cleanTitle(record.title);
  const submission = submissionsByNumber.get(Number(record.submission_number));
  if (!submission) throw new Error(`Submission #${record.submission_number} is missing from ${SUBMISSIONS_PATH}`);
  if (normalized(submission.title) !== normalized(title)) titleMismatches += 1;
  if (String(submission.forum) !== String(record.openreview_link)) {
    throw new Error(`Forum link mismatch for submission #${record.submission_number}`);
  }
  if (!String(submission.decision).toLowerCase().includes("accept")) {
    throw new Error(`Submission #${record.submission_number} is not marked accepted in ${SUBMISSIONS_PATH}`);
  }
  let metadata = { authors: [], source: null, matchScore: 0 };
  try {
    metadata = await lookupMetadata(title);
  } catch (error) {
    console.warn(`Metadata lookup failed for #${record.submission_number}: ${error.message}`);
  }
  if (metadata.authors.length) authorMatches += 1;

  const posterAssignment = posterSessionOverrides.get(Number(record.submission_number))
    ?? record["Poster Session Assignment"];
  const poster = sessionDetails[posterAssignment];
  const oralBase = record["Confirmed Oral Assignment"] ? sessionDetails[record["Confirmed Oral Assignment"]] : null;
  const order = record["Oral Presentation Order"] ? Number(record["Oral Presentation Order"]) : null;
  const oral = oralBase && order ? {
    ...oralBase,
    order,
    start: addMinutes(oralBase.start, (order - 1) * 15),
    end: addMinutes(oralBase.start, order * 15),
  } : null;

  papers.push({
    id: `paper-${record.submission_number}`,
    submissionNumber: Number(record.submission_number),
    title,
    authors: metadata.authors,
    authorsSource: metadata.source,
    authorsMatchScore: metadata.matchScore,
    theme: record.theme,
    abstract: String(submission.abstract ?? "").trim(),
    openreviewUrl: submission.forum || record.openreview_link,
    poster: { ...poster },
    oral,
  });

  if ((index + 1) % 10 === 0) console.log(`Resolved ${index + 1}/${records.length}`);
  await new Promise((resolve) => setTimeout(resolve, 3100));
}

papers.sort((a, b) => a.poster.date.localeCompare(b.poster.date) || a.theme.localeCompare(b.theme) || a.title.localeCompare(b.title));

await fs.mkdir("data", { recursive: true });
await fs.writeFile(OUTPUT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourceWorkbook: WORKBOOK_PATH,
  conferenceTimezone: "America/New_York",
  paperCount: papers.length,
  authorMatchCount: authorMatches,
  sourceTitleMismatchCount: titleMismatches,
  papers,
}, null, 2)}\n`);

console.log(`Wrote ${papers.length} papers to ${OUTPUT_PATH}; authors matched for ${authorMatches}; ${titleMismatches} source-title updates.`);
