import { z } from "zod"
import { IconInputScheme, IconScheme } from "./icon"
import { UserIdScheme, WorkspaceIdScheme } from "./id"
import { RoomInputScheme, RoomScheme } from "./room"
import { UserScheme } from "./user"

export const WorkspaceScheme = z.object({
    workspaceId: WorkspaceIdScheme,
    icon: IconScheme,
    name: z.string(),
    detail: z.string(),
    rooms: z.array(RoomScheme),
    users: z.array(UserScheme),
    createAt: z.number(),
    updateAt: z.number(),
})
export type Workspace = z.infer<typeof WorkspaceScheme>

export const WorkspaceInputScheme = WorkspaceScheme.pick({
    name: true,
    detail: true,
}).extend({
    icon: IconInputScheme,
    rooms: z.array(RoomInputScheme).default([]),
    userIds: z.array(UserIdScheme).default([]),
})
export type WorkspaceInput = z.infer<typeof WorkspaceInputScheme>

