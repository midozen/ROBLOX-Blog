import { getUserFromSession, loginUser } from "@utils/auth";
import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";

interface PostData {
  id: number;
  title: string;
  content: string;
}

function validatePostData(data: FormData): PostData {
  const id = Number(data.get("postID")) as number;
  const title = data.get("title") as string;
  const content = data.get("content") as string;

  if (isNaN(id)) throw new Error("Invalid post Id");

  if (title.length < 3)
    throw new Error("Title must have at least 3 characters");

  if (content.length < 8)
    throw new Error("Content must have at least 8 characters");

  return { id, title, content };
}

export async function POST({ request, cookies, redirect }: APIContext) {
  try {
    const user = await getUserFromSession(
      cookies.get("wp-auth-session")?.value
    );

    const formData = await request.formData();
    const { id, title, content } = validatePostData(formData);

    const postCount = await prisma.post.count({ where: { id } });

    if (postCount == 0) throw new Error("Post does not exist.");

    await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    return redirect(`/post/${id}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    cookies.set("error", errorMessage, { path: "/dashboard" });
    return redirect("/dashboard/edit");
  }
}
