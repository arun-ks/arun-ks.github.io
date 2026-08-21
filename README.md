# Arun K Sivanandan — Personal Website

A fast, accessible personal website built with Astro and deployed through GitHub Pages.

## Update content

The editable career, project, portfolio and writing content lives in `src/data/site.ts`. Replace the PDF in `public/Arun-K-Sivanandan-CV.pdf` whenever the résumé changes, then update the structured content and review the generated site before publishing.

## Local development

```sh
npm install
npm run dev
```

Run `npm test` for a production build and structural checks.

## Refresh Substack articles

The Writing section is refreshed automatically from `https://arunk5.substack.com/feed` every day at 6:00 PM Malaysia time. The latest five articles are cached in `src/data/substack-posts.json`; if Substack is temporarily unavailable, the website continues to build using the last successful cache.

To refresh the cache manually on your computer, run:

```sh
npm run sync:writing
```

Review `src/data/substack-posts.json`, then build and test the refreshed site:

```sh
npm test
```

To refresh and deploy directly from GitHub:

1. Open the repository's **Actions** tab.
2. Select **Deploy website to GitHub Pages**.
3. Choose **Run workflow**.
4. Select the `main` branch and confirm **Run workflow**.
5. Wait for both the build and deploy jobs to complete.

The manually triggered workflow retrieves the current RSS feed before building and deploying the website. It does not commit the refreshed JSON cache back to the repository; the cache in the deployment artifact is updated for the published site.

## Anonymous visitor analytics

The site supports privacy-first analytics through Umami. Tracking is disabled unless a website ID is provided, so local development does not send analytics data by default.

To enable analytics on GitHub Pages:

1. Create a website in Umami for `arun-ks.github.io` and copy its website ID.
2. In this GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
3. Add `PUBLIC_UMAMI_WEBSITE_ID` with the website ID supplied by Umami.
4. If using a self-hosted Umami instance, also add `PUBLIC_UMAMI_SCRIPT_URL` with its tracker-script URL. Umami Cloud uses `https://cloud.umami.is/script.js` automatically, so this second variable can be omitted.
5. Run **Deploy website to GitHub Pages** from the Actions tab, or push a new commit.

The integration collects anonymous page views and device-level aggregate metrics provided by Umami. It also records résumé downloads, contact-email clicks, certificate catalogue visits, Substack article opens, GitHub profile visits, and portfolio live/repository opens. It respects the browser's Do Not Track setting and excludes URL query parameters.
