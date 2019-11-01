<script>
  import { decode, encode } from "universal-base64url";
  import WithSidebars from "../components/WithSidebars.svelte";
  import { stores as inkStores } from "../stores";
  import Modals from "./Modals.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { opener, closer } from "../actions/modal.js";
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();
  const { title, infoBook, currentInfoBook, note } = inkStores();
  let query = {};
  let leftSidebar;
  let rightSidebar;
  let params = {};
  let collection = "all";
  let history;
  let firstRun = true;
  let sidebarId;
  $: if ($page) {
    query = $page.query;
    params = $page.params;
    if (!firstRun && !query.noHistory) {
      history = true;
    } else {
      firstRun = false;
    }
    if (params.infoBook) {
      leftSidebar = "info";
      rightSidebar = "empty";
    } else if (params.path) {
      leftSidebar = "contents";
      rightSidebar = "notes";
    } else {
      leftSidebar = "collections";
    }
    if (params.collection) {
      collection = params.collection[0];
    }
    if (query.item) {
      sidebarId = decode(query.item);
      rightSidebar = "item";
    } else if (query.upload) {
      rightSidebar = "upload";
    } else if (query.note) {
      sidebarId = decode(query.note);
      rightSidebar = "note";
    } else if (query.chapternotes) {
      rightSidebar = "chapternotes";
    } else if (query.booknote) {
      rightSidebar = "booknote";
    } else if (query.chapter) {
      rightSidebar = "chapter";
    } else if (query.webpage) {
      rightSidebar = "webpage";
    } else if (query.addbooks) {
      rightSidebar = "addbooks";
    } else if (params.collection) {
      rightSidebar = "upload";
      leftSidebar = "collections";
    } else if ($page.path === "/") {
      rightSidebar = "upload";
      leftSidebar = "collections";
    }
  }
  $: if (width <= 1024 && rightSidebar && query[rightSidebar]) {
    opener({ id: rightSidebar + "-modal" });
  } else {
    closer();
  }
  let width;
</script>

<style>
  main {
    position: relative;
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100vh;
  }
</style>

<svelte:window bind:innerWidth={width} />
<svelte:body />
<Modals {leftSidebar} {rightSidebar} {collection} id={sidebarId} />
<main class:reader={params.path}>
  <WithSidebars
    title={$title}
    leftModal={leftSidebar + '-modal'}
    rightModal={rightSidebar + '-modal'}
    rightLabel={rightSidebar}>
    <div slot="left-sidebar" data-no-highlight>
      <Sidebar
        sidebar={leftSidebar}
        {collection}
        history={false}
        side={'left'}
        id={sidebarId} />
    </div>
    <slot />
    <div slot="right-sidebar" data-no-highlight>
      <Sidebar
        sidebar={rightSidebar}
        {collection}
        {history}
        side={'right'}
        id={sidebarId} />
    </div>
  </WithSidebars>
</main>
