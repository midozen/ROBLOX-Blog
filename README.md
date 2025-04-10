# ROBLOX 2006-2011 Blog
Recreation of the ROBLOX Blog from 2006-2011 with **Astro + Prisma**

> [!WARNING]  
> This code is unmainted and isn't as optimized and customizable as the newer version of the blog. Take this with caution as I am too lazy to rework this codebase.

# Build Instructions

1. Make a `.env` and configure your mysql connection:
    ```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    PUBLIC_WEBSITE_URL=myrevival.com # Link to your revival for certain parts of the site.
    PUBLIC_PRODUCTION_URL=https://blog.myrevival.com # Where the blog is going to be hosted in during production
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
