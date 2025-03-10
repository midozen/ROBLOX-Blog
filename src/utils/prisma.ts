import { PrismaClient } from "@prisma/client";
import * as builder from "xmlbuilder";

export const prisma = new PrismaClient();

export async function getRSSFeed(): Promise<Response> {
  const FEED_CONFIG = {
    title: "Roblox Blog",
    siteUrl: `http://blog.${import.meta.env.PUBLIC_WEBSITE_URL}`,
    description: "The Roblog",
    language: "en",
  };

  try {
    // Fetch 10 posts with only the data we need.
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: { dateCreated: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        dateCreated: true,
      },
    });

    // Create RSS document
    const xmlDoc = builder
      .create("rss", { version: "1.0", encoding: "UTF-8" })
      .att("version", "0.92")
      .ele("channel")
      .ele("title")
      .txt(FEED_CONFIG.title)
      .up()
      .ele("link")
      .txt(FEED_CONFIG.siteUrl)
      .up()
      .ele("description")
      .txt(FEED_CONFIG.description)
      .up()
      .ele("language")
      .txt(FEED_CONFIG.language)
      .up();

    // Map posts to RSS items
    posts.forEach((post) => {
      xmlDoc
        .ele("item")
        .ele("title")
        .txt(post.title)
        .up()
        .ele("description")
        .txt(post.content || "No content available")
        .up()
        .ele("link")
        .txt(`${FEED_CONFIG.siteUrl}/?p=${post.id}`)
        .up()
        .ele("pubDate")
        .txt(post.dateCreated.toUTCString())
        .up()
        .up();
    });

    // Generate and return RSS feed
    return new Response(xmlDoc.end({ pretty: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // 1 hour
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    // Error handling
    console.error("Failed to generate RSS feed:", error);
    return new Response("Error generating RSS feed", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export const postInclude = {
  categories: true,
  author: {
    select: { username: true, pfp: true, bio: true },
  },
} as const;
