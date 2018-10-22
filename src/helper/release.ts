import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";
import { lt as isOlderThan, valid } from "semver";

import { Channel, IConfig, IReleaseConfig, Platform } from "../types";

export function getConfig(channel: Channel, platform?: Platform): IReleaseConfig {
  let os = platform as string;
  if (platform === Platform.OSX) {
    os = "mac";
  }

  // TODO: check if file exists
  const file = `data/${channel}/latest${!platform || platform !== Platform.Windows ? `-${os}` : ""}.yml`;
  const config: IReleaseConfig = safeLoad(readFileSync(file, "utf-8"));

  return config;
}

export function getReleaseAssets(channel: Channel) {
  // TODO: check if file exists
  const config: IConfig = JSON.parse(readFileSync(`data/${channel}/release-config.json`, "utf8"));

  return config.assets;
}

export function getLatestVersion(channel: Channel, platform?: Platform): string {
  const config = getConfig(channel, platform);

  return config.version;
}

export function hasNewerVersion(channel: Channel, platform: Platform, version: string): boolean {
  const latestVersion = getLatestVersion(channel, platform);
  return (!!valid(version) && !!valid(latestVersion) && isOlderThan(version, latestVersion));
}

export function getAssetUrl(channel: Channel, filename: string): null | string {
  const assets = getReleaseAssets(channel);

  const asset = assets.find((a) => a.name === filename);

  if (asset) {
    return asset.url;
  }

  return null;
}

export function getAssetUrlByPlatform(channel: Channel, platform: Platform): null | string {
  const config = getConfig(channel, platform);

  return getAssetUrl(channel, config.path);
}
