import * as book from "./book.js";
import * as layout from "./layout.js";
import * as doc from "./doc.js";
import { writable } from "svelte/store";

let collections;
let recent;
const note = writable({});
let updating = false;
const jobs = writable([]);
const notesEditor = writable({});

export function stores() {
  let update = false;
  if (!collections) {
    collections = writable([]);
    update = true;
  }
  if (!recent) {
    recent = writable([]);
    update = true;
  }
  if (update && !updating) updateCollections();
  return { ...book, ...layout, ...doc, collections, recent, note, jobs, notesEditor };
}

function updateCollections() {
  if (!process.browser) return;
  updating = true;
  window
    .fetch(`/recent.json`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return {};
      }
    })
    .then(json => {
      recent.set(json);
      collections.set(json.tags);
      updating = false;
    });
}
