import { Prisma } from "@prisma/client";

export interface User {
  id: number;
  username: string;
}

const post = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    categories: true,
    author: {
      select: { username: true },
    },
  },
});

export type Post = Prisma.PostGetPayload<typeof post>;