import { z } from "zod"

export const AuthApiRequestSchema = z.object({
    phone: z.string().min(10).max(10)
})

export type AuthApiRequestSchemaType = z.infer<
    typeof AuthApiRequestSchema
>
