<script>
  import { decode, encode } from "universal-base64url";
  import WithSidebars from "../components/WithSidebars.svelte";
  import { stores as inkStores } from "../stores";
  import Collections from "../collections/Collections.svelte";
  import InfoActions from "../components/InfoActions.svelte";
  import BookContents from "../doc/BookContents.svelte";
  import NoteModal from "../doc/NoteModal.svelte";
  import UploadSidebar from "../uploader/UploadSidebar.svelte";
  import SidebarModal from './SidebarModal.svelte'
  import {opener, closer, activeModal} from "../actions/modal.js"
  import { stores, goto } from "@sapper/app";
  const { page, session } = stores();
  const { title, infoBook, currentInfoBook, note } = inkStores();
  let query = {};
  let leftSidebar;
  let rightSidebar;
  let params = {};
  let collection = 'all'
  $: if ($page) {
    query = $page.query;
    params = $page.params;
    if (params.infoBook) {
      leftSidebar = "item";
    } if (params.path) {
      leftSidebar = "contents";
    } else {
      leftSidebar = "collections";
    }
    if (params.collection) {
      collection = params.collection[0]
    }
    if (query.item) {
      infoBook.set({ id: decode(query.item) });
      currentInfoBook.set("");
      rightSidebar = "item";
    } else if (query.upload) {
      rightSidebar = "upload";
    } else if (query.note) {
      note.set({ id: decode(query.note) });
      rightSidebar = "note";
    } else if (query.chapternotes) {
      rightSidebar = "chapternotes";
    } else if (query.booknote) {
      rightSidebar = "booknote";
    } else if (query.chapter) {
      rightSidebar = "chapter";
    } else if (query.webpage) {
      rightSidebar = "webpage";
    } else if (query.addbooks) {
      rightSidebar = "addbooks";
    } else if (params.collection) {
      rightSidebar = "upload";
    }
  }
  $: if (width <= 1200 && rightSidebar && query[rightSidebar]) {
    opener({id: rightSidebar + '-modal'})
  } else {
    closer()
  }
  $: if ($session) {
    console.log($session);
  }
  let width
</script>

<style>
  main {
    position: relative;
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100vh;
  }
</style>

<svelte:window bind:innerWidth={width} />
<SidebarModal id={leftSidebar + '-modal'}>
  {#if leftSidebar === 'item'}
    <InfoActions modal={true} sidebar={true} />
  {:else if leftSidebar === 'contents'}
      <BookContents modal={true} />
  {:else}
    <Collections modal={true} />
  {/if}
</SidebarModal>
<SidebarModal id={rightSidebar + '-modal'}>
  {#if rightSidebar === 'item'}
    <InfoActions modal={true} sidebar={true} />
  {:else if  rightSidebar === 'upload'}
    <UploadSidebar {collection} modal={true} />
  {:else if rightSidebar === 'note'}
    <NoteModal /> 
  {/if}
</SidebarModal>
<main>
  <WithSidebars
    title={$title}
    leftModal={leftSidebar + '-modal'}
    rightModal={rightSidebar + '-modal'}
    rightLabel={rightSidebar}>
    <div slot="left-sidebar">
      {#if leftSidebar === 'item'}
        <InfoActions modal={false} sidebar={true} />
      {:else if leftSidebar === 'contents'}
        <BookContents modal={false} />
      {:else}
        <Collections />
      {/if}
    </div>
    <slot />
    <div slot="right-sidebar">
      {#if rightSidebar === 'item'}
        <InfoActions modal={false} sidebar={true} />
      {:else if  rightSidebar === 'upload'}
        <UploadSidebar {collection} />
      {:else if rightSidebar === 'note'}
        <NoteModal /> 
      {/if}
    </div>
  </WithSidebars>
</main>
