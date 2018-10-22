import { outputFile, outputJson } from "fs-extra";
import request from "request-promise";

import { Channel, IConfig } from "../types";

function writeConfigFiles(channel: Channel, data: IConfig) {
  let assets = data.assets.map((asset) => ({
    name: asset.name,
    url: asset.browser_download_url,
  }));

  if (assets) {
    assets.filter((asset) => asset.name.endsWith(".yml")).forEach(async (asset) => {
      const content = await request(asset.url);

      outputFile(`data/${channel}/${asset.name}`, content);
    });

    assets = assets.filter((asset) => !asset.name.endsWith(".yml") && !asset.name.endsWith(".json"));

    const config = {
      assets,
      body: data.body,
      name: data.name,
    };

    outputJson(`data/${channel}/release-config.json`, config);
  }
}

export async function getLatestReleaseConfig() {
  const url = "https://api.github.com/repos/automattic/wp-desktop/releases/latest";

  try {
    const resp: string = await request(url, {
      headers: {
        "User-Agent": "A8C",
      },
    });
    const data: IConfig = JSON.parse(resp);

    writeConfigFiles(Channel.Stable, data);
  } catch (err) {
    console.log(err);
  }
}

export async function getLatestPreReleaseConfig() {
  // TODO: add check to skip prereleases if there is a newer stable release
  const url = "https://api.github.com/repos/automattic/wp-desktop/releases";

  try {
    const resp: string = await request(url, {
      headers: {
        "User-Agent": "A8C",
      },
    });
    const releases: IConfig[] = JSON.parse(resp);

    const data = releases.find((d) => d.prerelease);
    if (!data) { return; }

    writeConfigFiles(Channel.Beta, data);
  } catch (err) {
    console.log(err);
  }
}
