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
