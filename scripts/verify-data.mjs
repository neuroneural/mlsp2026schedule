import fs from "node:fs/promises";

const data = JSON.parse(await fs.readFile("data/papers.json", "utf8"));
const papers = data.papers;
const withdrawnPapers = new Set(JSON.parse(await fs.readFile("data/withdrawn-papers.json", "utf8")));
const authorNotes = JSON.parse(await fs.readFile("data/author-notes.json", "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(papers.length === 91, `Expected 91 papers, found ${papers.length}`);
assert(data.paperCount === papers.length, "Paper count does not reconcile");
assert(papers.every((paper) => !withdrawnPapers.has(paper.submissionNumber)), "A withdrawn paper is still scheduled");
assert(new Set(papers.map((paper) => paper.submissionNumber)).size === papers.length, "Submission numbers are not unique");
assert(new Set(papers.map((paper) => paper.openreviewUrl)).size === papers.length, "OpenReview URLs are not unique");
assert(papers.every((paper) => paper.title && paper.abstract && paper.poster), "A paper is missing title, abstract, or poster data");
for (const [submissionNumber, note] of Object.entries(authorNotes)) {
  const paper = papers.find((item) => item.submissionNumber === Number(submissionNumber));
  assert(paper, `Author note references missing paper ${submissionNumber}`);
  assert(JSON.stringify(paper.equalContributionAuthors) === JSON.stringify(note.equalContributionAuthors), `Author note mismatch for paper ${submissionNumber}`);
  const authorNames = new Set(paper.authors.map((author) => author.name));
  assert(note.equalContributionAuthors.every((name) => authorNames.has(name)), `Equal-contribution author missing from paper ${submissionNumber}`);
}

const posterCounts = Object.fromEntries(
  ["poster-1", "poster-2", "poster-3"].map((id) => [id, papers.filter((paper) => paper.poster.id === id).length]),
);
assert(JSON.stringify(posterCounts) === JSON.stringify({ "poster-1": 31, "poster-2": 31, "poster-3": 29 }), `Unexpected poster counts: ${JSON.stringify(posterCounts)}`);

const oralPapers = papers.filter((paper) => paper.oral);
assert(oralPapers.length === 30, `Expected 30 oral papers, found ${oralPapers.length}`);
for (let session = 1; session <= 5; session += 1) {
  const sessionPapers = oralPapers.filter((paper) => paper.oral.id === `oral-${session}`);
  assert(sessionPapers.length === 6, `Oral session ${session} has ${sessionPapers.length} papers`);
  assert(
    sessionPapers.map((paper) => paper.oral.order).sort((a, b) => a - b).join(",") === "1,2,3,4,5,6",
    `Oral session ${session} order is incomplete`,
  );
}

const authoredPapers = papers.filter((paper) => paper.authors.length).length;
assert(authoredPapers === data.authorMatchCount, "Author match count does not reconcile");

console.log(JSON.stringify({
  papers: papers.length,
  oralPapers: oralPapers.length,
  posterCounts,
  authoredPapers,
  sourceTitleUpdates: data.sourceTitleMismatchCount,
}, null, 2));
