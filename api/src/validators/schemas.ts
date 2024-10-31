
import { z } from "zod";

export const createPostSchema = z.object({
    content: z
        .string({ message: "Your post needs to include a content attribute" })
        .min(1, "Content cannot be empty")
        .max(240, "Content is too long; it needs to be at most 240 characters!")
})

export const getPostSchema = z.object({
    id: z.coerce.number().int().positive()
})

export const deletePostSchema = z.object({
    id: z.coerce.number().int().positive()
})

export const updatePostParamSchema = z.object({
    id: z.coerce.number().int().positive()
})

export const updatePostBodySchema = createPostSchema.partial();