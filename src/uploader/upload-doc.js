import queue from "async-es/queue";
import { writable } from "svelte/store";
import { fetchWrap } from "../api/fetch-wrap.js";
import { stores } from "../stores";
const { subscribe, set, update } = writable([]);
const { jobs } = stores();

const importQueue = queue(upload);
importQueue.drain(() => {
  set([]);
});
importQueue.error((err, task) => {
  console.error(err);
  set([]);
});
async function upload(file) {
  const job = await uploadFile(file); // Replace with upload function and rename `book` to `job`
  if (job) {
    update(files => {
      const set = new Set(files);
      set.delete(file);
      return [...set];
    });
    jobs.update(entries => {
      const set = new Set(entries);
      set.add(job);
      return [...set];
    });
    return job;
  } else {
    throw new Error("No job created");
  }
}
function add(file) {
  update(files => {
    const set = new Set(files);
    set.add(file);
    return [...set];
  });
  importQueue.push(file, function(err) {
    if (err) console.log(err);
  });
}

export const uploadQueue = {
  subscribe,
  add
};

async function uploadFile(file) {
  const response = await window.fetch("/api/whoami", {
    credentials: "include"
  });
  const { user } = await response.json();
  const endpoint = `${user.profile.id}/file-upload-pub`;
  const data = new window.FormData();
  data.append("file", file);
  try {
    const response = await fetchWrap(endpoint, {
      credentials: "include",
      method: "POST",
      body: data,
      headers: new window.Headers({
        Authorization: `Bearer ${user.token}`
      })
    });
    return response.json();
  } catch (err) {
    console.error("upload error: ", err, err.status, err.response);
    err.httpMethod = "POST/Upload Media";
    throw err;
  }
}
