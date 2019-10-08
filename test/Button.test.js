const tap = require("tap");
const Button = require("../src/components/Button.svelte").default;

tap.test("Button - primary", async test => {
  test.matchSnapshot(
    Button.render(
      { primary: true, close: true },
      { default: () => "Test Button" }
    ),
    "Button - primary"
  );
});
tap.test("Button - primary", async test => {
  test.matchSnapshot(
    Button.render(
      { primary: false, warning: true, noClose: true },
      { default: () => "Test Button" }
    ),
    "Button - not primary"
  );
});
tap.test("Button - primary", async test => {
  test.matchSnapshot(
    Button.render(
      { primary: true, close: true, href: "https://example.com" },
      { default: () => "Test Button" }
    ),
    "Link Button - primary"
  );
});
tap.test("Button - primary", async test => {
  test.matchSnapshot(
    Button.render(
      {
        primary: false,
        warning: true,
        noClose: true,
        href: "https://example.com"
      },
      { default: () => "Test Button" }
    ),
    "Link Button - not primary"
  );
});
