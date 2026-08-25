import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2];
if (!workbookPath) {
  throw new Error("Usage: node scripts/import-authors-workbook.mjs <camera-ready-audit.xlsx>");
}

const DATA_PATH = "data/papers.json";

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Camera Ready Audit");
const values = sheet.getUsedRange(true).values;
const headers = values[0].map(String);
const records = values.slice(1)
  .filter((row) => row.some((value) => value !== null && value !== ""))
  .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));

if (records.length !== 100) {
  throw new Error(`Expected 100 author records; found ${records.length}`);
}

const schedule = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
const bySubmission = new Map(records.map((record) => [Number(record.submission_number), record]));

if (bySubmission.size !== records.length) {
  throw new Error("The author workbook contains duplicate submission numbers.");
}

let linkedAuthors = 0;
let totalAuthors = 0;
let titleDifferences = 0;

for (const paper of schedule.papers) {
  const record = bySubmission.get(Number(paper.submissionNumber));
  if (!record) throw new Error(`No author row for paper ${paper.submissionNumber}`);
  if (String(record.openreview_link).trim() !== String(paper.openreviewUrl).trim()) {
    throw new Error(`OpenReview link mismatch for paper ${paper.submissionNumber}`);
  }

  const names = String(record.authors_from_revision ?? "")
    .split(/\s*,\s*/)
    .map((name) => name.trim())
    .filter(Boolean);
  if (!names.length) throw new Error(`No author names for paper ${paper.submissionNumber}`);
  if (normalize(names[0]) !== normalize(record.first_author)) {
    throw new Error(`First-author mismatch for paper ${paper.submissionNumber}: ${names[0]} vs ${record.first_author}`);
  }

  if (normalize(record.title) !== normalize(paper.title)) titleDifferences += 1;

  const existingLinks = new Map(
    paper.authors
      .filter((author) => author.profileUrl)
      .map((author) => [normalize(author.name), author.profileUrl]),
  );
  paper.authors = names.map((name, index) => {
    const profileUrl = index === 0
      ? String(record.first_author_profile ?? "").trim()
      : existingLinks.get(normalize(name)) ?? null;
    if (profileUrl) linkedAuthors += 1;
    totalAuthors += 1;
    return { name, profileUrl };
  });
  paper.authorsSource = path.basename(workbookPath);
  paper.authorsMatchScore = 1;
}

schedule.authorMatchCount = schedule.papers.length;
schedule.authorDataUpdatedAt = new Date().toISOString();
schedule.authorSourceWorkbook = path.basename(workbookPath);

const temporaryPath = `${DATA_PATH}.tmp`;
await fs.writeFile(temporaryPath, `${JSON.stringify(schedule, null, 2)}\n`);
await fs.rename(temporaryPath, DATA_PATH);

console.log(JSON.stringify({
  papers: schedule.papers.length,
  totalAuthors,
  linkedAuthors,
  titleDifferences,
  source: schedule.authorSourceWorkbook,
}, null, 2));
