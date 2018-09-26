export interface IConfig {
  name: string;
  body: string;
  assets: IAsset[];
}

export interface IAsset {
  url: string;
  id: number;
  name: string;
  content_type: string;
  browser_download_url: string;
}
