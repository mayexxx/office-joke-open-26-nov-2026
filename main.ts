import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rawOutputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outputDir = isAbsolute(rawOutputDir) ? rawOutputDir : resolve(scriptDir, rawOutputDir);
const entry = "Per my last email is just corporate Latin for \"I am seconds away from throwing my laptop into the sun.\"";
const expectedLength = 103;
const expectedByteLength = 103;
const expectedWordCount = 20;
const expectedLineCount = 1;

mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "entry.txt");
writeFileSync(outputPath, entry, "utf8");

const writtenText = readFileSync(outputPath, "utf8");
const actualLength = [...writtenText].length;
const actualWordCount = writtenText.trim() ? writtenText.trim().split(/\s+/u).length : 0;
const actualLineCount = writtenText.split(/\r\n|\r|\n/u).length;
if (actualLength !== expectedLength || Buffer.byteLength(writtenText, "utf8") !== expectedByteLength || actualWordCount !== expectedWordCount ||
    actualLineCount !== expectedLineCount || /[\r\n]/u.test(writtenText) || writtenText !== entry) {
  throw new Error(
    `Entry self-check failed: length expected ${expectedLength}, actual ${actualLength}; ` +
    `bytes expected ${expectedByteLength}, actual ${Buffer.byteLength(writtenText, "utf8")}; ` +
    `words expected ${expectedWordCount}, actual ${actualWordCount}; ` +
    `lines expected ${expectedLineCount}, actual ${actualLineCount}; ` +
    `text expected ${JSON.stringify(entry)}, actual ${JSON.stringify(writtenText)}`,
  );
}
