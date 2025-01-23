# ROBLOX 2006-2012 Blog
Recreation of the ROBLOX Blog from 2006-2012 with **Astro + Prisma**

# Build Instructions

1. Make a `.env` and configure your mysql connection:
    ```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
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