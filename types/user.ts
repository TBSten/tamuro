import { z } from "zod"
import { IconScheme } from "./icon"
import { UserIdScheme } from "./id"

export const UserScheme = z.object({
    userId: UserIdScheme,
    name: z.string().min(1),
    image: IconScheme,
})
export type User = z.infer<typeof UserScheme>

export const UserInputScheme = UserScheme.pick({
    name: true,
    image: true,
})
export type UserInput = z.infer<typeof UserInputScheme>
