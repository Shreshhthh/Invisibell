import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be of 2 characters")
    .max(20, "username must not exceed 20 characters")

export const signUpValidation = z.object(
    {
        username: usernameValidation,
        email: z.string().email({message:"Invalid email"}),
        password: z.string().min(8, "Password must be of 8 characters"),
    }
)