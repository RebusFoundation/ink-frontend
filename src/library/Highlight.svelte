<script>
  // your script goes here
  import DOMPurify from "dompurify";
  const purifyConfig = {
    KEEP_CONTENT: false,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  export let note;
</script>

<style>
  .AnnotationsHighlight {
    --reader-font-size: 0.75rem;
    margin: 1rem;
    background-color: #fefdd3;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: var(--reader-font-size);
    display: grid;
    grid-template-columns: 1rem 1fr 1rem;
    position: relative;
    border: 0.25rem solid #ffffbd;
  }
  :global(.AnnotationsHighlight > *) {
    grid-column: 2 / 3;
  }
  :global(.AnnotationsHighlight > blockquote) {
    --reader-font-size: 0.75rem;
    position: relative;
    background-color: white;
    margin: 0;
    padding: 1rem;
    line-height: var(--reader-line-height);
    color: var(--reader-text-color);
    font-family: "Source Serif Pro", serif;
    border-bottom: 1px solid #ddd;
    border-radius: 0.25rem;
    grid-column: 1 / -1;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="AnnotationsHighlight">
  {@html DOMPurify.sanitize(note.content, purifyConfig)}
</div>
