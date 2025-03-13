import { JSDOM } from "jsdom";
import { marked } from "marked";

import type { Post } from "@utils/types/post";

export async function parsePost(post: Post) {
  // get the first image, and the first paragraph but cut it off at 150 characters
  const dom = new JSDOM(await marked(post.content ?? "Nothing."));

  const image = dom.window.document.querySelector("img");
  const paragraph = dom.window.document.querySelector("p");
  const description = paragraph?.textContent?.slice(0, 150);

  return {
    image: image ? { url: image.src, alt: image.alt } : null,
    description: `${description} … Continue reading →`,
  };
}
