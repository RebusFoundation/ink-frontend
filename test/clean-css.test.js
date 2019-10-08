import tap from "tap";
import { cleanCSS } from "../src/api/clean-css.js";
import * as fs from "fs";
import * as path from "path";

tap.test("cleanCSS", async test => {
  const styles = fs.readFileSync(
    path.join(__dirname, "../dev-static/demo-epub/pg55456-images/OEBPS/0.css"),
    "utf8"
  );
  const result = await cleanCSS(
    styles,
    "https://example.com/dev-static/demo-epub/pg55456-images/OEBPS/0.css"
  );
  test.matchSnapshot(result, "cleanCSS");
});
