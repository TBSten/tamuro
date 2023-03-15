import { Message, MessageInput, MessageScheme } from "types";
import { MessageId, RoomId, WorkspaceId } from "types/id";
import { newId } from "../id";
import { rooms } from "./room";

export const messages = (workspaceId: WorkspaceId, roomId: RoomId) => rooms(workspaceId).doc(roomId).collection("messages")

const fsDocDataToMessage = async (data: FirebaseFirestore.DocumentData) => {
    return MessageScheme.parse(data)
}

export const getAllMessages = async ({ workspaceId, roomId }: { workspaceId: WorkspaceId, roomId: RoomId }): Promise<Message[]> => {
    const snapshot = await messages(workspaceId, roomId).orderBy("createAt", "desc").get()
    return Promise.all(snapshot.docs.map(d => fsDocDataToMessage(d.data())))
}
export const getMessage = async ({ workspaceId, roomId, messageId }: { workspaceId: WorkspaceId, roomId: RoomId, messageId: MessageId }): Promise<Message | null> => {
    const snapshot = await messages(workspaceId, roomId).doc(messageId).get()
    const data = snapshot.data()
    if (!data) return null
    return fsDocDataToMessage(data)
}
export const getPartMessages = async ({ workspaceId, roomId, before, limit, }: { workspaceId: WorkspaceId, roomId: RoomId, before: number, limit: number }): Promise<Message[]> => {
    // createAt<=before
    // orderBy createAt desc
    const snapshot = await messages(workspaceId, roomId)
        .where("createAt", "<", before)
        .orderBy("createAt", "desc")
        .limit(limit)
        .get()
    const msgs = await Promise.all(snapshot.docs.map(d => fsDocDataToMessage(d.data())))
    return msgs.reverse()
}

export const addMessage = async (workspaceId: WorkspaceId, roomId: RoomId, input: MessageInput): Promise<Message> => {
    const messageId = newId()
    const createAt = Date.now().valueOf()
    const data: Message = {
        messageId,
        ...input,
        createAt,
        updateAt: createAt,
    }
    await messages(workspaceId, roomId).doc(messageId).set(data)
    return MessageScheme.parse(await getMessage({ workspaceId, roomId, messageId, }))
}

