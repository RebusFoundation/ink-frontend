const tap = require("tap");
const Loading = require("../src/components/Loading.svelte").default;

tap.test("Loading", async test => {
  test.matchSnapshot(Loading.render(), "Loading");
});
