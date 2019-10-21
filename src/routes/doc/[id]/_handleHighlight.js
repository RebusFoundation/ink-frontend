import textQuote from "dom-anchor-text-quote";
import seek from "dom-seek";
import { create } from "../../../api/create.js";
import { encode } from "universal-base64url";
// import { goto } from "@sapper/app";
import {stores} from '../../../stores';
const {updateNotes} = stores();

export function handleHighlight(range, root, chapter) {
  if (range && root) {
    const selector = textQuote.fromRange(root, range);
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
    let html = serializeRange(range);
    let content = `<blockquote data-original-quote>${html}</blockquote>`;
    let common = range.commonAncestorContainer
    if (!common.closest) {
      common = common.parentElement.closest("[data-location]")
    } else {
      common = common.closest("[data-location]")
    }
    const startOffset = common.textContent.indexOf(selector.exact);
    const note = {
      type: "Note",
      noteType: "reader:Highlight",
      inReplyTo: chapter.url,
      "oa:hasSelector": selector,
      json: {
        startOffset,
        startLocation,
        endLocation
      },
      content
    };
    // try {
    //   const contentRange = document.createRange();
    //   console.log(document.querySelector(`[data-location="${startLocation}"]`), document.querySelector(`[data-location="${endLocation}"]`))
    //   contentRange.setStartBefore(
    //     document.querySelector(`[data-location="${startLocation}"]`)
    //   );
    //   contentRange.setEndAfter(
    //     document.querySelector(`[data-location="${endLocation}"]`)
    //   );
    //   // let html = serializeRange(contentRange, note);
    //   // note.content = `<blockquote data-original-quote>${html}</blockquote>`;
    //   console.log(note.content, contentRange)
    // } catch (err) {
    //   console.log(err)
    // }
    const tempId = "temp-" + Math.floor(Math.random() * 10000000000000);
    highlightNote(selector, root, tempId, note);
    console.log(`${startLocation}–${endLocation}`);
    document.getSelection().collapse(root, 0);
    return create(note).then(activity => {
      document.querySelectorAll(`[data-note-id="${tempId}"]`).forEach(node => {
        node.dataset.noteId = activity.object.id;
      });
      document.getElementById("highlight-" + encode(tempId)).id = "highlight-" + encode(activity.object.id)
      updateNotes.set(activity.object.id)
      document.querySelector(`[href="${window.location.pathname}#note-${encode(tempId)}"]`).href = `[href="${window.location.pathname}#note-${encode(activity.object.id)}"]`
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
    if (!node.parentElement.closest(".Highlight")) {
      const highlight = document.createElement("mark");
      highlight.dataset.noteId = id;
      highlight.classList.add("Highlight");
      if (note.json.comment) {
        highlight.classList.add("Commented");
      }
      highlight.root = root;
      // highlight.addEventListener('click', event => {
      //   console.log('highlight clicked', highlight.dataset.href)
      //   event.preventDefault();
      //   event.stopPropagation();
      //   return goto(highlight.dataset.href);
      // });
      highlight.setAttribute("sapper-noscroll", "true");
      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);
      if (i === (nodes.length - 1)) {
        const span = document.createElement("span")
        span.id = "highlight-" + encode(id)
        span.classList.add('Highlight-anchor')
        highlight.insertAdjacentElement('afterbegin', span)
      }
      if (i === 0) {
        const a = document.createElement("a")
        a.href = `${window.location.pathname}#note-${encode(id)}`
        a.classList.add('Highlight-return-link')
        a.setAttribute('sapper-noscroll', '')
        a.addEventListener('click', sidebarScroll)
        a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`
        a.setAttribute('aria-label', 'Go to note in sidebar')
        highlight.insertAdjacentElement('afterend', a)
      }
    }
  }
}

function sidebarScroll (event) {
  // Based on https://github.com/visionmedia/page.js/blob/master/index.js
  // MIT License
  if ((event.which === null ? event.button : event.which) !== 1) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
  if (event.defaultPrevented) return;
  event.preventDefault();
  event.stopPropagation();
  const id = new URL(event.currentTarget.href).hash.replace('#', '')
  const element = document.getElementById(id)
  element.scrollIntoView({behavior: 'smooth'})
}

// function setNoteURL(id) {
//   const search = new window.URLSearchParams(window.location.search);
//   search.set("note", encode(id));
//   const url = new window.URL(window.location);
//   url.search = search.toString();
//   return url.href;
// }

export function highlightNotes(root, annotations) {
  for (const note of annotations.items) {
    if (note.selector && !note.json.archived) {
      highlightNote(note.selector, root, note.id, note);
    }
  }
}

// function getFragment (range) {
//   const fragment = range.cloneContents();
//   return fragment;
// }

// function serializeFragment (fragment) {
//   fragment.querySelectorAll("[data-reader]").forEach(element => {
//     element.parentElement.removeChild(element);
//   });
//   fragment.querySelectorAll("a.Highlight").forEach(element => {
//     element.replaceWith(element.textContent);
//   });
//   fragment
//     .querySelectorAll("[style]")
//     .forEach(element => element.removeAttribute("style"));
//   const placeholder = document.createElement("div");
//   placeholder.appendChild(fragment);
//   return placeholder.innerHTML;
// }

function serializeRange(range, note) {
  const placeholder = document.createElement("div");
  const fragment = range.cloneContents();
  fragment.querySelectorAll("[data-reader]").forEach(element => {
    element.parentElement.removeChild(element);
  });
  fragment.querySelectorAll("a.Highlight").forEach(element => {
    element.replaceWith(element.textContent);
  });
  fragment
    .querySelectorAll("[style]")
    .forEach(element => element.removeAttribute("style"));
  placeholder.appendChild(fragment);
  if (note) {
    highlightNote(note["oa:hasSelector"], placeholder, note.id, note);
  }
  return placeholder.innerHTML;
}
