import { readFile, writeFile } from "node:fs/promises";

const feedUrl = "https://arunk5.substack.com/feed";
const cacheUrl = new URL("../src/data/substack-posts.json", import.meta.url);

const decodeEntities = (value = "") => value
  .replace(/^<!\[CDATA\[|\]\]>$/g, "")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'");

const textContent = (value = "") => decodeEntities(value)
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const element = (xml, name) => {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? textContent(match[1]) : "";
};

const cachedPostsExist = async () => {
  try {
    const cached = JSON.parse(await readFile(cacheUrl, "utf8"));
    return Array.isArray(cached) && cached.length > 0;
  } catch {
    return false;
  }
};

try {
  const response = await fetch(feedUrl, { headers: { "user-agent": "arun-ks-portfolio/1.0" } });
  if (!response.ok) throw new Error(`Substack returned HTTP ${response.status}`);

  const feed = await response.text();
  const posts = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .slice(0, 5)
    .map(([, item]) => {
      const enclosure = item.match(/<enclosure\b[^>]*\burl="([^"]+)"/i);
      return {
        title: element(item, "title"),
        excerpt: element(item, "description"),
        href: element(item, "link"),
        image: enclosure ? decodeEntities(enclosure[1]) : "",
      };
    })
    .filter((post) => post.title && post.href.startsWith("https://arunk5.substack.com/"));

  if (posts.length === 0) throw new Error("Substack feed contained no usable posts");
  await writeFile(cacheUrl, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Cached ${posts.length} Substack articles.`);
} catch (error) {
  if (!(await cachedPostsExist())) throw error;
  console.warn(`Substack refresh failed; using the existing cache. ${error.message}`);
}
