import fs from "node:fs/promises";

const data = JSON.parse(await fs.readFile("data/papers.json", "utf8"));
const papers = data.papers;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(papers.length === 100, `Expected 100 papers, found ${papers.length}`);
assert(new Set(papers.map((paper) => paper.submissionNumber)).size === 100, "Submission numbers are not unique");
assert(new Set(papers.map((paper) => paper.openreviewUrl)).size === 100, "OpenReview URLs are not unique");
assert(papers.every((paper) => paper.title && paper.abstract && paper.poster), "A paper is missing title, abstract, or poster data");

const posterCounts = Object.fromEntries(
  ["poster-1", "poster-2", "poster-3"].map((id) => [id, papers.filter((paper) => paper.poster.id === id).length]),
);
assert(JSON.stringify(posterCounts) === JSON.stringify({ "poster-1": 34, "poster-2": 34, "poster-3": 32 }), `Unexpected poster counts: ${JSON.stringify(posterCounts)}`);

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
