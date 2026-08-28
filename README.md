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

The Writing section is refreshed from `https://arunk5.substack.com/feed` by a local Windows scheduled task every day at 6:17 PM Malaysia time. The latest five articles are cached in `src/data/substack-posts.json`; GitHub Pages builds use the last cache committed to `main` and do not contact Substack.

To refresh the cache manually on your computer, run:

```sh
npm run sync:writing
```

From Cygwin, the following command performs the complete update: it pulls `main`, refreshes the cache, runs the tests, and commits and pushes the cache only when it changed.

```sh
./scripts/sync-substack-and-push.sh
```

The updater refuses to run outside `main` or when the cache already contains uncommitted changes.

### Register the daily Windows task

Open Windows PowerShell in the repository and run this once under the same Windows account used for Cygwin and GitHub:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\register-substack-task.ps1
```

This registers **Arun KS - Refresh Substack posts** for 6:17 PM daily using `C:\cygwin64\bin\bash.exe`. The task starts when possible after a missed start, but it runs only while the Windows account is logged on. Git authentication used by Cygwin must already work without an interactive password prompt.

To test it immediately:

```powershell
Start-ScheduledTask -TaskName "Arun KS - Refresh Substack posts"
Get-ScheduledTaskInfo -TaskName "Arun KS - Refresh Substack posts"
```

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

GitHub workflows build and deploy the cache already committed to `main`. The local scheduled task owns the RSS retrieval and pushes a cache commit when new articles are found; that push automatically triggers deployment.

## Anonymous visitor analytics

The site supports privacy-first analytics through Umami. Tracking is disabled unless a website ID is provided, so local development does not send analytics data by default.

To enable analytics on GitHub Pages:

1. Create a website in Umami for `arun-ks.github.io` and copy its website ID.
2. In this GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
3. Add `PUBLIC_UMAMI_WEBSITE_ID` with the website ID supplied by Umami.
4. If using a self-hosted Umami instance, also add `PUBLIC_UMAMI_SCRIPT_URL` with its tracker-script URL. Umami Cloud uses `https://cloud.umami.is/script.js` automatically, so this second variable can be omitted.
5. Run **Deploy website to GitHub Pages** from the Actions tab, or push a new commit.

The integration collects anonymous page views and device-level aggregate metrics provided by Umami. It also records résumé downloads, contact-email clicks, certificate catalogue visits, Substack article opens, GitHub profile visits, and portfolio live/repository opens. It respects the browser's Do Not Track setting and excludes URL query parameters.
