<script context="module">
  // your script goes here
  export async function preload({ params, query }) {
    const { id } = params;
    const response = await this.fetch(`/api/id-to-opf?id=%2F${id}`);
    const bookData = await response.json();
    return { bookData };
  }
</script>

<script>
  import { stores } from "../../../stores";
  const { docStore } = stores();
  export let bookData;
  docStore.set(bookData);
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<h1>{$docStore.name}</h1>
