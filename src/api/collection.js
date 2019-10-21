import { fetchWrap } from "./fetch-wrap.js";
import { getToken } from "./get-cookie.js";

export async function collection(tag, book, checked) {
  let payload;
  if (checked) {
    payload = {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        { reader: "https://rebus.foundation/ns/reader" }
      ],
      type: "Add",
      object: {
        type: "reader:Tag",
        id: tag.id,
        name: tag.name
      },
      target: {
        type: "Publication",
        id: book.id
      }
    };
  } else {
    payload = {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        { reader: "https://rebus.foundation/ns/reader" }
      ],
      type: "Remove",
      object: {
        type: "reader:Tag",
        id: tag.id,
        name: tag.name
      },
      target: {
        type: "Publication",
        id: book.id
      }
    };
  }
  try {
    const csrfToken = getToken();
    const response = await fetchWrap("/api/add", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: new window.Headers({
        "content-type": "application/ld+json",
        "csrf-token": csrfToken
      })
    });
    return response.headers.get("location");
  } catch (err) {
    err.httpMethod = "POST/Read";
    console.log("fetch error:", err);
    throw err;
  }
}
