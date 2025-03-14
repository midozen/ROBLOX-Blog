import { JSDOM } from "jsdom";
import { marked } from "marked";

import { globalMarkedExtensions } from "@utils/index";

export async function parsePreviewContent(
  postContent: string,
  maxLength: number = 2
): Promise<{ content: string; shouldShowReadMore: boolean }> {

  marked.use(globalMarkedExtensions);

  const dom = new JSDOM(await marked(postContent));

  const document = dom.window.document;
  const elements = Array.from(document.body.children).slice(0, maxLength);

  const content = elements.map((el) => el.outerHTML).join("");
  const shouldShowReadMore = document.body.children.length > maxLength;
  
  return { content, shouldShowReadMore };
}
