import { z } from "zod"
import { FileIdScheme, MessageIdScheme, UserIdScheme } from "./id"

export const FileScheme = z.object({
    fileId: FileIdScheme,
    url: z.string(),
})

export const MessageScheme = z.object({
    messageId: MessageIdScheme,
    content: z.string(),
    files: z.array(FileScheme),
    authorId: UserIdScheme,
    createAt: z.number(),
    updateAt: z.number(),
})
export type Message = z.infer<typeof MessageScheme>

export const MessageInputScheme = MessageScheme.pick({
    authorId: true,
    content: true,
    files: true,
})
export type MessageInput = z.infer<typeof MessageInputScheme>
