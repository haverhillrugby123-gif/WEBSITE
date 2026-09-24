# UK Online Tuition website

This repository contains the finished review build of the UK Online Tuition website.

## Local checks

```sh
npm ci
npm run check
npm run build
```

GitHub Actions validates the static site and is configured to publish the built `dist` folder with GitHub Pages.

The enquiry form is currently a safe preview: it validates locally but does not transmit or store visitor data.
