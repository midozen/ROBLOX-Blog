import * as builder from "xmlbuilder";
import { prisma } from "./prisma";

export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  let daySuffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  }

  return `${month} ${day}${daySuffix}, ${year}`;
}

export function generateMonthYears(startDate?: Date) {
  const monthYears: Array<{
    num: string;
    formatted: string;
  }> = [];

  const start = new Date(startDate ?? new Date());
  const current = new Date();

  start.setDate(1);
  current.setDate(1);

  while (
    start.getFullYear() < current.getFullYear() ||
    (start.getFullYear() === current.getFullYear() &&
      start.getMonth() <= current.getMonth()) // I don't fucking know anymore dude I just wanna sleep
  ) {
    const year = start.getFullYear();
    const month = start.getMonth() + 1;

    monthYears.push({
      num: `${year}${month.toString().padStart(2, "0")}`,
      formatted: start.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    });

    // Create a new date to avoid mutation
    start.setMonth(start.getMonth() + 1);
  }

  return monthYears;
}

export async function getRSSFeed(): Promise<Response> {
  const FEED_CONFIG = {
    title: "Roblox Developers' Journal",
    siteUrl: "http://blog.cirkl.zone",
    description: "The Roblog",
    language: "en"
  }

  try {
    // Fetch 10 posts with only the data we need.
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: { dateCreated: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        dateCreated: true
      }
    });

    // Create RSS document
    const xmlDoc = builder.create("rss", { version: '1.0', encoding: 'UTF-8' })
      .att("version", "0.92")
      .ele("channel")
        .ele("title").txt(FEED_CONFIG.title).up()
        .ele("link").txt(FEED_CONFIG.siteUrl).up()
        .ele("description").txt(FEED_CONFIG.description).up()
        .ele("language").txt(FEED_CONFIG.language).up()

    // Map posts to RSS items
    posts.forEach(post => {
      xmlDoc.ele("item")
        .ele("title").txt(post.title).up()
        .ele("description").txt(post.content || "No content available").up()
        .ele("link").txt(`${FEED_CONFIG.siteUrl}/?p=${post.id}`).up()
        .ele("pubDate").txt(post.dateCreated.toUTCString()).up()
      .up();
    });

    // Generate and return RSS feed
    return new Response(xmlDoc.end({ pretty: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // 1 hour
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    // Error handling
    console.error("Failed to generate RSS feed:", error);
    return new Response("Error generating RSS feed", {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}