const tap = require("tap");
const TextButton = require("../src/components/TextButton.svelte").default;

tap.test("TextButton - primary", async test => {
  test.matchSnapshot(
    TextButton.render(
      { primary: true, close: true },
      { default: () => "Test TextButton" }
    ),
    "TextButton - primary"
  );
});
tap.test("TextButton - primary", async test => {
  test.matchSnapshot(
    TextButton.render(
      { primary: false, warning: true, noClose: true },
      { default: () => "Test TextButton" }
    ),
    "TextButton - not primary"
  );
});
tap.test("TextButton - primary", async test => {
  test.matchSnapshot(
    TextButton.render(
      { primary: true, close: true, href: "https://example.com" },
      { default: () => "Test TextButton" }
    ),
    "Link TextButton - primary"
  );
});
tap.test("TextButton - primary", async test => {
  test.matchSnapshot(
    TextButton.render(
      {
        primary: false,
        warning: true,
        noClose: true,
        href: "https://example.com"
      },
      { default: () => "Test TextButton" }
    ),
    "Link TextButton - not primary"
  );
});
