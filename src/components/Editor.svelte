<script>
  import { onMount, tick } from "svelte";
  import DOMPurify from "dompurify";
  import { update } from "../api/update.js";
  import { get } from "../api/fetch-wrap.js";

  const purifyConfig = {
    KEEP_CONTENT: false,
    RETURN_DOM: true,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  const commentConfig = {
    KEEP_CONTENT: false,
    ALLOWED_TAGS: ["p", "i", "em", "strong", "a", "b", "ul", "li", "ol", "blockquote", "img", "pre", "code"],
    FORBID_ATTR: ["style"]
  };
  export let note;
  let innerHTML = "";
  $: if (note && !note.loading) {
    if (note.json.comment) {
      innerHTML = DOMPurify.sanitize(note.json.comment, purifyConfig);
    }
  }
  function saver(id, content) {
    const json = { ...note.json, comment: content };
    const payload = { ...note, json };
    document.querySelectorAll(`[data-note-id="${id}"]`).forEach(node => {
      node.classList.add("Commented");
    });
    update(payload);
  }

  function content() {
    return container.querySelector(".ql-editor").innerHTML;
  }
  let container;
  let quill;
  let hasFocus;
  onMount(async () => {
    note = await get(`/api/get?path=${encodeURIComponent(note.id)}`);
    const quillModule = await import("quill");
    await tick();
    const Quill = quillModule.default;
    if (container && process.browser) {
      quill = new Quill(container, {
        modules: {
          toolbar: [
            ["bold", "italic"],
            ["image", "code-block"],
            ["link", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"]
          ]
        },
        theme: "snow"
      });
      quill.on("selection-change", (range, oldRange, source) => {
        if (range) {
          hasFocus = true;
        } else {
          hasFocus = false;
          saver(note.id, content());
        }
      });
      quill.on("text-change", () => {
        const customEvent = new window.CustomEvent("reader:notes-text-change", {
          detail: { id: note.id, content: content() }
        });
        window.dispatchEvent(customEvent);
      });
    }
  });
</script>

<style>
  /* your styles go here */
  .Editor.ql-container.ql-snow,
  :global(.NoteModal .ql-toolbar.ql-snow) {
    border: none;
  }
  .Editor :global(.ql-editor) {
    height: auto;
  }
  .Editor.hasFocus :global(.ql-editor) {
    background-color: #f7f7f7;
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="ql-snow ql-container Editor" class:hasFocus bind:this={container}>
  {@html innerHTML}
</div>
