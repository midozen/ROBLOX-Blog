import { parseImageMarkdownAttributes } from "@utils/parser/image";

import type { MarkedExtension } from "marked";

export function capitalizeDomainPrefix(domain: string) {
  const parts = domain.split(".");

  return parts[0].toUpperCase() + "." + parts[1];
}

export const globalMarkedExtensions: MarkedExtension = {
  renderer: {
    image(token): string {
        const { altText, align, width } = parseImageMarkdownAttributes(token.text);
        return `<img src="${token.href}" alt="${altText}" class="wp-image-0 align${align}" width="${width}"/>`;
    }
  },
};