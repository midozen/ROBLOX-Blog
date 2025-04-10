# ROBLOX 2012 Blog
Recreation of the ROBLOX Blog from 2012 with **Astro + Prisma + R2 Buckets**



> [!NOTE]  
> Looking for a recreation of the blog from 2006-2011? Check out an earlier fork of this project right [here](https://github.com/midozen/ROBLOX-Blog/tree/legacy-2011-blog)!

# Build Instructions

1. Make a `.env` and follow the example configuration:
    ```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

    R2_ACCOUNTID={ACCOUNTID} # https://{ACCOUNTID}.r2.cloudflarestorage.com
    R2_ACCESS_KEY_ID={ACCESS_KEY_ID} # Generate an API token for this
    R2_SECRET_ACCESS_KEY={ACCESS_KEY} # Generate an API token for this
    R2_BUCKET_NAME={BUCKET_NAME} # The bucket that the blog uploads media to

    PUBLIC_CDN_URL=https://cdn.somerevival.com # Where the blog resolves profile pictures from
    PUBLIC_WEBSITE_URL=somerevival.com # Everything related to https://SUBDOMAIN.roblox.com will fetch from this

    # OPTIONAL

    # PUBLIC_WIKI_URL=https://somerevival.wiki # instead of wiki.roblox.com it would be a custom url
    ```

2. Generate the database from the prisma schema by running this in your command line.
    ```bash
    npx prisma db push
    ```

2. Build the website
    ```bash
    npm run build
    ```

3. Run the server!
    ```bash
    node ./dist/server/entry.mjs
    ```

    Optionally you may need to provide the host and port the server will run on, for example you need it to point to `192.168.1.130:2456` instead of by default `localhost:4321`

    ```bash
    HOST=192.168.1.130 PORT=2456 node ./dist/server/entry.mjs
    ```
*Follow the same instructions but on Step 3 use `npm run dev` if you're trying to make changes to the blog.*
