import { prisma } from "@lib/prisma";
import type { APIContext } from "astro";

export async function GET({ cookies, redirect }: APIContext) {
  const sessionCookie = cookies.get("wp-auth-session")?.value;
  cookies.delete("wp-auth-session");

  await prisma.session.delete({
    where: {
      token: sessionCookie,
    },
  });

  return redirect("/"); // Easy peasy, Lemon squeazy
}
