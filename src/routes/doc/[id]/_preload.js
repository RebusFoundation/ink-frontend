export async function preload({ params, query }) {
  try {
    const { id, path } = params;
    const response = await this.fetch(
      `/api/id-to-opf?id=%2F${encodeURIComponent(id)}`,
      {
        credentials: "include"
      }
    );
    const book = await response.json();
    const chapterResource = book.resources.find(item =>
      item.url.endsWith(path.join("/"))
    );
    chapterResource.index = book.readingOrder
      .map(item => item.url)
      .indexOf(chapterResource.url);
    const chapterResponse = await this.fetch(
      `/api/parse-chapter?chapter=${encodeURIComponent(
        chapterResource.url
      )}&index=${chapterResource.index}`,
      { credentials: "include" }
    );
    let chapter = await chapterResponse.json();
    chapter = { ...chapter, ...chapterResource };
    book.url = book.id;
    book.id = id;
    return { book, chapter };
  } catch (err) {
    return this.error(err);
  }
}
