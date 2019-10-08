import tap from "tap";
import { testProp } from "../src/api/allowed-css-props.js";

tap.test("Basic css prop test", async test => {
  test.ok(testProp("background-color", "#333"));
  test.ok(testProp("--css-var", "#333"));
  test.notOk(testProp("text-align", "justify"));
  test.notOk(testProp("bling-blong", "floopfloop"));
});
