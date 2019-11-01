<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { highlightNotes } from "../routes/doc/[id]/_handleHighlight.js";
  import { stores } from "../stores";
  import { fade } from "svelte/transition";
  import ChapterBody from "./ChapterBody.svelte";
  const {
    docStore,
    chapterStore,
    navigation,
    contents,
    currentLocation,
    theme,
    fontSize,
    notes
  } = stores();
  const dispatch = createEventDispatcher();
  let { url, index } = $chapterStore;
  let positionObserver;
  let locationObserver;
  let highest;
  let chapterElement;
  export let chapterIndex;
  export let chapter;
  onMount(() => {
    if (!positionObserver) {
      positionObserver = new window.IntersectionObserver(onPosition, {
        rootMargin: "-15% 0px -75% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      });
    }
    if (!locationObserver) {
      locationObserver = new window.IntersectionObserver(onLocation, {
        rootMargin: "15% 0px 75% 0px",
        threshold: [0]
      });
    }
    function onPosition(entries) {
      if (entries[0].target !== highest) {
        highest = entries[0].target;
        dispatch("current", {
          highest
        });
      }
    }
    function onLocation(entries) {
      const nodes = entries.map(entry => {
        locationObserver.unobserve(entry.target);
        const { target, boundingClientRect } = entry;
        const { top, left, width, height } = boundingClientRect;
        return {
          target,
          top,
          width,
          height,
          location: target.dataset.location
        };
      });
      dispatch("appearing", {
        nodes
      });
    }
  });
  onDestroy(() => {
    if (positionObserver) positionObserver.disconnect();
    if (locationObserver) locationObserver.disconnect();
  });
  $: if (chapterElement) {
    chapterElement.querySelectorAll("[data-location]").forEach(element => {
      positionObserver.observe(element);
      locationObserver.observe(element);
    });
  }
  $: if (
    chapterElement &&
    $notes.items &&
    $notes.chapter === $chapterStore.url
  ) {
    document
      .querySelectorAll(`.Chapter mark[data-note-id]`)
      .forEach(highlight => highlight.replaceWith(...highlight.childNodes));
    document
      .querySelectorAll(`.Chapter .Highlight-return-link`)
      .forEach(arrow => arrow.parentElement.removeChild(arrow));
    highlightNotes(chapterElement, $notes);
  }
</script>

<style>
  .Chapter {
    all: initial;
    position: relative;
    line-height: var(--reader-line-height);
    font-size: var(--reader-font-size);
    color: var(--reader-text-color);
    font-family: var(--reader-font-family);
    background-color: var(--main-background-color);
    line-height: var(--reader-line-height);
    display: block;
    contain: content;
    padding: 0;
    padding-top: 5vh;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(
        var(--reader-min-column-width),
        var(--reader-max-column-width)
      )
      minmax(0, 1fr);
    grid-template-areas: "leftmargin maintext rightmargin";
    grid-row-gap: var(--reader-paragraph-spacing);
    min-height: 100vh;
  }
</style>

{#if $docStore && $chapterStore && $chapterStore.index === chapterIndex}
  <div class="Chapter" bind:this={chapterElement}>
    <ChapterBody html={$chapterStore.html} />
    <div class="ChapterNotes" />
  </div>
{/if}
