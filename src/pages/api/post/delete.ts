import { getUserFromSession, loginUser } from "@utils/auth";
import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";

export async function GET({ url, cookies, redirect }: APIContext) {
  try {
    const user = await getUserFromSession(
      cookies.get("wp-auth-session")?.value
    );

    const id = Number(url.searchParams.get("id"));

    if (id == null || isNaN(id))
        throw new Error("ID is invalid")

    const postCount = await prisma.post.count({ where: { id } });
    if (postCount == 0) throw new Error("Post does not exist.");

    await prisma.post.delete({where: { id }})

    return redirect("/");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return redirect("/");
  }
}
