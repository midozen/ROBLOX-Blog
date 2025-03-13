import { Prisma } from "@prisma/client";

const post = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    categories: true,
    author: {
      select: { id: true, username: true, pfp: true, bio: true },
    },
  },
});

export type Post = Prisma.PostGetPayload<typeof post>;