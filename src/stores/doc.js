import { writable, derived } from "svelte/store";
import { get, set } from "idb-keyval";

export const docStore = writable({});

export const chapterStore = writable({});

export const contents = derived(docStore, ($docStore, set) => {
  if ($docStore.resources) {
    const toc = $docStore.resources.find(
      item => item.rel.includes("contents") || item.rel.includes("ncx")
    );
    try {
      window
        .fetch(`/api/parse-toc?toc=${encodeURIComponent(toc.url)}`)
        .then(response => response.json())
        .then(tocData => set(tocData));
    } catch (err) {
      set({});
      console.error(err);
    }
  } else {
    set({});
  }
});
export const notes = derived(chapterStore, ($chapterStore, set) => {
  try {
    if ($chapterStore.url) {
      window
        .fetch(`/api/notes?path=${encodeURIComponent($chapterStore.url)}`)
        .then(response => response.json())
        .then(notesData => set(notesData));
    } else {
      set({});
    }
  } catch (err) {
    set({});
    console.error(err);
  }
});

export const navigation = derived(
  [docStore, chapterStore],
  ([$docStore, $chapterStore]) => {
    let previous;
    let next;
    let current;
    if ($docStore.readingOrder && $chapterStore.html) {
      previous = $docStore.readingOrder[$chapterStore.index - 1];
      next = $docStore.readingOrder[$chapterStore.index + 1];
      current = $docStore.readingOrder[$chapterStore.index];
    }
    return { previous, current, next };
  }
);

export const chapterTitle = derived(
  [chapterStore, contents],
  ([$chapterStore, $contents]) => {
    function findTitle(currentTitle, entry) {
      const path = new URL(entry.url, "http://example.com/").pathname;
      if ($chapterStore.url.includes(path)) {
        return entry.label;
      } else if (entry.children) {
        return entry.children.reduce(findTitle, currentTitle);
      } else {
        return currentTitle;
      }
    }
    if ($chapterStore && $contents && $contents.children) {
      return $contents.children.reduce(findTitle, "");
    } else {
      return "";
    }
  }
);

// Locations:
// This should be an array of `{id, location, annotations, top (window.scrollX + top), bottom (top + height)}`, sorted by order of appearance
// From this we can derive a chapter title (down to the sub chapter level and how many annotations each location has)
// And we can render an abstract minimap

function save(value) {
  return set(this.name, value).then(() => this.set(value));
}

export const fontSize = writable("regular");
fontSize.name = "fontSize";
fontSize.save = save;

export const theme = writable("old-style");
theme.name = "theme";
theme.save = save;

if (process.browser) {
  get(fontSize.name).then(value => {
    if (value) fontSize.set(value);
  });
  get(theme.name).then(value => {
    if (value) theme.set(value);
  });
}

export const configuringReader = writable(false);

export const currentLocation = writable({
  path: null,
  doc: null,
  location: null
});
