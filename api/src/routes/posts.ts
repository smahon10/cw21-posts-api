import { Hono } from "hono";
import { db } from "../db";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm/sql"
import { HTTPException } from "hono/http-exception";
import { zValidator } from '@hono/zod-validator'
import { createPostSchema, deletePostSchema, getPostSchema, updatePostBodySchema, updatePostParamSchema, queryParamsSchema } from "../validators/schemas";
import { asc, desc, like, count, SQL, and } from "drizzle-orm";

const postsRoute = new Hono();

// Read all posts
postsRoute.get("/posts", async (c) => {
  const allPosts = await db.select().from(posts);
  return c.json(allPosts);
});

// Read a specific post
postsRoute.get("/posts/:id", 
  zValidator("param", getPostSchema),
  async (c) => { // route handler
    // const id = Number(c.req.param("id"));
    const { id } = c.req.valid("param");
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .get()
    // SELECT * FROM posts WHERE id = :id

    if (!post) {
      throw new HTTPException(404, {
        message: "Post not found"
      })
    }      

    return c.json(post);
  }
);

// Get all posts with optional sorting, filtering, searching, and pagination
postsRoute.get("/posts", zValidator("query", queryParamsSchema), async (c) => {
  const { sort, search, page = 1, limit = 10 } = c.req.valid("query");
 
  const whereClause: (SQL | undefined)[] = [];
  if (search) {
    whereClause.push(like(posts.content, `%${search}%`));
  }
 
  const orderByClause: SQL[] = [];
  if (sort === "desc") {
    orderByClause.push(desc(posts.date));
  } else if (sort === "asc") {
    orderByClause.push(asc(posts.date));
  }
 
  const offset = (page - 1) * limit;
 
  const [allPosts, [{ totalCount }]] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(and(...whereClause))
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ totalCount: count() })
      .from(posts)
      .where(and(...whereClause)),
  ]);
 
  return c.json({
    posts: allPosts,
    page,
    limit,
    total: totalCount,
  });
});

// Delete a post
postsRoute.delete("/posts/:id", 
  zValidator("param", deletePostSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const post = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()
      .get()

    if (!post) {
      throw new HTTPException(404, {
        message: "Post not found"
      })
    }  

    return c.json(post);
  }
);

postsRoute.post("/posts", 
  zValidator("json", createPostSchema),
  async (c) => { // request handler (also a middleware)

    const { content } = c.req.valid("json");

    const post = await db
      .insert(posts)
      .values({
        content,
        date: new Date()
      })
      .returning()
      .get()      

    return c.json(post, 201);
  }
);

// Update a post
postsRoute.patch("/posts/:id", 
  zValidator("param", updatePostParamSchema),
  zValidator("json", updatePostBodySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    const post = await db
      .update(posts)
      .set({
        content
      })
      .where(eq(posts.id, id))
      .returning()
      .get()

    if (!post) {
      throw new HTTPException(404, {
        message: "Post not found"
      })
    }     

    return c.json(post);
  }
);

export default postsRoute;