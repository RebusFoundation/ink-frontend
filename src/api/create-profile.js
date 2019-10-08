import { fetchWrap } from "./fetch-wrap.js";
import { getToken } from "./get-cookie.js";

export async function create(session) {
  const newReader = {
    type: "Person",
    summary: `Reader profile`
  };
  try {
    const csrfToken = getToken();
    await fetchWrap("/api/create-profile", {
      method: "POST",
      body: JSON.stringify(newReader),
      headers: new window.Headers({
        "content-type": "application/json",
        "csrf-token": csrfToken
      })
    });
    const reader = await window.fetch("/api/whoami", {
      credentials: "include"
    });
    return reader.json();
  } catch (err) {
    err.httpMethod = "POST/Create Profile";
    throw err;
  }
}
