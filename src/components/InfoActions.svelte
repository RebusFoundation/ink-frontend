<script>
  import Button from "./Button.svelte";
  import TextButton from "./TextButton.svelte";
  import { collection } from "../api/collection.js";
  import { stores } from "../stores";
  import { fly, fade } from "svelte/transition";
  import InfoBody from "./InfoBody.svelte";
  const { infoBook, currentInfoBook, collections } = stores();
  export let modal;
  export let sidebar = false;
  export let history = false;
  export let side;
  export let id;
  let book;
  $: if (id && (!book || (id !== book.id))) {
    book = updateBook(id);
  }
  async function updateBook(id) {
    book = {
      navigation: { current: {} },
      json: { epubVersion: "2.0" },
      readingOrder: [{}]
    };
    const response = await fetch(`/api/book?url=${encodeURIComponent(id)}`);
    book = await response.json();
    return book;
  }
  let checkboxes = {};

  const search = new window.URLSearchParams(window.location.search);
  search.delete("item");
  search.delete("noHistory");
  const url = new window.URL(window.location);
  url.search = search.toString();
  let closeURL = url.href;
  function handleCollection(tag, input) {
    collection(tag, $infoBook, input.checked);
  }
</script>

<style>

</style>

<InfoBody {book} {side} {modal} />
