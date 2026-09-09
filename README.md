# Arun K Sivanandan - Personal Website

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

The Writing section is refreshed by GitHub Actions every day at 6:17 PM Malaysia time. The sync tries the Substack feed directly, uses an RSS proxy if GitHub's runner is blocked, and retains the archive API as a final fallback. The latest five articles are cached in `src/data/substack-posts.json`.

To refresh the cache manually on your computer, run:

```sh
npm run sync:writing
```

From Cygwin, the following command performs the complete update: it pulls `main`, refreshes the cache, runs the tests, and commits and pushes the cache only when it changed.

```sh
./scripts/sync-substack-and-push.sh
```

The updater refuses to run outside `main` or when the cache already contains uncommitted changes.

Review `src/data/substack-posts.json`, then build and test the refreshed site:

```sh
npm test
```

To rebuild and deploy the cache currently committed to GitHub:

1. Open the repository's **Actions** tab.
2. Select **Deploy website to GitHub Pages**.
3. Choose **Run workflow**.
4. Select the `main` branch and confirm **Run workflow**.
5. Wait for both the build and deploy jobs to complete.

Scheduled and manually triggered GitHub workflows refresh the RSS cache, commit it when changed, then build and deploy the website. The local shell script remains available as a manual backup.

## Anonymous visitor analytics

The site supports privacy-first analytics through Umami. Tracking is disabled unless a website ID is provided, so local development does not send analytics data by default.

To enable analytics on GitHub Pages:

1. Create a website in Umami for `arun-ks.github.io` and copy its website ID.
2. In this GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
3. Add `PUBLIC_UMAMI_WEBSITE_ID` with the website ID supplied by Umami.
4. If using a self-hosted Umami instance, also add `PUBLIC_UMAMI_SCRIPT_URL` with its tracker-script URL. Umami Cloud uses `https://cloud.umami.is/script.js` automatically, so this second variable can be omitted.
5. Run **Deploy website to GitHub Pages** from the Actions tab, or push a new commit.

The integration collects anonymous page views and device-level aggregate metrics provided by Umami. It also records résumé downloads, contact-email clicks, certificate catalogue visits, Substack article opens, GitHub profile visits, and portfolio live/repository opens. It respects the browser's Do Not Track setting and excludes URL query parameters.
