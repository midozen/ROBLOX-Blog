import { getUserFromSession, loginUser } from "@utils/auth";
import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";

import type { Category } from "@prisma/client";

export async function POST({ request, cookies }: APIContext) {
    try {
        const user = await getUserFromSession(cookies.get("wp-auth-session")?.value);

        const { categoryName } = await request.json() as Category;

        await prisma.category.create({ data: { categoryName } })

        return new Response(null, { status: 200 })
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";

        return new Response(errorMessage, { status: 500 })
    }
}
