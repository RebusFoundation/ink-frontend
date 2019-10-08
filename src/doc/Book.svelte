<script>
  import Navbar from "./Navbar.svelte";
  import Chapter from "./Chapter.svelte";
  import ContentsButton from "./ContentsButton.svelte";
  import { stores } from "../stores";
  const {
    docStore,
    chapterStore,
    navigation,
    contents,
    currentLocation,
    theme,
    fontSize,
    chapterTitle
  } = stores();
  function handleCurrent({ detail }) {
    currentLocation.set({
      location: detail.highest.dataset.location
    });
  }
  let loadedLocations = [];
  function handleAppearing({ detail }) {
    loadedLocations = loadedLocations.concat(detail.nodes);
  }
  let bookBody;
  if (bookBody) {
    bookBody.style.setProperty("--reader-font-size", $fontSize);
  }
  export let book;
  export let chapter;
  if (book) {
    docStore.set(book);
  }
  if (chapter) {
    chapterStore.set(chapter);
  }
  let scrollY;
  $: console.log(scrollY);
</script>

<style>
  .BookBody {
    min-height: 100vh;
    background-color: white;
  }
</style>

<svelte:window bind:scrollY />
<svelte:head>
  {#if chapter.stylesheets.length !== 0}
    {#each chapter.stylesheets as sheet}
      <link
        rel="stylesheet"
        href={`/api/clean-css?css=${encodeURIComponent(sheet)}`} />
    {/each}
  {/if}
  <title>{book.name} - {$chapterTitle} - Rebus Ink</title>
</svelte:head>

{#if book}
  <div class="BookBody" bind:this={bookBody}>
    <!-- Should have all chapters appear, they should get values from stores and only use props for chapter assignments. Only when props match store is the chapter rendered -->
    {#each book.readingOrder as chapter, index}
      <Chapter
        on:current={handleCurrent}
        on:appearing={handleAppearing}
        chapterIndex={index} />
    {/each}
  </div>
{/if}

{#if $navigation}
  <Navbar navigation={$navigation} />
{:else}
  <Navbar />
{/if}
