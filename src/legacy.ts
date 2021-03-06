import { Router } from "express";
import { getAssetUrl, getAssetUrlByPlatform, getConfig, hasNewerVersion } from "./helper/release";

import { Channel, Platform } from "./types";

const router = Router();

router.get("/desktop/:platform(osx|linux|windows)", (req, res) => {
  const channel = req.query.channel;
  // TODO: add checks
  // TODO: add statistics call
  if (hasNewerVersion(channel, req.params.platform, req.query.compare)) {
    const config = getConfig(req.params.platform);
    const url = getAssetUrl(channel, config.path);

    if (config) {
      return res.json({
        name: `WordPress.com v${config.version}`,
        notes: "Keeping current with what's new with WordPress.com!",
        time: config.releaseDate,
        url,
        version: config.version,
      });
    }
  }

  res.status(204);
});

export default router;
