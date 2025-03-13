import { Prisma } from "@prisma/client";

export const postWithAuthorAndCategories = Prisma.validator<Prisma.PostInclude>()({
  categories: true,
  author: {
    select: {
      id: true,
      username: true,
      pfp: true,
      bio: true
    }
  }
});