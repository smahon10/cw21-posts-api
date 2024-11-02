import { Hono } from "hono";
import { db } from "../db";
import { comments } from "../db/schema";
import { eq, and } from "drizzle-orm/sql"
import { getPostSchema, getSinglePostSchema, createPostSchema, updatePostParamSchema } from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

const commentsRoute = new Hono();

// Read all posts
commentsRoute.get("posts/:id/comments", 
    zValidator("param", getPostSchema),
    async (c) => {
        const postId = c.req.valid("param");

        const allComments = await db
            .select()
            .from(comments)
            .where(eq(comments.postId, postId));

        return c.json(allComments);
    }
)

// Get a single comment by id for a post
commentsRoute.get(
    "/posts/:postId/comments/:commentId",
    zValidator("param", getSinglePostSchema),
    async (c) => {
      const { postId, commentId } = c.req.valid("param");
      const comment = await db
        .select()
        .from(comments)
        .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
        .get();
      if (!comment) {
        throw new HTTPException(404, { message: "Comment not found" });
      }
      return c.json(comment);
    },
  );

  // Delete a comment by id for a post
  commentsRoute.delete(
    "/posts/:postId/comments/:commentId",
    zValidator("param", getSinglePostSchema),
    async (c) => {
      const { postId, commentId } = c.req.valid("param");
      const deletedComment = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
        .returning()
        .get();
      if (!deletedComment) {
        throw new HTTPException(404, { message: "Comment not found" });
      }
      return c.json(deletedComment);
    },
  );

  // Create a new comment for a post
  commentsRoute.post(
    "/posts/:postId/comments",
    zValidator("param", getPostSchema),
    zValidator("json", createPostSchema),
    async (c) => {
      const { postId } = c.req.valid("param");
      const { content } = c.req.valid("json");
      const newComment = await db
        .insert(comments)
        .values({
          content,
          date: new Date(),
          postId,
        })
        .returning()
        .get();
  
      return c.json(newComment);
    },
  );

  // Update a comment by id for a post
  commentsRoute.patch(
    "/posts/:postId/comments/:commentId",
    zValidator("param", getPostSchema),
    zValidator("json", updatePostParamSchema),
    async (c) => {
      const { postId, commentId } = c.req.valid("param");
      const { content } = c.req.valid("json");
      const updatedComment = await db
        .update(comments)
        .set({ content })
        .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
        .returning()
        .get();
  
      if (!updatedComment) {
        throw new HTTPException(404, { message: "Comment not found" });
      }
      return c.json(updatedComment);
    },
  );

export default commentsRoute