const tap = require("tap");
const Toolbar = require("../src/components/Toolbar.svelte").default;

tap.test("Toolbar - no content", async test => {
  test.matchSnapshot(Toolbar.render(), "Toolbar - no content");
});
tap.test("Toolbar - full content", async test => {
  test.matchSnapshot(
    Toolbar.render(
      {},
      {
        "left-button": () => "Left",
        "right-button": () => `<a href="/" class="Toolbar-link Right-button">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="square"
    stroke-linejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
</a>`,
        "toolbar-title": () => "Title"
      }
    ),
    "Toolbar - with content"
  );
});
