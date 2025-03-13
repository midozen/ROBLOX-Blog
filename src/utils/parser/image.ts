import type { ParsedImageResult } from "@utils/types/parser";

export function parseImageMarkdownAttributes(text: string): ParsedImageResult {
  const result: ParsedImageResult = {
    altText: text,
    align: "none",
    width: 300,
  };

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
