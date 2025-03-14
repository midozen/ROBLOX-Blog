import type { Post } from "@utils/types/post";

import { prisma } from "@lib/prisma";
import { postWithAuthorAndCategories } from "@lib/prisma/queries";

import { PAGINATION } from "@config/constants";

export interface PostSearchParams {
  page: number;
  category?: string;
  date?: { year?: number; month?: number };
  searchQuery?: string;
  username?: string;
}

export interface PostSearchResults {
  posts: Post[];
  total: number;
  pageCount: number;
}

export async function getPosts(
  params: PostSearchParams
): Promise<PostSearchResults> {
  const { page = 1, category, date, searchQuery, username } = params;

  const queryConditions = {
    ...(date &&
      (() => {
        const startDate = new Date(Number(date.year), Number(date.month) - 1, 1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        return { dateCreated: { gte: startDate, lt: endDate } };
      })()),
    ...(category && {
      categories: {
        some: { id: Number(category) },
      },
    }),
    ...(searchQuery && {
      title: { contains: searchQuery },
    }),
    ...(username && {
      author: { username },
    }),
  };

  // Get total posts for pagination
  const total = await prisma.post.count({ where: queryConditions });
  const pageCount = Math.ceil(total / PAGINATION.POSTS_PER_PAGE);
  
  // Calculate skip for pagination
  const skip = (page - 1) * PAGINATION.POSTS_PER_PAGE;

  // Fetch posts
  const posts = await prisma.post.findMany({
    include: postWithAuthorAndCategories,
    where: queryConditions,
    skip,
    take: PAGINATION.POSTS_PER_PAGE,
    orderBy: { dateCreated: "desc" }
  });

  return { posts, total, pageCount };
}
