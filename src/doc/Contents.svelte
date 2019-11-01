<script>
  import ContentsItem from "./ContentsItem.svelte";
  export let contents;
  export let book;
  export let chapter;
  let current;
  $: if (chapter) {
    current = new URL(chapter.url, window.location.href).pathname 
  }
</script>

<style>
  .Contents {
    counter-reset: contents;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .Contents > :global(li > ol) {
    counter-reset: contents;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .ContentsHeading {
    text-align: left;
    margin: 0 0 1rem;
    padding: 0 1rem;
  }
  /* .Contents > :global(li > ol > li > a:before), .Contents > :global(li > ol > li > span:before) {
    content: counter(subcontents) ". ";
    color: var(--dark);
  } */
</style>

<h1 class="ContentsHeading">{book.name}</h1>
<ol class="Contents">
  {#if contents.children}
    {#each contents.children as item}
      <ContentsItem {item} {current} />
    {/each}
  {/if}
</ol>
