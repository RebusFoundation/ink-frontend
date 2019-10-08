export function normalise(pub) {
  let resources = pub.resources || [];
  if (resources.data) {
    resources = resources.data;
  }
  let readingOrder = pub.readingOrder || [];
  if (readingOrder.data) {
    readingOrder = readingOrder.data;
  }
  function fixURLs(item) {
    item.url = new URL(item.url, pub.id).href;
    return item;
  }
  pub.readingOrder = readingOrder.map(fixURLs);
  pub.resources = resources.map(fixURLs);
  pub.navigation = addNav(pub);
  const coverResource = pub.resources.find(resource =>
    resource.rel.includes("cover")
  );
  if (coverResource) {
    pub.cover = `/assets${new URL(coverResource.url).pathname}?cover=true`;
  } else {
    pub.cover = "/placeholder-cover.jpg";
  }
  if (pub.id) {
    const pathname = new URL(pub.id).pathname;
    pub.url = `/info${pathname}`;
  }
  pub.translator = pub.translator || [];
  pub.editor = pub.editor || [];
  pub.illustrator = pub.illustrator || [];
  pub.contributor = pub.contributor || [];
  return pub;
}

function addNav(book) {
  const navigation = {};
  let index;
  if (book.position && book.position.path) {
    const pathURL = new URL(book.position.path, book.id);
    navigation.current = {
      path: `/doc${pathURL.pathname}#${book.position.location}`,
      location: book.position.location
    };
    const currentURL = pathURL.href;
    index = book.readingOrder.map(item => item.url).indexOf(currentURL);
  } else if (book.readingOrder.length !== 0) {
    index = 0;
    const pathURL = new URL(book.readingOrder[0].url, book.id);
    navigation.current = {
      path: `/doc${pathURL.pathname}`,
      location: ""
    };
  }

  if (book.readingOrder.length === 0) {
    return navigation;
  } else {
    const nextItem = book.readingOrder[index + 1];
    if (nextItem) {
      navigation.next = {
        path: nextItem.url
      };
    }
    const prevItem = book.readingOrder[index - 1];
    if (prevItem) {
      navigation.previous = {
        path: prevItem.url
      };
    }
  }
  return navigation;
}
