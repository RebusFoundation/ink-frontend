<script>
  import { stores } from "../stores";
  import NotesList from "../library/NotesList.svelte";
  import Toolbar from "../components/Toolbar.svelte";
  import NotesBar from "./NotesBar.svelte";
  import NotesFilter from "./NotesFilter.svelte";
  export let modal = false;
  const { chapterTitle, notes, updateNotes, docStore, notesCollection } = stores();
  function handleCollection (event) {
    notesCollection.set(event.detail)
  }
  let download
  $: if ($notesCollection !== "all") {
    download = `/api/notes-book-export?id=${encodeURIComponent($docStore.id)}&collection=${encodeURIComponent($notesCollection)}`
  } else {
    download = `/api/notes-book-export?id=${encodeURIComponent($docStore.id)}`
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
  let items = []
  $: if ($notes.items) {
    items = $notes.items.filter(item => {
      return filters[item.json.label || "show"]
    })
  }
</script>

<style>
  .wrapper {
    min-height: 100vh;
  }
</style>

<div class="wrapper">
  {#if !modal}
    <Toolbar notes={true}>
      <span slot="left-button" class="LeftButton" />
      <span slot="toolbar-title">
        Chapter Notes
        <!-- – {$chapterTitle} -->
      </span>
      <span slot="right-button" class="LeftButton">
      <a href="{download}" aria-label="Download HTML notes for this book" download><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg></a>
      </span>
    </Toolbar>
  {/if}
  <NotesFilter on:notes-collection={handleCollection} on:notes-flag-filter={handleFilter}  />
  <NotesList notes={items} current={modal && $updateNotes} {modal} />
  <NotesBar />
</div>
