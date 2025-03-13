import type { MarkedExtension } from "marked";

interface ParsedImageResult {
  altText: string;
  align?: "right" | "left" | "none";
  width?: number;
}

function parseImageOptions(text: string): ParsedImageResult {
  const result: ParsedImageResult = { altText: text, align: "none", width: 300 };

  const regex = /"([^"]+)"\s*(\{([^}]+)\})?/;
  const match = text.match(regex);

  if (match) {
    result.altText = match[1] || "";

    if (match[3]) {
      const options = match[3].split(";").map((option) => option.trim());

      // Parsing the options (align and width)
      options.forEach((option) => {
        if (option.startsWith("align:")) {
          const alignValue = option.split(":")[1].trim();
          if (["right", "left", "none"].includes(alignValue)) {
            result.align = alignValue as "right" | "left" | "none";
          }
        } else if (option.startsWith("width:")) {
          const widthValue = parseInt(option.split(":")[1].trim(), 10);
          if (!isNaN(widthValue)) {
            result.width = widthValue;
          }
        }
      });
    }
  }

  return result;
}

export const markedUse: MarkedExtension = {
  renderer: {
    image(token): string {
        const { altText, align, width } = parseImageOptions(token.text);
        return `<img src="${token.href}" alt="${altText}" class="wp-image-0 align${align}" width="${width}"/>`;
    }
  },
};
