<script context="module">
  export async function preload(page, session) {
    const [id, type] = page.params.infoBook;
    let book = {};
    if (session.user) {
      book = await this.fetch(`/api/book?url=${encodeURIComponent(`/${id}`)}`, {
        credentials: "include"
      })
        .then(response => response.json())
        .catch(err => this.error(err));
    }
    return { book, type, id };
  }
</script>

<script>
  import Toolbar from "../../components/Toolbar.svelte";
  import { open } from "../../actions/modal.js";
  import InfoActions from "../../components/InfoActions.svelte";
  import AnnotationsChapter from "../../library/AnnotationsChapter.svelte";
  import Contents from "../../doc/Contents.svelte";
  import NotesFilter from "../../doc/NotesFilter.svelte";
  import { stores } from "../../stores";
  const { docStore, currentInfoBook, contents, title, notesCollection, notes } = stores();
  export let book;
  export let type;
  export let id;
  let width = 0;
  let sidebar = true;
  let sidebargrid = true;
  $: docStore.set(book);
  $: currentInfoBook.set(type);
  $: title.set(type);
  let download = `/api/notes-book-export?id=${encodeURIComponent(`/${id}/`)}`
  function handleCollection (event) {
    notesCollection.set(event.detail)
  }
  $: if ($notesCollection !== "all") {
    download = `/api/notes-book-export?id=${encodeURIComponent(`/${id}/`)}&collection=${encodeURIComponent($notesCollection)}`
  } else {
    download = `/api/notes-book-export?id=${encodeURIComponent(`/${id}/`)}`
  }
  let filters = {
    show: true,
    question: true,
    flag: true,
    demote: true
  }
  function handleFilter (event) {
    const {filter, checked} = event.detail
    const addition = {}
    addition[filter] = checked
    filters = {...filters, ...addition}
  }
</script>

<style>
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
  .InfoAttribution {
    margin: 0;
    font-style: italic;
    color: var(--medium);
    font-size: 0.85rem;
  }
  h1 {
    font-size: 3rem;
    margin-top: 0;
    color: var(--medium);
    font-weight: 600;
  }
  .InfoBody {
    margin: 0 1rem;
  }
  .annotations {
    padding: 2rem 1rem;
  }
  .Button,
  .Button:link {
    font-family: var(--sans-fonts);
    font-size: 0.65rem;
    flex: 0 1 auto;
    line-height: 1;

    display: inline-flex;
    padding: 0.45rem 1.5rem 0.5rem;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--dark);
    border-radius: var(--border-radius);
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    /* transition: box-shadow 0.15s ease-in-out; */
    background-color: var(--rc-main);
    box-shadow: 1px 2px 4px 0 rgba(33, 33, 33, 0.1);
    text-decoration: none !important;
    border: none;
    align-items: center;width: 7.5rem;
  justify-content: space-between;
  font-size: 0.85rem;
  }

  .Button:hover,
  .Button:link:hover,
  .Button:link:visited:hover,
  .Button:visited:hover,
  .Button:link:visited:hover {
    color: white !important;
    background-color: var(--rc-dark);
    box-shadow: none;
    text-decoration: none;
  }

  .Button:active,
  .Button:link:active {
    background-color: var(--active);
  }
  .Button:focus {
    border-color: var(--link);
    outline: none;
    background-color: var(--link);
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 1px, 0px 0px 0px 3px var(--link);
  }
  .DownloadButtons {
    text-align: right;
  }
  .filterWrapper {
    margin: 1rem 0;
  }
</style>

<svelte:window bind:innerWidth={width} />
<svelte:head>
  <title>{book.name} – {type} – Rebus Ink</title>
</svelte:head>
{#if type === 'annotations'}
  <div class="annotations">
  <div class="DownloadButtons">
  
      <a class="Button" href="{download}" aria-label="Download HTML notes for this book" download><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg> .html</a>
      <a class="Button" href="{download + "&markdown=true"}" aria-label="Download HTML notes for this book" download><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg> .md</a>
      </div>
    <h1>{book.name}</h1>
  <div class="filterWrapper">
    <NotesFilter on:notes-collection={handleCollection} on:notes-flag-filter={handleFilter}  />
  </div>

    {#each book.readingOrder as chapter, i}
      <AnnotationsChapter {chapter} index={i} {type} {id} {filters} collection={$notesCollection} />
    {/each}
  </div>
{:else if type === 'contents'}
  <div class="InfoBody">
    <div class="InfoMetadata">
      <Contents contents={$contents} {book} />
    </div>
  </div>
{:else}
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
{/if}
