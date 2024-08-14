import {z} from "zod"

export const verifySchema=z.object({
    code: z.string().length(6, "Must be of 6 digits")
})