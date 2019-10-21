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
  import { stores } from "../../stores";
  const { infoBook, currentInfoBook, infoContents, title } = stores();
  export let book;
  export let type;
  export let id;
  let width = 0;
  let sidebar = true;
  let sidebargrid = true;
  $: infoBook.set(book);
  $: currentInfoBook.set(type);
  $: title.set(type);
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
</style>

<svelte:window bind:innerWidth={width} />
<svelte:head>
  <title>{book.name} – {type} – Rebus Ink</title>
</svelte:head>
{#if type === 'annotations'}
  <div class="annotations">
    <h1>{book.name}</h1>
    {#each book.readingOrder as chapter, i}
      <AnnotationsChapter {chapter} index={i} {type} {id} />
    {/each}
  </div>
{:else if type === 'contents'}
  <div class="InfoBody">
    <div class="InfoMetadata">
      <Contents contents={$infoContents} {book} />
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
