import { z } from "zod";

export const createPostSchema = z.object({
    content: z
        .string({ message: "Your post needs to include a content attribute" })
        .min(1, "Content cannot be empty")
        .max(240, "Content is too long; it needs to be at most 240 characters!")
})

// get all posts
export const getPostSchema = z.object({
    id: z.coerce.number().int().positive()
})

// get single post
export const getSinglePostSchema = z.object({
    postId: z.coerce.number().int().positive(),
    commentId: z.coerce.number().int().positive(),
  });

export const deletePostSchema = z.object({
    id: z.coerce.number().int().positive()
})

export const updatePostParamSchema = z.object({
    id: z.coerce.number().int().positive()
})

export const updatePostBodySchema = createPostSchema.partial();

export const queryParamsSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  });