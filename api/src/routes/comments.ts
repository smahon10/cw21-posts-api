import { Hono } from "hono";
import { db } from "../db";
import { comments } from "../db/schema";
import { eq } from "drizzle-orm/sql"
import { getPostSchema } from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
const commentsRoute = new Hono();

// Read all posts
commentsRoute.get("posts/:id/comments", 
    zValidator("param", getPostSchema),
    async (c) => {
        const id = c.req.valid("param");

        const allComments = await db
            .select()
            .from(comments)
            .where(eq(comments.postId, id))

        return c.json(allComments);
    }
)

export default commentsRoute