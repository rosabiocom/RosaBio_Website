// Prepares the p2single "Single Cell Demo" export in public/highlights/ for the site.
// Runs before every build, so a fresh export from the Claude page can be dropped in as-is.
// Safe to run repeatedly: it only changes things that still need changing.
//
// 1. Links to private claude.ai pages: point to the local study pages when we have them,
//    otherwise drop the link (keep its text).
// 2. "full results" links on cards without a local page are removed (the card itself
//    opens its detail panel).
// 3. index.html#cN opens card N's detail panel (used by the homepage panels).
// 4. Page title reads "Single Cell Demo".

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public", "highlights");
const CLAUDE = "https://claude.ai/artifact/";

// claude.ai artifact id -> local study page (relative to public/highlights/)
const STUDY_PAGES = {
  LTthSXNJBcsB83xjSXQwKq: "s/s1/index.html", // GSE123813
  "7QE9JMnaYL1WsyGCGhHGPE": "s/s3/index.html", // bmcite
  "3c4oNTA6kiam82xj6hqCm5": "s/s4/index.html", // SRP268462
};
const INDEX_ID = "12Y1fJvzEgSdhQQR8q9Gkf"; // "All studies (index)"

const DEEP_LINK = `<script id="card-deep-link">
/* Open a card's detail panel from a link like index.html#c7 */
(function () {
  function fromHash() {
    var m = /^#c(\\d+)$/.exec(location.hash), b = m && document.querySelector('#c' + m[1] + ' .cl');
    if (b) b.click();
  }
  window.addEventListener('load', fromHash);
  window.addEventListener('hashchange', fromHash);
})();
</script>
`;

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function update(file, fn) {
  const path = join(root, file);
  if (!existsSync(path)) return;
  const before = readFileSync(path, "utf8");
  const after = fn(before);
  if (after !== before) {
    writeFileSync(path, after);
    console.log(`prepare-highlights: updated ${file}`);
  }
}

if (!existsSync(join(root, "index.html"))) {
  console.log("prepare-highlights: no public/highlights/index.html, skipping");
  process.exit(0);
}

// Main demo page
update("index.html", (s) => {
  // "full results" links: local study page if we have one, else remove
  s = s.replace(
    /<a class="go" href="https:\/\/claude\.ai\/artifact\/([A-Za-z0-9]+)(#[^"]*)?"[^>]*>(.*?)<\/a>/g,
    (all, id, hash = "", text) => {
      const page = STUDY_PAGES[id];
      return page ? `<a class="go" href="${page}${hash}" target="_blank" rel="noopener">${text}</a>` : "";
    }
  );
  // any other claude.ai link: keep the text, drop the link
  s = s.replace(new RegExp(`<a [^>]*href="${esc(CLAUDE)}[^"]*"[^>]*>(.*?)</a>`, "g"), "$1");
  s = s.replace("<title>p2single Highlights</title>", "<title>Single Cell Demo</title>");
  s = s.replace("<h1>p2single Highlights</h1>", "<h1>Single Cell Demo</h1>");
  if (!s.includes('id="card-deep-link"')) {
    const i = s.lastIndexOf("</body>");
    s = i >= 0 ? s.slice(0, i) + DEEP_LINK + s.slice(i) : s + DEEP_LINK;
  }
  return s;
});

// Study pages
for (const n of ["s1", "s3", "s4"]) {
  update(`s/${n}/index.html`, (s) => {
    for (const [id, page] of Object.entries(STUDY_PAGES)) {
      s = s.replaceAll(CLAUDE + id, "../" + page.slice(2));
    }
    s = s.replaceAll(CLAUDE + INDEX_ID, "../../index.html");
    s = s.replaceAll("All studies (index)", "All highlights");
    // sidenav entries for pages we don't have
    s = s.replace(new RegExp(`,?\\n\\s*\\['[A-Za-z0-9]+', '${esc(CLAUDE)}[A-Za-z0-9]+', '[^']*'\\]`, "g"), "");
    // study-nav links to pages we don't have: drop them from the nav entirely
    s = s.replace(/(<nav class="studies"[\s\S]*?<\/nav>)/, (nav) =>
      nav.replace(new RegExp(`<a href="${esc(CLAUDE)}[^"]*"[^>]*>[\\s\\S]*?</a>`, "g"), "")
    );
    // any remaining claude.ai link in the text: keep the text, drop the link
    s = s.replace(new RegExp(`<a href="${esc(CLAUDE)}[^"]*"[^>]*>([\\s\\S]*?)</a>`, "g"), "$1");
    return s;
  });
}
