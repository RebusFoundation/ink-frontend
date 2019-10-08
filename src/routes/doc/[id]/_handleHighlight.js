import textQuote from "dom-anchor-text-quote";
import seek from "dom-seek";
import { create } from "../../../api/create.js";

export function handleHighlight(range, root, chapter) {
  if (range && root) {
    const selector = textQuote.fromRange(root, range);
    const html = serializeRange(range);
    const content = `<blockquote data-original-quote>${html}</blockquote>`;
    // const content = `<blockquote data-original-quote>${html}</blockquote>`
    // const docurl = new URL(document, window.location).href
    let startLocation;
    if (range.startContainer.nodeType === window.Node.TEXT_NODE) {
      startLocation = range.startContainer.parentElement.closest(
        "[data-location]"
      ).dataset.location;
    } else {
      startLocation = range.startContainer.closest("[data-location]").dataset
        .location;
    }
    let endLocation;
    if (range.endContainer.nodeType === window.Node.TEXT_NODE) {
      endLocation = range.endContainer.parentElement.closest("[data-location]")
        .dataset.location;
    } else {
      endLocation = range.endContainer.closest("[data-location]").dataset
        .location;
    }
    const note = {
      type: "Note",
      noteType: "reader:Highlight",
      inReplyTo: chapter.url,
      "oa:hasSelector": selector,
      json: {
        startLocation,
        endLocation
      },
      content
    };
    const tempId = "temp-" + Math.floor(Math.random() * 10000000000000);
    highlightNote(selector, root, tempId, note);
    console.log(`${startLocation}–${endLocation}`);
    document.getSelection().collapse(root, 0);
    return create(note).then(activity => {
      document.querySelectorAll(`[data-note-id="${tempId}"]`).forEach(node => {
        node.dataset.noteId = activity.object.id;
      });
    });
  }
}

function highlightNote(selector, root, id, note) {
  const seeker = document.createNodeIterator(root, window.NodeFilter.SHOW_TEXT);
  function split(where) {
    const count = seek(seeker, where);
    if (count !== where) {
      // Split the text at the offset
      seeker.referenceNode.splitText(where - count);

      // Seek to the exact offset.
      seek(seeker, where - count);
    }
    return seeker.referenceNode;
  }
  const positions = textQuote.toTextPosition(root, selector);
  const start = split(positions.start);
  split(positions.end - positions.start);
  var nodes = [];
  while (seeker.referenceNode !== start) {
    const node = seeker.previousNode();
    if (node !== start) {
      nodes.push(node);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (
      node.parentElement.closest(".BookBody") &&
      !node.parentElement.closest("[data-annotation-tool]") &&
      !node.parentElement.closest("reader-highlight")
    ) {
      // Create a highlight
      const highlight = document.createElement("reader-highlight");
      highlight.dataset.noteId = id;
      highlight.classList.add("Highlight");
      highlight.root = root;
      highlight.addEventListener("click", event => {
        window.requestAnimationFrame(() => {
          const customEvent = new window.CustomEvent("highlight-selected", {
            detail: { id: note.id, note }
          });
          window.dispatchEvent(customEvent);
        });
      });
      // Wrap it around the text node
      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);
    }
  }
}

export function highlightNotes(root, annotations) {
  for (const note of annotations.items) {
    if (note.selector) {
      highlightNote(note.selector, root, note.id, note);
    }
  }
}

function serializeRange(range) {
  const placeholder = document.createElement("div");
  const fragment = range.cloneContents();
  fragment.querySelectorAll("[data-reader]").forEach(element => {
    element.parentElement.removeChild(element);
  });
  fragment.querySelectorAll("reader-highlight").forEach(element => {
    element.replaceWith(element.textContent);
  });
  fragment
    .querySelectorAll("[style]")
    .forEach(element => element.removeAttribute("style"));
  placeholder.appendChild(fragment);
  return placeholder.innerHTML;
}
