import { writeFileSync } from "fs";
import request from "request-promise";

import { IAsset } from "../types";

interface IReleaseResponse {
  name: string;
  body: string;
  assets: IAsset[];
}

export async function getLatestReleaseConfig() {
  const url = "https://api.github.com/repos/automattic/wp-desktop/releases/latest";

  try {
    const resp: string = await request(url, {
      headers: {
        "User-Agent": "A8C",
      },
    });
    const data: IReleaseResponse = JSON.parse(resp);

    let assets = data.assets.map((asset) => ({
      name: asset.name,
      url: asset.browser_download_url,
    }));

    if (assets) {
      assets.filter((asset) => asset.name.endsWith(".yml")).forEach(async (asset) => {
        const content = await request(asset.url);

        writeFileSync(`data/${asset.name}`, content);
      });

      assets = assets.filter((asset) => !asset.name.endsWith(".yml") && !asset.name.endsWith(".json"));

      const config = {
        assets,
        body: data.body,
        name: data.name,
      };

      writeFileSync("data/release-config.json", JSON.stringify(config));
    }
  } catch (err) {
    console.log(err);
  }
}
