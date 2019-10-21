<script>
  // your script goes here
  import Book from "../src/doc/Book.svelte";
  const bookPath = "demo.xhtml";
  const book = {
    id: "/stories/preview-data/bookdemo/index.json",
    name: "Le Miserable",
    readingOrder: [
      {
        url: "fakechapter1.xhtml",
        rel: [],
        encodingFormat: "application/xhtml+xml"
      }
    ],
    resources: [
      {
        url: "placeholder-cover.png",
        rel: ["cover"],
        encodingFormat: "image/jpeg"
      },
      {
        url: "stylesheet.css",
        rel: [],
        encodingFormat: "text/css"
      },
      {
        url: "titlepage.xhtml",
        rel: [],
        encodingFormat: "application/xhtml+xml"
      },
      {
        url: "toc.ncx",
        rel: ["ncx"],
        encodingFormat: "application/x-dtbncx+xml"
      },
      {
        type: "LinkedResource",
        rel: ["alternate"],
        url: "original.epub",
        encodingFormat: "application/epub+zip"
      },
      {
        type: "LinkedResource",
        rel: ["alternate"],
        url: "original.opf",
        encodingFormat: "application/oebps-package+xml"
      }
    ],
    links: [],
    json: {
      epubVersion: "2.0"
    },
    readerId: "https://localhost:4430/reader-3fb0508769095f0411868b1a2333650a",
    published: "2019-07-04T20:09:16.791Z",
    updated: "2019-07-04T20:09:16.799Z",
    replies: [
      "https://localhost:4430/note-7ed82b3eee8da3bb47709d66764778a8",
      "https://localhost:4430/note-125f10883030cadde64e7f1e9a13981a"
    ],
    tags: [],
    position: {
      type: "reader:Location",
      location:
        "/publication-867b91fbaf35c245d2e7332e29ab3013/Kazuo Ishiguro - Never Let Me Go_split_001.htm:0",
      path:
        "/publication-867b91fbaf35c245d2e7332e29ab3013/Kazuo Ishiguro - Never Let Me Go_split_001.htm"
    },
    type: "Publication",
    author: [
      {
        id: "f555b43bb7298d2efb3f0b9886ccc4a9",
        role: "author",
        isContributor: 0,
        name: "Kazuo Ishiguro",
        normalizedName: "kazuoishiguro",
        type: "Person",
        readerId:
          "https://localhost:4430/reader-3fb0508769095f0411868b1a2333650a",
        publicationId:
          "https://localhost:4430/publication-867b91fbaf35c245d2e7332e29ab3013",
        published: "2019-07-04T20:09:16.827Z"
      }
    ],
    editor: []
  };
  export let chapter;
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<Book {book} {bookPath} {chapter} />
