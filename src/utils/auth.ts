import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

import type { User } from "./types";

export const createSession = async (userId: number): Promise<string> => {
  const session = await prisma.session.create({
    data: {
      userId,
      token: crypto.randomBytes(32).toString("hex"),
    },
  });

  return session.token;
};

export async function loginUser(
  username: string,
  password: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  const token = await createSession(user.id);

  return token;
}

export const getUserFromSession = async (token: string | undefined): Promise<User> => {
  if (!token)
    throw new Error("No session token provided");

  const session = await prisma.session.findUnique({
    where: { token },
    select: {
      User: {
        select: { id: true, username: true, pfp: true, bio: true },
      }
    },
  });

  if (!session || !session.User)
    throw new Error("Invalid session token");

  return session.User;
};