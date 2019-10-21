<script>
  import { stores } from "../stores";
  import NotesList from '../library/NotesList.svelte'
  import Toolbar from "../components/Toolbar.svelte";
  import NotesBar from "./NotesBar.svelte";
  export let modal = false;
  const {
    chapterTitle,
    notes,
    updateNotes
  } = stores();
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
        <span slot="toolbar-title">Chapter Notes
         <!-- – {$chapterTitle} -->
         </span>
        <span slot="right-button" class="LeftButton" />
  </Toolbar>
{/if}
  <NotesList notes={$notes.items} current={modal && $updateNotes} {modal} />
  <NotesBar />
</div>