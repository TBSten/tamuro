import { z } from "zod"

export const IconScheme = z.union([
    z.object({
        type: z.literal("emoji"),
        emoji: z.string(),
    }),
    z.object({
        type: z.literal("url"),
        url: z.string(),
    }),
])
export type Icon = z.infer<typeof IconScheme>

export const IconInputScheme = IconScheme
