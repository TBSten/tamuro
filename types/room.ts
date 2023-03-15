import { z } from "zod"
import { IconScheme } from "./icon"
import { RoomIdScheme, UserIdScheme } from "./id"

export const RoomScheme = z.object({
    roomId: RoomIdScheme,
    icon: IconScheme,
    name: z.string(),
    detail: z.string(),
    userIds: z.array(UserIdScheme),
    createAt: z.number(),
    updateAt: z.number(),
})
export type Room = z.infer<typeof RoomScheme>

export const RoomInputScheme = RoomScheme.pick({
    icon: true,
    name: true,
    detail: true,
    userIds: true,
})
export type RoomInput = z.infer<typeof RoomInputScheme>
