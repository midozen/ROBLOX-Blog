export interface ParsedImageResult {
  altText: string;
  align?: "right" | "left" | "none";
  width?: number;
}

export interface ParsedPost {
  image: { url: string; alt: string } | null;
  description: string;
}