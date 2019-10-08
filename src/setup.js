import express from "express";
import sirv from "sirv";
import compression from "compression";
import csurf from "csurf";
import { setup as authSetup } from "./auth.js";
import dotenv from "dotenv";
import session from "express-session";
import levelStore from "level-session-store";

const { NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
if (dev) {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}
let defaultSession;
if (dev) {
  const LevelStore = levelStore(session);
  defaultSession = session({
    store: new LevelStore(),
    secret: process.env.COOKIE_KEY,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: !dev,
      name: "__session"
    }
  });
}

export function setup(sapper, options = {}) {
  const { session = defaultSession, firebase } = options;
  const app = express();

  app.enable("strict routing");
  app.disable("x-powered-by");
  app.set("trust proxy", true);

  app.use(express.urlencoded({ extended: true }));
  app.use(
    express.json({
      type: [
        "application/json",
        "application/activity+json",
        "application/ld+json"
      ],
      limit: "100mb"
    })
  );

  app.use(session);
  if (firebase) {
    app.use((req, res, next) => {
      req.firebase = firebase;
      next();
    });
  }
  authSetup(app);
  if (dev) {
    app.use(
      compression({ threshold: 0 }),
      sirv("dev-static", { dev }),
      sirv("static", { dev })
    );
  }
  app.use(
    "/",
    (req, res, next) => {
      if (req.path === "/callback") {
        return next();
      } else {
        return csurf()(req, res, next);
      }
    },
    (req, res, next) => {
      res.cookie("XSRF-TOKEN", req.csrfToken());
      next();
    },
    sapper.middleware({
      session: (req, res) => {
        return { user: req.user };
      }
    })
  );
  return app;
}
