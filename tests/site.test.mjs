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

test("uses root-relative resume and asset links", () => {
  assert.match(html, /\/Arun-K-Sivanandan-CV\.pdf/);
  assert.match(html, /\/og\.png/);
});

test("selected impact is navigable and progressively discloses full project stories", () => {
  assert.match(html, /href="#projects">Projects/);
  assert.equal((html.match(/class="project-toggle"/g) || []).length, 4);
  assert.equal((html.match(/class="project-details"/g) || []).length, 4);
  assert.match(html, /astro-logo\.png/);
  assert.match(html, /globe-telecom-logo\.png/);
  assert.match(html, /amdocs-optima\.jpg/);
});

test("renders twelve compact portfolio cards with local representative visuals", () => {
  assert.equal((html.match(/class="portfolio-card reveal"/g) || []).length, 12);
  assert.equal((html.match(/\/portfolio\/[^"]+\.png/g) || []).length, 12);
  assert.match(html, /github\.com\/arun-ks\/AutoJoinTeamsZoom/);
  assert.equal((html.match(/class="portfolio-live"/g) || []).length, 8);
  assert.match(html, /arun-ks\.github\.io\/CorporateBingo\//);
});
