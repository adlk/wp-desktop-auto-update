import * as bodyParser from "body-parser";
import express, { Router } from "express";
import { readFileSync } from "fs";
import logger from "morgan";

import { getLatestPreReleaseConfig, getLatestReleaseConfig } from "./helper/github";
import legacyRoutes from "./legacy";

import { getAssetUrl, getConfig } from "./helper/release";
import { Channel, IConfig, Platform } from "./types";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = Router();

    // TODO: add routes to get latest mac, windows and linux  releases

    // Endpoint for Windows, macOS and Linux update
    router.get(/latest.*.yml$/, (req, res) => {
      const channel = Channel.Stable;
      // TODO: add statistics call

      let platform: Platform = Platform.Windows;
      if (req.url.match(/^\/latest-mac.yml+(\?noCache=(.*))?/)) {
        platform = Platform.OSX;
      } else if (req.url.match(/^\/latest-linux.yml+(\?noCache=(.*))?/)) {
        platform = Platform.Linux;
      }

      try {
        const data = getConfig(channel, platform);

        res.setHeader("Content-type", "text/yaml");
        res.end(data);
      } catch (err) {
        res.end("Nope");
      }
    });

    // Endpoint to redirect download request to Github hosted binary
    router.get("/:file.:type(exe|zip|dmg|deb|tar.gz|blockmap)", (req, res) => {
      const channel = Channel.Stable;

      const filename = `${req.params.file}.${req.params.type}`;

      // TODO: add statistics call

      const url = getAssetUrl(channel, filename);

      if (url) {
        console.log("Redirecting to", url);
        res.redirect(url);
      } else {
        res.end("Nope");
      }
    });

    // Webhook for Github "release" event
    router.get("/import-release", async (req, res) => {
      const release = await getLatestReleaseConfig();
      const prerelease = await getLatestPreReleaseConfig();

      res.end("A8C for the win!");
    });

    this.express.use("/", router);
    this.express.use("/", legacyRoutes);
  }

}

export default new App().express;
