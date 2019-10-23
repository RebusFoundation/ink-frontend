<script>
  import { fade } from "svelte/transition";
  export let html;
</script>

<!-- markup (zero or more items) goes here -->
<!-- <div class="ChapterBody">{@html html }</div> -->
<div class="ChapterBody" transition:fade={{duration: 250}}>
  {@html html}
</div>
