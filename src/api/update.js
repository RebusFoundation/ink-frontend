import { fetchWrap } from "./fetch-wrap.js";
import { getToken } from "./get-cookie.js";

export async function update(payload) {
  const response = await window.fetch("/api/whoami", {
    credentials: "include"
  });
  const { profile } = await response.json();
  try {
    payload.json = payload.json || {};
    const csrfToken = getToken();
    const response = await fetchWrap("/api/create", {
      method: "POST",
      body: JSON.stringify({
        "@context": [
          "https://www.w3.org/ns/activitystreams",
          { reader: "https://rebus.foundation/ns/reader" }
        ],
        type: "Update",
        object: payload
      }),
      headers: new window.Headers({
        "content-type": "application/json",
        "csrf-token": csrfToken
      })
    });
    const url = new URL(response.headers.get("location"), profile.outbox);
    return url;
  } catch (err) {
    err.httpMethod = "POST/Update";
    console.log("fetch error:", err);
    throw err;
  }
}
