import { authenticateUser } from "@lib/auth/session";

import type { APIContext } from "astro";

interface RegisterData {
  username: string;
  password: string;
}

function validateRegisterData(data: FormData): RegisterData {
  const username = data.get("username") as string;
  const password = data.get("password") as string;

  if (username.length < 3 || username.length > 20) {
    throw new Error("Username must be between 3 and 20 characters");
  }

  if (password.length < 8 || password.length > 100) {
    throw new Error("Password must be between 8 and 100 characters");
  }

  return { username, password };
}

export async function POST({ request, cookies, redirect }: APIContext) {
  try {
    const formData = await request.formData();
    const { username, password } = validateRegisterData(formData);

    const token = await authenticateUser(username, password);
    if (!token) {
      throw new Error("Invalid username or password");
    }

    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    cookies.set("wp-auth-session", token, { path: "/", expires });

    return redirect("/dashboard");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    cookies.set("error", errorMessage, { path: "/" });
    return redirect("/wp-login");
  }
}
