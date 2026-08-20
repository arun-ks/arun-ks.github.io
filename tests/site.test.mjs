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

test("uses project-relative resume and asset links", () => {
  assert.match(html, /\/arun-ks\/Arun-K-Sivanandan-CV\.pdf/);
  assert.match(html, /\/arun-ks\/og\.png/);
});
