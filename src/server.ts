import * as bodyParser from "body-parser";
import express, { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import logger from "morgan";
import request from "request-promise";

import { getLatestReleaseConfig } from "./helper/github";
import { IAsset, IConfig } from "./types";

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

    // TODO: add routes for to get latest mac, windows and linux  releases

    // Endpoint for Windows, macOS and Linux update
    router.get(/latest.*.yml$/, (req, res) => {
      // TODO: add statistics call

      let platform = "";
      if (req.url.match(/^\/latest-mac.yml+(\?noCache=(.*))?/)) {
        platform = "mac";
      } else if (req.url.match(/^\/latest-linux.yml+(\?noCache=(.*))?/)) {
        platform = "linux";
      }

      try {
        const data = readFileSync(`data/latest${platform ? `-${platform}` : ""}.yml`);

        res.setHeader("Content-type", "text/yaml");
        res.end(data);
      } catch (err) {
        res.end("Nope");
      }
    });

    // Endpoint to redirect download request to Github hosted binary
    router.get("/:file.:type(exe|zip|dmg|deb|tar.gz|blockmap)", (req, res) => {
      const filename = `${req.params.file}.${req.params.type}`;
      const config: IConfig = JSON.parse(readFileSync("data/release-config.json", "utf8"));

      // TODO: add statistics call

      const asset = config.assets.find((a) => a.name === filename);

      if (asset && asset.url) {
        console.log("Redirecting to", asset.url);
        res.redirect(asset.url);
      } else {
        res.end("Nope");
      }
    });

    // Webhook for Github "release" event
    router.get("/import-release", async (req, res) => {
      const config = await getLatestReleaseConfig();

      res.json(config);
    });

    this.express.use("/", router);
  }

}

export default new App().express;
