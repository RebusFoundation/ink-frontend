import { fetchWrap } from "./fetch-wrap.js";
import { getToken } from "./get-cookie.js";

export async function read(context, location, path) {
  try {
    const csrfToken = getToken();
    const response = await fetchWrap("/api/create", {
      method: "POST",
      body: JSON.stringify({
        "@context": [
          "https://www.w3.org/ns/activitystreams",
          { reader: "https://rebus.foundation/ns/reader" }
        ],
        type: "Read",
        context,
        "oa:hasSelector": {
          type: "reader:Location",
          location,
          path
        }
      }),
      headers: new window.Headers({
        "content-type": "application/json",
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
