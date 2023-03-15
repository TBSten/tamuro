import { Room, RoomInput, RoomScheme, WorkspaceId } from "types";

export const createRoom = async (workspaceId: WorkspaceId, input: RoomInput): Promise<Room> => {
    const res = await fetch(`/api/workspace/${workspaceId}/rooms`, {
        method: "POST",
        body: JSON.stringify(input),
    }).then(r => r.json())
    const room = RoomScheme.parse(res)
    return room
}
