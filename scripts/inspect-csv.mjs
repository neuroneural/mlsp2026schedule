import fs from "node:fs/promises";
import { Workbook } from "@oai/artifact-tool";

const csvPath = process.argv[2];
if (!csvPath) throw new Error("Usage: node scripts/inspect-csv.mjs <file.csv>");

const csvText = await fs.readFile(csvPath, "utf8");
const workbook = await Workbook.fromCSV(csvText, { sheetName: "Submissions" });
const overview = await workbook.inspect({
  kind: "workbook,sheet,region,table",
  include: "id,name,values",
  maxChars: 20000,
  tableMaxRows: 6,
  tableMaxCols: 24,
  tableMaxCellChars: 180,
});

console.log(overview.ndjson);
