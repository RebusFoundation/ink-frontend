import tap from "tap";
import { chapterToJSON } from "../src/api/chapter-to-json.js";
import * as fs from "fs";
import * as path from "path";

tap.test("chapterToJSON", async test => {
  const chapter = fs.readFileSync(
    path.join(
      __dirname,
      "../dev-static/demo-epub/pg55456-images/OEBPS/@public@vhost@g@gutenberg@html@files@55456@55456-h@55456-h-0.htm.html"
    ),
    "utf8"
  );
  const result = await chapterToJSON(
    chapter,
    "https://example.com/dev-static/demo-epub/pg55456-images/OEBPS/@public@vhost@g@gutenberg@html@files@55456@55456-h@55456-h-0.htm.html",
    "application/xhtml+xml",
    0
  );
  test.matchSnapshot(result, "chapterToJSON");
});
tap.test("chapterToJSON", async test => {
  const chapter = fs.readFileSync(
    path.join(
      __dirname,
      "../dev-static/demo-epub/pg55456-images/OEBPS/@public@vhost@g@gutenberg@html@files@55456@55456-h@55456-h-1.htm.xhtml"
    ),
    "utf8"
  );
  const result = await chapterToJSON(
    chapter,
    "https://example.com/dev-static/demo-epub/pg55456-images/OEBPS/@public@vhost@g@gutenberg@html@files@55456@55456-h@55456-h-1.htm.xhtml",
    "application/xhtml+xml",
    1
  );
  test.matchSnapshot(result, "chapterToJSON");
});
tap.test("chapterToJSON", async test => {
  const result = await chapterToJSON(
    `<html><head><title>Title</title></head><body>Yo!<br>Yo!</body></html>`,
    "https://example.com/dev-static/demo-epub/pg55456-images/OEBPS/@public@vhost@g@gutenberg@html@files@55456@55456-h@55456-h-1.htm.xhtml",
    "application/xhtml+xml",
    1
  );
  test.matchSnapshot(result, "chapterToJSON");
});
