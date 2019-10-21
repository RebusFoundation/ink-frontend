import { storiesOf } from "@storybook/svelte";
// import { action } from "@storybook/addon-actions";

import Modal from "./Modal.svelte";
import LibraryItem from "./LibraryItem.svelte";
import LibraryList from "./LibraryList.svelte";
import NotesList from "./NotesList.svelte";
import Upload from "./Upload.svelte";
import UploadQueue from "./UploadQueue.svelte";
import Book from "./Book.svelte";
import Highlight from "./Highlight.svelte";
import chapter from "./preview-data/epub.html.json";

const list = [
  {
    name: "Book Title 1",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 2",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 3",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 4",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 5",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 6",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 7",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 8",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 9",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  },
  {
    name: "Book Title 10",
    id: "https://example.com/id",
    author: [{ name: "Fancy Author" }]
  }
];

const notes = [
  {
    content: `<blockquote>
    <p>
      <span epub:type="bridgehead">The child's natural literature.</span>
      The world has lost certain secrets as the price of an advancing
      civilization. It is a commonplace of observation that no one can duplicate
      the
      <a href="/test" class="Highlight">
        success of Mother Goose, whether she be thought of as the maker of jingles
        or the teller of tales. The conditions of modern life preclude the
        generally naïve attitude <mark data-href="/" class="Highlight" data-highlight-level="1">
          that produced the folk rhymes, ballads, tales,
          proverbs, fables, and myths. The folk saw things simply and directly. The
          complex, analytic, questioning mind is not yet, either in or out of
          stories. <mark data-href="/" class="Highlight" data-highlight-level="2">
            The motives from which people act are to them plain and not
            mixed.
          </mark> Characters are good or bad. They feel no need of elaborately
          explaining their joys and sorrows.
        </mark> Such experiences come with the day's
        work. "To-morrow to fresh woods, and pastures new." The zest of life with
        them is emphatic.
      </a>
      Their humor is fresh, unbounded, sincere; there is no trace of cynicism. In
      folk literature we do not feel the presence of a "writer" who is mightily
      concerned about maintaining his reputation for wisdom, originality, or
      style. Hence the freedom from any note of straining after effect, of
      artificiality. In the midst of a life limited to fundamental needs, their
      literature deals with fundamentals. On the whole, it was a literature for
      entertainment. A more learned upper class may have concerned itself then
      about "problems" and "purposes," as the whole world does now, but the
      literature of the folk had no such interests.
    </p></blockquote><p>Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb.</p>`,
    id: "https://example.com/test-id-for-note1",
    "oa:hasSelector": {
      exact:
        "Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb."
    },
    publication: list[0],
    json: {}
  },
  {
    content: `<blockquote>
    <p>
      The difficulties of classification are very apparent here, and once more it
      must be noted that illustrative and practical purposes rather than logical
      ones are served by the arrangement adopted. The modern fanciful story is
      here placed next to the
      <a href="/test" class="Highlight Commented">real folk story</a>
      instead of after all the groups of folk products. The Hebrew stories at the
      beginning belong quite as well, perhaps even better, in Section V, while the
      stories at the end of Section VI shade off into the more modern types of
      short tales. Then the fact that other groups of modern stories are to follow
      later, illustrating more realistic studies of life and the very recent and
      remarkably numerous writings centering around animal life, limits the list
      here. Many of the animal stories might, with equal propriety, be placed
      under the head of the fantastic.
    </p></blockquote><p>test 2</p>`,
    id: "https://example.com/test-id-for-note",
    "oa:hasSelector": {
      exact:
        "This is a very long but exact quote that we need to do something with."
    },
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 3</p>",
    id: "https://example.com/test-id-for-note3",
    "oa:hasSelector": {
      exact:
        "This is a very long but exact quote that we need to do something with."
    },
    publication: list[0],
    json: {
      archived: true
    }
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 4</p>",
    id: "https://example.com/test-id-for-note4",
    "oa:hasSelector": {
      exact:
        "This is a very long but exact quote that we need to do something with."
    },
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote><p>test 5</p>",
    id: "https://example.com/test-id-for-note5",
    "oa:hasSelector": {
      exact:
        "This is a very long but exact quote that we need to do something with."
    },
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote>",
    id: "https://example.com/test-id-for-note6",
    "oa:hasSelector": {
      exact:
        "This is a very long but exact quote that we need to do something with."
    },
    publication: list[0],
    json: {}
  },
  {
    content: "<blockquote>Test Quote</blockquote>",
    id: "https://example.com/test-id-for-note7",
    "oa:hasSelector": {
      exact:
        "This is a very long but exact quote that we need to do something with."
    },
    publication: list[0],
    json: {}
  }
];
storiesOf("Modal", module).add("with text", () => ({
  Component: Modal,
  props: { text: "Book First pass" }
}));
storiesOf("LibraryItem", module)
  .add("default cover", () => ({
    Component: LibraryItem,
    props: {
      book: {
        name: "Book Name",
        id: "https://localhost:4030/test-id/",
        author: [{ name: "Test Author" }]
      },
      layout: "covers"
    }
  }))
  .add("set cover", () => ({
    Component: LibraryItem,
    props: {
      book: {
        name: "Book Name",
        id: "https://localhost:4030/test-id/",
        author: [{ name: "Test Author" }],
        resources: [
          { rel: "cover", url: "https://localhost:3000/placeholder-cover.png" }
        ]
      },
      layout: "covers"
    }
  }));
storiesOf("LibraryList", module)
  .add("covers", () => ({
    Component: LibraryList,
    props: {
      list,
      layout: "covers"
    }
  }))
  .add("square", () => ({
    Component: LibraryList,
    props: {
      list,
      layout: "square"
    }
  }))
  .add("list", () => ({
    Component: LibraryList,
    props: {
      list,
      layout: "list"
    }
  }));

storiesOf("NotesList", module)
  .add("collection", () => ({
    Component: NotesList,
    props: {
      notes,
      current: "https://example.com/test-id-for-note",
      layout: "covers",
      collection: "all"
    }
  }))
  .add("no collection", () => ({
    Component: NotesList,
    props: {
      notes,
      current: "https://example.com/test-id-for-note",
      layout: "covers"
    }
  }));
storiesOf("Book", module).add("basic", () => ({
  Component: Book,
  props: {
    chapter
  }
}));
storiesOf("Highlight", module).add("basic", () => ({
  Component: Highlight,
  props: {
    chapter
  }
}));
storiesOf("Upload", module).add("main", () => ({
  Component: Upload,
  props: {}
}));
storiesOf("UploadQueue", module).add("basic timed queue display", () => ({
  Component: UploadQueue,
  props: {}
}));
