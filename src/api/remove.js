import { fetchWrap, get } from "./fetch-wrap.js";
import { getToken } from "./get-cookie.js";

export async function removeMany(payloads) {
  const results = payloads.map(payload => remove(payload));
  return Promise.all(results);
}

export async function remove(payload) {
  const response = await window.fetch("/api/whoami", {
    credentials: "include"
  });
  const { profile } = await response.json();
  try {
    const csrfToken = getToken();
    const response = await fetchWrap("/api/create", {
      method: "POST",
      body: JSON.stringify({
        "@context": [
          "https://www.w3.org/ns/activitystreams",
          { reader: "https://rebus.foundation/ns/reader" }
        ],
        type: "Delete",
        object: payload
      }),
      headers: new window.Headers({
        "content-type": "application/json",
        "csrf-token": csrfToken
      })
    });
    const url = new URL(response.headers.get("location"), profile.outbox);
    const reader = await get(
      `/api/get?path=${encodeURIComponent(url.pathname)}`
    );
    return reader;
  } catch (err) {
    err.httpMethod = "POST/Create Profile";
    console.log("fetch error:", err);
    throw err;
  }
}
