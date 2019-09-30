<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    let book = {};
    let contents = {};
    if (session.user) {
      book = await this.fetch(`/api/book?url=${encodeURIComponent(`/${id}`)}`, {
        credentials: "include"
      })
        .then(response => response.json())
        .catch(err => this.error(err));
      if (
        book.resources &&
        book.resources.find(
          item => item.rel.includes("contents") || item.rel.includes("ncx")
        )
      ) {
        const toc =
          book.resources.find(item => item.rel.includes("contents")) ||
          book.resources.find(item => item.rel.includes("ncx"));
        contents = await this.fetch(
          `/api/parse-toc?toc=${encodeURIComponent(toc.url)}`,
          {
            credentials: "include"
          }
        )
          .then(response => response.json())
          .catch(err => this.error(err));
      }
    }
    return { book, contents };
  }
</script>

<script>
  import Toolbar from "../../../components/Toolbar.svelte";
  import { open } from "../../../actions/modal.js";
  import { book as item, current } from "../../../stores/book.js";
  import InfoActions from "../../../components/InfoActions.svelte";
  import Contents from "../../../doc/Contents.svelte";
  export let book;
  export let contents;
  let width = 0;
  let sidebar = true;
  let sidebargrid = true;
  $: item.set(book);
  current.set("contents");
</script>

<style>
  .Sidebar {
    display: none;
    background-color: var(--sidebar-background-color);
  }
  @media (min-width: 1024px) {
    .Info.sidebar {
      display: grid;
      grid-template-columns: min-content 1fr;
      grid-template-areas:
        "sidebar body"
        "sidebar body";
    }
    .Info.sidebar .InfoBody {
      grid-column: 2 / -1;
      min-height: 200vh;
    }
    .Sidebar {
      display: block;
      background-color: white;
      height: 100vh;
      position: sticky;
      top: 0px;
      grid-area: sidebar;
      padding: 0 0.25rem;
    }
  }
  .InfoMetadata {
    margin: 0;
    width: 100%;
  }
  .InfoBody {
    margin: 0 1rem;
  }
</style>

<svelte:window bind:innerWidth={width} />
<svelte:head>
  <title>{book.name} – Contents – Rebus Ink</title>
</svelte:head>
<div class="Info" class:sidebar={sidebargrid}>
  {#if sidebar}
    <div
      class="Sidebar">
      <InfoActions modal={false} />
    </div>
  {/if}
  <!-- Menubar -->
  <Toolbar>
    <span slot="left-button">
      {#if width <= 1024}
        <a use:open={{ id: 'item-modal' }} href="/" class="Toolbar-link">
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
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </a>
      {:else}
        <button
          on:click={() => {
            sidebar = !sidebar;
            sidebargrid = !sidebargrid;
          }}
          href="/"
          class="Toolbar-link">
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
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      {/if}
    </span>
    <span slot="toolbar-title">{book.name}</span>
  </Toolbar>
  <div class="InfoBody">
    <div class="InfoMetadata">
      <Contents {contents} />
    </div>
  </div>
</div>
