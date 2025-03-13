import { prisma } from "@lib/prisma";
import type { APIContext } from "astro";

export async function GET({ cookies, redirect }: APIContext) {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
    take: 4,
    orderBy: { dateCreated: "desc" },
  });

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
