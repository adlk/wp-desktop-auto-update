export interface IConfig {
  name: string;
  body: string;
  assets: IAsset[];
  prerelease: boolean;
}

export interface IAsset {
  url: string;
  id: number;
  name: string;
  content_type: string;
  browser_download_url: string;
}

export interface IReleaseFiles {
  url: string;
  sha512: string;
  size?: number;
}

export interface IReleaseConfig {
  version: string;
  files: IReleaseFiles[];
  path: string;
  releaseDate: string;
}

export enum Platform {
  Windows = "windows",
  OSX = "osx",
  Linux = "linux",
}

export enum Channel {
  Stable = "stable",
  Beta = "beta",
}
