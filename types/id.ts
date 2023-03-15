import { z } from "zod";

export const UserIdScheme = z.string()
export type UserId = z.infer<typeof UserIdScheme>

export const FileIdScheme = z.string()
export type FileId = z.infer<typeof FileIdScheme>

export const MessageIdScheme = z.string()
export type MessageId = z.infer<typeof MessageIdScheme>

export const RoomIdScheme = z.string()
export type RoomId = z.infer<typeof RoomIdScheme>

export const WorkspaceIdScheme = z.string()
export type WorkspaceId = z.infer<typeof WorkspaceIdScheme>
