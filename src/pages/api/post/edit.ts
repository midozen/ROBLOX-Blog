import { getUserFromSession, loginUser } from "@utils/auth";
import { getPostLink } from "@utils/general";
import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";

interface PostData {
  id: number;
  title: string;
  content: string;
  categories: number[];
}

function validatePostData(data: FormData): PostData {
  const id = Number(data.get("postID")) as number;
  const title = data.get("title") as string;
  const content = data.get("content") as string;

  // Extract all category IDs from fields that start with "category"
  const categories: number[] = [];
  data.forEach((value, key) => {
    if (key.startsWith("category") && !isNaN(Number(value))) {
      categories.push(Number(value)); // Convert value to number and add to categories array
    }
  });

  if (isNaN(id)) throw new Error("Invalid post Id");

  if (title.length < 3)
    throw new Error("Title must have at least 3 characters");

  if (content.length < 8)
    throw new Error("Content must have at least 8 characters");

  return { id, title, content, categories };
}

export async function POST({ request, cookies, redirect }: APIContext) {
  try {
    const user = await getUserFromSession(
      cookies.get("wp-auth-session")?.value
    );

    const formData = await request.formData();
    const { id, title, content, categories } = validatePostData(formData);

    const postCount = await prisma.post.count({ where: { id } });

    if (postCount == 0) throw new Error("Post does not exist.");

    const post = await prisma.post.update({
      where: { id },
      data: { 
        title, 
        content, 
        categories: { set: categories.map(id => ({ id }))} 
      }
    });

    return redirect(getPostLink(post));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    cookies.set("error", errorMessage, { path: "/dashboard" });
    return redirect("/dashboard/edit");
  }
}