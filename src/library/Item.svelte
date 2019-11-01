<script>
  import { stores } from "../stores";
  import { goto } from "@sapper/app";
  const { infoBook, currentInfoBook } = stores();
  export let author = [];
  export let resources;
  export let tags;
  export let id;
  export let url;
  export let cover;
  export let name;
  export let json;
  export let readingOrder;
  export let type;
  export let editor;
  export let published;
  export let updated;
  export let readerId;
  export let navigation;
  export let layout = "covers";
  export let translator;
  export let illustrator;
  export let contributor;
  export let inLanguage = "en";
  export let current;
</script>

<style>
  .LibraryItem {
    position: relative;
    font-family: var(--sans-fonts);
  }
  .LibraryItem > .covers {
    display: grid;
  }
  .LibraryItem > .covers:focus-within {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
  }
  .list {
    display: grid;
    border-bottom: 1px solid #f0f0f0;
    padding: 0.5rem;
    grid-gap: 1rem;
    grid-template-columns: 3rem 1fr;
  }
  .list:hover {
    cursor: pointer;
    background-color: #f9f9f9;
  }

  .BookCard-group {
    margin-right: 0;
  }

  .BookCard-icon {
    font-size: 0.75rem;
    text-align: center;
    line-height: 1.25;
    text-transform: uppercase;
    color: #999;
    background-color: #f0f0f0;
    display: block;
    width: 100%;
    max-height: none;
    object-fit: cover;
    object-position: top left;
    width: 6rem;
    height: 8.5rem;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 2px 0 rgba(133, 133, 133, 0.1);
  }
  .BookCard-title {
    margin: 0.25rem 0;
    padding: 0;
    font-weight: 750;
    font-size: 0.7rem;
    line-height: 1;
  }

  .BookCard-attribution {
    font-weight: 400;
    font-style: italic;
    text-decoration: none;
    color: #666;
    margin-right: 0.25rem;
  }
  .BookCard-attributionLabel {
    font-weight: 300;
    color: #888;
  }
  a.BookCard-link {
    text-decoration: none;
    font-weight: inherit;
    color: var(--dark);
    display: block;
    position: relative;
  }
  .BookCard-link::after {
    content: "";
    position: absolute;
    left: -1rem;
    top: -1rem;
    width: 100%;
    height: 100%;
    padding-bottom: 4rem;
    box-sizing: border-box;
    background-color: transparent;
    /*Other styles*/
  }
  .BookCard-paragraph {
    line-height: 0.75rem;
    font-weight: 300;
    margin-top: 0.25rem;
    font-size: 0.65rem;
    --local-font-size: 0.65rem;
  }
  .BookCard-paragraph--tags {
    margin-top: 0.5rem;
  }
  .covers .BookCard-icon {
    box-shadow: 1px 2px 2px 0 rgba(133, 133, 133, 0.1);
  }
  .square .BookCard-group {
    display: none;
  }
  .square .BookCard-icon {
    width: 100%;
    height: 6rem;
    border-radius: 0px;
  }
  .square .BookCard-overlay {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.62);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity cubic-bezier(0.075, 0.82, 0.165, 1) 250ms;
    border-radius: 0;
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .square:hover .BookCard-overlay,
  .square .BookCard-overlay:focus {
    opacity: 1;
    pointer-events: all;
  }
  .list .BookCard-icon {
    height: 3rem;
    width: 3rem;
  }
  .list .BookCard-paragraph {
    padding: 0;
    margin: 0;
  }
  .list .BookCard-title {
    margin: 0rem 0 0.25rem;
    font-weight: 700;
    font-size: 1rem;
  }
  .list .BookCard-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .LibraryItem.current {
    background-color: var(--sidebar-background-color);
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="LibraryItem" class:current={current === id}>
  <div class={layout}>
    <a data-sidebar={id} href={url} class="icon-link" sapper-noscroll>
      <img class="BookCard-icon" alt={'Cover for ' + name} src={cover} />
    </a>
    {#if layout === 'square'}
      <a href={url} class="BookCard-overlay">{name}</a>
    {/if}
    <div class="BookCard-group">
      <h4 class="BookCard-title">
        <a href={url} class="BookCard-link" data-sidebar={id} sapper-noscroll>
          {name}
        </a>
      </h4>
      <p class="BookCard-paragraph">
        {#each author as attribution}
          <!-- content here -->
          <span class="BookCard-attribution">{attribution.name}</span>
        {:else}
          <!-- empty list -->
        {/each}
      </p>
    </div>
  </div>
</div>
