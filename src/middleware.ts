import type { User } from "@utils/types/user";
import type { APIContext, MiddlewareNext } from "astro";

import { validateSession } from "@lib/auth/session";

const PROTECTED_ROUTES = ["/dashboard/*", "/dashboard"];
const UNAUTHORIZED_ROUTES = ["/wp-login"];

async function setUserLocals(session?: string): Promise<User | null> {
  if (!session) return null;

  try {
    return await validateSession(session);
  } catch (error) {
    console.error("Error setting user:", error);
    return null;
  }
}

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) =>
      new RegExp(`^${route.replace("*", ".*")}$`).test(pathname)
    );
  }
  
  function isUnauthorizedRoute(pathname: string): boolean {
    return UNAUTHORIZED_ROUTES.some((route) =>
      new RegExp(`^${route.replace("*", ".*")}$`).test(pathname)
    );
  }
  
  export async function onRequest(
    { locals, cookies, url, redirect }: APIContext,
    next: MiddlewareNext
  ) {
    const sessionCookie = cookies.get("wp-auth-session")?.value;
    locals.user = await setUserLocals(sessionCookie);

    if (sessionCookie && locals.user == null)
      cookies.delete("wp-auth-session")

    const pathname = url.pathname;
  
    if (isProtectedRoute(pathname) && !locals.user) {
      return redirect("/wp-login");
    }
  
    if (isUnauthorizedRoute(pathname) && locals.user) {
      return redirect("/dashboard");
    }
  
    return next();
  }
  