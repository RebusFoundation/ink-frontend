<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    let book = {};
    if (session.user) {
      book = await this.fetch(`/api/book?url=${encodeURIComponent(`/${id}`)}`, {
        credentials: "include"
      })
        .then(response => response.json())
        .catch(err => this.error(err));
    }
    return { book };
  }
</script>

<script>
  import Toolbar from "../../../components/Toolbar.svelte";
  import { open } from "../../../actions/modal.js";
  import { book as item, current } from "../../../stores/book.js";
  import InfoActions from "../../../components/InfoActions.svelte";
  export let book;
  let width = 0;
  let sidebar = true;
  let sidebargrid = true;
  $: item.set(book);
  current.set("metadata");
</script>

<style>
  .Sidebar {
    display: none;
    background-color: var(--sidebar-background-color);
  }
  .InfoCover {
    font-size: 0.75rem;
    text-align: center;
    line-height: 1.25;
    text-transform: uppercase;
    color: #999;
    background-color: #f0f0f0;
    display: block;
    max-height: none;
    object-fit: cover;
    object-position: top left;
    width: 9rem;
    height: 12.75rem;
    border-radius: var(--border-radius);
    margin: 1rem auto;
    border: 1px solid #f0f0f0;
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
      height: 100vh;
      position: sticky;
      top: 0px;
      grid-area: sidebar;
      padding: 0 0.25rem;
    }
    .InfoBody {
      display: grid;
      grid-template-columns: 0.7fr 0.3fr;
      grid-template-areas:
        "metadata cover"
        "metadata cover";
      grid-gap: 1rem;
      padding-top: 1rem;
    }
    .InfoCover {
      grid-area: cover;
      height: auto;
      width: auto;
      position: sticky;
      top: 32px;
    }
  }
  .InfoMetadata {
    margin: 0 auto;
    min-width: 250px;
    max-width: 650px;
    width: 100%;
  }
  h1 {
    font-size: 3rem;
    margin-top: 0;
    color: var(--medium);
    font-weight: 600;
  }
  .InfoAttribution {
    margin: 0;
    font-style: italic;
    color: var(--medium);
    font-size: 0.85rem;
  }
  .InfoBody {
    margin: 0 1rem;
  }
</style>

<svelte:window bind:innerWidth={width} />
<svelte:head>
  <title>{book.name} – Metadata – Rebus Ink</title>
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

    <img class="InfoCover" alt={'Cover for ' + book.name} src={book.cover} />
    <div class="InfoMetadata">
      <h1>{book.name}</h1>
      <div class="Attributions">
        {#each book.author as attribution}
          <p class="InfoAttribution">{attribution.name}</p>
        {:else}
          <p class="InfoAttribution">No author</p>
        {/each}
        {#each book.editor as attribution}
          <p class="InfoAttribution">{attribution.name} (editor)</p>
        {:else}
          <p class="InfoAttribution">No editor</p>
        {/each}
        {#each book.translator as attribution}
          <p class="InfoAttribution">{attribution.name} (translator)</p>
        {:else}
          <p class="InfoAttribution">No translator</p>
        {/each}
        {#each book.contributor as attribution}
          <p class="InfoAttribution">{attribution.name} (contributor)</p>
        {:else}
          <p class="InfoAttribution">No contributor</p>
        {/each}
        {#each book.illustrator as attribution}
          <p class="InfoAttribution">{attribution.name} (illustrator)</p>
        {:else}
          <p class="InfoAttribution">No illustrator</p>
        {/each}
      </div>
    </div>
  </div>
</div>
