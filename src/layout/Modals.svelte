<script>
  import Collections from "../collections/Collections.svelte";
  import InfoActions from "../components/InfoActions.svelte";
  import BookContents from "../doc/BookContents.svelte";
  import NoteModal from "../doc/NoteModal.svelte";
  import UploadSidebar from "../uploader/UploadSidebar.svelte";
  import NotesSidebar from "../doc/NotesSidebar.svelte";
  import SidebarModal from "./SidebarModal.svelte";
  export let rightSidebar;
  export let leftSidebar;
  export let collection;
  export let id;
</script>

<style>
  .SignOut {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    text-transform: uppercase;
    font-size: 0.75rem;
    text-decoration: none;
  }
</style>

<SidebarModal id={leftSidebar + '-modal'}>
  {#if leftSidebar === 'item'}
    <InfoActions modal={true} sidebar={true} />
  {:else if leftSidebar === 'contents'}
    <BookContents modal={true} />
  {:else}
    <Collections modal={true} />
  {/if}
  <a href="/logout" class="SignOut">Sign Out</a>
</SidebarModal>
<SidebarModal id={rightSidebar + '-modal'}>
  {#if rightSidebar === 'item'}
    <InfoActions modal={true} sidebar={true} {id} />
  {:else if rightSidebar === 'upload'}
    <UploadSidebar {collection} modal={true} />
  {:else if rightSidebar === 'note'}
    <NoteModal {id} />
  {:else if rightSidebar === 'notes'}
    <NotesSidebar modal={false} />
  {/if}
</SidebarModal>
