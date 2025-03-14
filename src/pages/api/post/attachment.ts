import { validateSession } from "@lib/auth/session";
import { uploadAttachment } from "@lib/r2";

import type { APIContext } from "astro";


export async function POST({ request, cookies, redirect }: APIContext) {
    try {
        const user = await validateSession(cookies.get("wp-auth-session")?.value);

        const formData = await request.formData();
        // get image file
        const imageFile = formData.get("image") as File;

        const file = await uploadAttachment(imageFile);

        return new Response(JSON.stringify({ url: `${import.meta.env.PUBLIC_CDN_URL}/${file}` }), { status: 200 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";

        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}
