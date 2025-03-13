import { getUserFromSession, loginUser } from "src/lib/auth/auth";
import { prisma } from "@lib/prisma";
import type { APIContext } from "astro";

export async function POST({ url, cookies }: APIContext) {
  try {
    const user = await getUserFromSession(cookies.get("wp-auth-session")?.value);

    const id = Number(url.searchParams.get("id"));

    if (id == null || isNaN(id)) throw new Error("ID is invalid");

    const categoryCount = await prisma.category.count({ where: { id } });
    if (categoryCount == 0) throw new Error("Post does not exist.");

    await prisma.category.delete({ where: { id } });

    return new Response(null, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(errorMessage, { status: 500 });
  }
}
