import { Room, RoomInput, RoomScheme } from "types";
import { RoomId, WorkspaceId } from "types/id";
import { newId } from "../id";
import { workspaces } from "./workspace";

export const rooms = (workspaceId: WorkspaceId) => workspaces.doc(workspaceId).collection("rooms")

const fsDocDataToRoom = async (data: FirebaseFirestore.DocumentData) => {
    return RoomScheme.parse(data)
}

export const getRooms = async ({ workspaceId }: { workspaceId: WorkspaceId }): Promise<Room[]> => {
    const snapshot = await rooms(workspaceId).orderBy("updateAt", "desc").get()
    return Promise.all(snapshot.docs.map(d => fsDocDataToRoom(d.data())))
}
export const getRoom = async ({ workspaceId, roomId }: { workspaceId: WorkspaceId, roomId: RoomId }): Promise<Room | null> => {
    const snapshot = await rooms(workspaceId).doc(roomId).get()
    const data = snapshot.data()
    if (!data) return null
    return fsDocDataToRoom(data)
}

export const addRoom = async (workspaceId: WorkspaceId, input: RoomInput): Promise<Room> => {
    const roomId = newId()
    const createAt = Date.now().valueOf()
    const data: Room = {
        roomId,
        ...input,
        createAt,
        updateAt: createAt,
    }
    await rooms(workspaceId).doc(roomId).set(data)
    return RoomScheme.parse(await getRoom({ workspaceId, roomId, }))
}

