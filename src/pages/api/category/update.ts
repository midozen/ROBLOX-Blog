import { getUserFromSession, loginUser } from "@utils/auth";
import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";

import type { Category } from "@utils/types";

export async function POST({ request, cookies }: APIContext) {
    try {
        const user = await getUserFromSession(cookies.get("wp-auth-session")?.value);

        const { id, categoryName } = await request.json() as Category;

        const categoryCount = await prisma.category.count({ where: { id } });
        if (categoryCount == 0) throw new Error("Category does not exist.");

        await prisma.category.update({
            where: { id },
            data: { categoryName }
        })

        return new Response(null, { status: 200 })
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";

        return new Response(errorMessage, { status: 500 })
    }
}
