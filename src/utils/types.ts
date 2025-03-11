import { Prisma } from "@prisma/client";

export interface User {
  id: number;
  username: string;
  pfp: string;
  bio: string;
}

const post = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    categories: true,
    author: {
      select: { username: true, pfp: true, bio: true },
    },
  },
});

export type Post = Prisma.PostGetPayload<typeof post>;