export async function getBook({ params, query }) {
  const { id, path } = params;
  if (!id || !path) return
  const response = await window.fetch(
    `/api/id-to-opf?id=%2F${encodeURIComponent(id)}`,
    {
      credentials: "include"
    }
  );
  const book = await response.json();
  const chapter = book.resources.find(item =>
    item.url.endsWith(path.join("/"))
  );
  chapter.index = book.readingOrder
    .map(item => item.url)
    .indexOf(chapter.url);

  book.url = book.id;
  book.id = id;
  return { book, chapter };
}

export async function getChapterFromPath (book, path) {
  const chapter = book.resources.find(item =>
    item.url.endsWith(path.join("/"))
  );
  chapter.index = book.readingOrder
    .map(item => item.url)
    .indexOf(chapter.url);
  return getChapter(chapter, chapter.index);
}

export async function getChapter (chapter, index) {
  const chapterResponse = await window.fetch(
    `/api/parse-chapter?chapter=${encodeURIComponent(
      chapter.url
    )}&index=${chapter.index}`,
    { credentials: "include" }
  );
  const chapterBody = await chapterResponse.json();
  return {...chapter, ...chapterBody}
}