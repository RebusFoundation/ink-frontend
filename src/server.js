import * as sapper from "@sapper/server";
import { setup as serverSetup } from "./setup.js";
import * as path from "path";
import admin from "firebase-admin";
// import debugSetup from 'debug'
// const debug = debugSetup('vonnegut:server')

const { NODE_ENV, PORT } = process.env;
const dev = NODE_ENV === "development";

if (dev) {
  const serviceAccount = require(path.resolve(
    __dirname,
    `../../../${process.env.KEYFILE}`
  ));
  const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
  const app = serverSetup(sapper, { firebase });
  app.listen(PORT);
}

function setup(options) {
  return serverSetup(sapper, options);
}

export { sapper, setup };

// Need to set this up to actually use https.
