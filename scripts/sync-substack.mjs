import { readFile, writeFile } from "node:fs/promises";

const feedUrl = "https://arunk5.substack.com/feed";
const archiveUrl = "https://arunk5.substack.com/api/v1/archive?sort=new&search=&offset=0&limit=5";
const cacheUrl = new URL("../src/data/substack-posts.json", import.meta.url);
const requestHeaders = {
  "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
  accept: "application/rss+xml, application/xml, application/json, text/xml, */*",
  "accept-language": "en-US,en;q=0.9",
};

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

const fetchRssPosts = async () => {
  const response = await fetch(feedUrl, { headers: requestHeaders });
  if (!response.ok) throw new Error(`RSS returned HTTP ${response.status}`);

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
  return posts;
};

const fetchArchivePosts = async () => {
  const response = await fetch(archiveUrl, { headers: requestHeaders });
  if (!response.ok) throw new Error(`archive API returned HTTP ${response.status}`);

  const archive = await response.json();
  if (!Array.isArray(archive)) throw new Error("archive API returned an invalid response");

  const posts = archive
    .slice(0, 5)
    .map((post) => ({
      title: textContent(post.title),
      excerpt: textContent(post.subtitle || post.description),
      href: post.canonical_url || "",
      image: post.cover_image || "",
    }))
    .filter((post) => post.title && post.href.startsWith("https://arunk5.substack.com/"));

  if (posts.length === 0) throw new Error("Substack archive contained no usable posts");
  return posts;
};

const fetchLatestPosts = async () => {
  try {
    return await fetchRssPosts();
  } catch (rssError) {
    console.warn(`Substack RSS unavailable; trying archive API. ${rssError.message}`);
    try {
      return await fetchArchivePosts();
    } catch (archiveError) {
      throw new Error(`${rssError.message}; ${archiveError.message}`);
    }
  }
};

try {
  const posts = await fetchLatestPosts();
  await writeFile(cacheUrl, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Cached ${posts.length} Substack articles.`);
} catch (error) {
  if (!(await cachedPostsExist())) throw error;
  if (process.env.SUBSTACK_SYNC_STRICT === "true") throw error;
  console.warn(`Substack refresh failed; using the existing cache. ${error.message}`);
}
