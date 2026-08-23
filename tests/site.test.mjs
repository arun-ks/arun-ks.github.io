import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

test("renders core personal site sections", () => {
  for (const id of ["about", "journey", "projects", "portfolio", "writing", "credentials", "contact"]) {
    assert.match(html, new RegExp(`id=[\"']${id}[\"']`));
  }
});

test("includes accessible theme control and social metadata", () => {
  assert.match(html, /class="theme-toggle"/);
  assert.match(html, /aria-label="Switch to light mode"/);
  assert.match(html, /property="og:image"/);
});

test("includes canonical crawl and personal identity metadata", () => {
  assert.match(html, /<title>Arun K Sivanandan \| CTO & Technology Leader \| AI, Cloud & Telecom<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/arun-ks\.github\.io\/"/);
  assert.match(html, /name="keywords"/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /"@type":"ProfilePage"/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /linkedin\.com\/in\/arunksivanandan/);
});

test("publishes crawler discovery and Search Console verification files", async () => {
  const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  const verification = await readFile(new URL("../dist/google8bc686f77b1053cf.html", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/arun-ks\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/arun-ks\.github\.io\/<\/loc>/);
  assert.match(verification, /google-site-verification: google8bc686f77b1053cf\.html/);
});

test("uses root-relative resume and asset links", () => {
  assert.match(html, /\/Arun-K-Sivanandan-CV\.pdf/);
  assert.match(html, /\/og\.png/);
});

test("selected impact is navigable and progressively discloses full project stories", () => {
  assert.match(html, /href="#projects">Projects/);
  assert.equal((html.match(/class="project-toggle"/g) || []).length, 4);
  assert.equal((html.match(/class="project-details"/g) || []).length, 4);
  assert.match(html, /astro-logo\.[^"]+\.webp/);
  assert.match(html, /globe-telecom-logo\.[^"]+\.webp/);
  assert.match(html, /amdocs-optima\.[^"]+\.webp/);
});

test("renders twelve compact portfolio cards with local representative visuals", () => {
  assert.equal((html.match(/class="portfolio-card reveal"/g) || []).length, 12);
  assert.equal((html.match(/class="portfolio-visual portfolio-primary-link"[^>]*><img/g) || []).length, 12);
  assert.equal((html.match(/class="portfolio-visual portfolio-primary-link"[^>]*><img[^>]+loading="lazy"/g) || []).length, 12);
  assert.match(html, /github\.com\/arun-ks\/AutoJoinTeamsZoom/);
  assert.equal((html.match(/class="portfolio-live"/g) || []).length, 8);
  assert.match(html, /arun-ks\.github\.io\/CorporateBingo\//);
  assert.equal((html.match(/portfolio-primary-link/g) || []).length, 12);
  assert.equal((html.match(/class="portfolio-title-link"/g) || []).length, 12);
  assert.match(html, /class="portfolio-title-link" href="https:\/\/arun-ks\.github\.io\/multiple-news-live\//);
  assert.match(html, /class="portfolio-title-link" href="https:\/\/github\.com\/arun-ks\/ScreenSaverSaver"/);
});

test("renders cached Substack articles with images and no publication dates", () => {
  assert.equal((html.match(/class="featured-post reveal"/g) || []).length, 1);
  assert.equal((html.match(/class="secondary-post reveal"/g) || []).length, 4);
  assert.doesNotMatch(html, /<time|pubDate|post\.date/);
  assert.match(html, /Latest article/);
});

test("includes anonymous analytics event hooks", () => {
  for (const event of [
    "resume_download",
    "contact_email_click",
    "certificate_catalogue_open",
    "substack_article_open",
    "github_profile_open",
    "portfolio_live_open",
    "portfolio_repository_open",
  ]) {
    assert.match(html, new RegExp(event));
  }
});
