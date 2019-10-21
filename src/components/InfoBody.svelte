<script>
  import Button from "./Button.svelte";
  import TextButton from "./TextButton.svelte";
  import { collection } from "../api/collection.js";
  import { fly, fade } from "svelte/transition";
  import CollectionCheckbox from './CollectionCheckbox.svelte'
  import { stores } from "../stores";
  const { collections } = stores();
  export let side;
  export let book;
  export let modal;

  const search = new window.URLSearchParams(window.location.search);
  search.delete("item");
  search.delete("noHistory");
  const url = new window.URL(window.location);
  url.search = search.toString();
  let closeURL = url.href;
  function handleCollection(tag, input) {
    collection(tag, book, input.checked);
  }
</script>

<style>
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-top: 2rem;
    color: var(--medium);
    font-weight: 600;
  }
  ol,
  .return {
    margin: 1rem auto;
    min-width: 250px;
    max-width: 450px;
    width: 100%;
    padding: 0;
  }
  ol a {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
    margin-left: -1px;
  }
  ol a:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  ol a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  ol li {
    list-style: none;
  }
  ol a.current {
    border-left: 5px solid var(--rc-darker);
    padding-left: calc(1rem - 6px);
    font-weight: 600;
  }
  .Collections {
    font-size: 1rem;
    text-transform: uppercase;
    margin-top: 1rem;
    margin-bottom: 0;
    text-align: left;
    padding: 0 1rem;
    margin: 1rem auto;
    min-width: 250px;
    max-width: 450px;
  }
  .CollectionBar {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background-color: var(--sidebar-background-color);
    margin: 0 0 0.5rem;
  }
  h2 {
    text-align: center;
    font-size: 1rem;
    margin: 0;
    color: var(--medium);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .Cover {
    text-align: center;
  }
  .Cover img {
    height: 150px;
  }
  .Attributions {
    padding: 0 1rem;
  }
  .InfoAttribution {
    margin: 0;
    font-style: italic;
    color: var(--medium);
    font-size: 0.85rem;
  }
  .Closer {
    font-size: 0.75rem;
    text-transform: uppercase;
    text-decoration: none;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    display: inline-block;

    color: var(--link);
    border: none;
    background-color: transparent;
  }
  .Closer:hover {
    color: var(--hover);
  }
  .Closer svg {
    vertical-align: middle;
  }
  .info-book {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>

{#await book}
  <div class="loading">...</div>
{:then infoBook}
  <div
    class="info-book"
    in:fly={{ duration: 1000, x: 100 }}
    out:fly={{ duration: 250, x: 100 }}>
    {#if modal}
      <h1>{infoBook.name || ''}</h1>
      {:else}
    <div class="CollectionBar">
      <a
        href={closeURL}
        class="Closer"
        aria-label="Close sidebar"
        sapper-noscroll>
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </a>
      <h2>{infoBook.name || ''}</h2>
      <span />
    </div>
    <div class="Cover">
      <img src={infoBook.cover} alt={infoBook.name} />
    </div>
    {#if infoBook.author}
      <div class="Attributions">
        {#each infoBook.author as attribution}
          <p class="InfoAttribution">{attribution.name}</p>
        {:else}
          <p class="InfoAttribution">No author</p>
        {/each}
        {#each infoBook.editor as attribution}
          <p class="InfoAttribution">{attribution.name} (editor)</p>
        {:else}
          <p class="InfoAttribution">No editor</p>
        {/each}
        {#each infoBook.translator as attribution}
          <p class="InfoAttribution">{attribution.name} (translator)</p>
        {:else}
          <p class="InfoAttribution">No translator</p>
        {/each}
        {#each infoBook.contributor as attribution}
          <p class="InfoAttribution">{attribution.name} (contributor)</p>
        {:else}
          <p class="InfoAttribution">No contributor</p>
        {/each}
        {#each infoBook.illustrator as attribution}
          <p class="InfoAttribution">{attribution.name} (illustrator)</p>
        {:else}
          <p class="InfoAttribution">No illustrator</p>
        {/each}
      </div>
    {/if}
    {/if}
    <ol>
      {#if infoBook.json.epubVersion}
        <li>
          <a
            class:infoBook={true}
            href={infoBook.navigation.current.path}
            data-close-modal>
            {infoBook.position ? 'Continue' : 'Read'}
          </a>
        </li>
        <li>
          <a
            href="/assets{new window.URL(infoBook.id + 'original.epub').pathname}">
            Download original
          </a>
        </li>
      {:else if infoBook.readingOrder[0] && infoBook.readingOrder[0].url}
        <li>
          <a
            href="/assets{new window.URL(infoBook.readingOrder[0].url).pathname}">
            Download original
          </a>
        </li>
      {:else}
        <li>
          <a href="/">&nbsp;</a>
        </li>
        <li>
          <a href="/">Download original</a>
        </li>
      {/if}
      <li class="first-item">
        <a href="{infoBook.url}metadata" data-close-modal>Metadata</a>
      </li>
      <li>
        <a href="{infoBook.url}contents" data-close-modal>Contents</a>
      </li>
      <li class="last-item">
        <a href="{infoBook.url}annotations" data-close-modal>Annotations</a>
      </li>
    </ol>

    {#if $collections}
      <h2 class="Collections">Manage Collections</h2>
      <ol class="CollectionsList">
        {#each $collections as tag}
          <li>
            <CollectionCheckbox {tag} tags={infoBook.tags.map(tag => tag.id)} {handleCollection} />
          </li>
        {/each}
      </ol>
    {/if}
  </div>
{/await}
