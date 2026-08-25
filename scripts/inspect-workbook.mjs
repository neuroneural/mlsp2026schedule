import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2];
if (!workbookPath) {
  throw new Error("Usage: node scripts/inspect-workbook.mjs <workbook.xlsx>");
}

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table,region",
  include: "id,name,values,formulas",
  maxChars: 30000,
  tableMaxRows: 12,
  tableMaxCols: 16,
  tableMaxCellChars: 160,
});

console.log(overview.ndjson);
