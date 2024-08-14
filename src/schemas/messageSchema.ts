import {z} from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, "should be atleast 10 words")
    .max(300, "cannot be of more than 300 characters")
})