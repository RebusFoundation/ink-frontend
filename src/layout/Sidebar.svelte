<script>
  import Collections from "../collections/Collections.svelte";
  import InfoActions from "../components/InfoActions.svelte";
  import InfoNavigation from "../components/InfoNavigation.svelte";
  import BookContents from "../doc/BookContents.svelte";
  import NoteModal from "../doc/NoteModal.svelte";
  import UploadSidebar from "../uploader/UploadSidebar.svelte";
  import NotesSidebar from "../doc/NotesSidebar.svelte";
  export let sidebar;
  export let collection;
  export let history;
  export let side;
  export let id;
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
{#if sidebar === 'item'}
  <InfoActions modal={false} sidebar={true} {history} {side} {id} />
{:else if sidebar === 'info'}
  <InfoNavigation modal={false} sidebar={true} {history} {side} />
{:else if sidebar === 'contents'}
  <BookContents modal={false} {side} />
{:else if sidebar === 'upload'}
  <UploadSidebar {collection} {side} />
{:else if sidebar === 'note'}
  <NoteModal {history} {side} {id} />
{:else if sidebar === 'collections'}
  <Collections {collection} modal={false} />
{:else if sidebar === 'notes'}
  <NotesSidebar modal={false} />
{:else}
  <div class="empty" />
{/if}
