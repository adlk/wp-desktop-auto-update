# WordPress Desktop Updater – Demo API

Demo API for `electron-updater`'s generic provider configuration.

This is by far not complete and was only minimally tested.

## Endpoints

### Check for updates

- `/latest.yml`
- `/latest-mac.yml`
- `/latest-linux.yml`

### Retrieve binary from github

- `/:file.:type(exe|zip|dmg|deb|tar.gz|blockmap)` - redirects to binary on github

### Webhook (new release created)

- `/import-release` – caches necessary release files and config

## Cache

Once the release webhook was triggered. Cache files are created in `./data` for the latest release.

- `latest.yml` electron-builder release config for Windows
- `latest-mac.yml` electron-builder release config for Mac
- `latest-linux.yml` electron-builder release config for Linux (not yet used in wp-desktop)
- `release-config.json` Contains release data like _name_ (`name`), _release notes_ (`body`) and URLs (`assets`) to all binaries.

## Test/Dev

Run `npm start` to launch server or `npm run dev` to start server in dev mode

### Test URLs (VS Code - REST Client)

```
@HOST = http://localhost:4567

# Updater
{{HOST}}/latest.yml
{{HOST}}/latest-linux.yml
{{HOST}}/latest-mac.yml

# Binaries
{{HOST}}/WordPressDesktop-Setup-3.5.0.exe
{{HOST}}/WordPress.com-3.5.0-mac.zip
{{HOST}}/WordPress.com-3.5.0.dmg
{{HOST}}/WordPress.com-3.5.0.tar.gz
{{HOST}}/WordPress.com-3.5.0.deb

# Webhook
{{HOST}}/import-release
```