# Posts - A Simplified Social Media Platform

Posts is a minimalistic clone of <https://posts.cv/>, which is itself a simplified and scaled-down alternative to Twitter. We built this clone solely for educational purposes.

This repository contains the CRUD operations for posts. It focuses on the backend API. The frontend was implemented using React in an earlier project.

## Run locally

1. Clone this repository.

2. Navigate to the project directory.

3. Navigate to the `api` directory and install the dependencies with `pnpm install`.

4. While in the `api` directory, run the API server, using `pnpm dev`. This will start the server on `http://localhost:3000`. The server will automatically reload if you make changes to the code.

   - You may want to use `pnpm run db:push` to create the database and `pnpm run db:seed` to seed it with some data before starting the server.
