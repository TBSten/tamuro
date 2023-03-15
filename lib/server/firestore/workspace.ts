import { Workspace, WorkspaceInput, WorkspaceScheme } from "types";
import { UserId, UserIdScheme, WorkspaceId, WorkspaceIdScheme } from "types/id";
import { z } from "zod";
import { db } from ".";
import { newId } from "../id";
import { addRoom, getRooms } from "./room";
import { getUsers } from "./user";

export const workspaces = db.collection("workspaces")

const fsDocDataToWorkspace = async (data: FirebaseFirestore.DocumentData): Promise<Workspace> => {
    const workspaceId = WorkspaceIdScheme.parse(data?.workspaceId)
    const userIds = z.array(UserIdScheme).parse(data?.userIds)
    const workspace = {
        ...data,
        rooms: await getRooms({ workspaceId, }),
        users: await getUsers({ userIds, }),
    }
    return WorkspaceScheme.parse(workspace)
}

export const getWorkspaces = async ({ userId }: { userId: UserId }): Promise<Workspace[]> => {
    const snapshot = await workspaces.where("userIds", "array-contains", userId).get()
    return Promise.all(snapshot.docs.map(d => fsDocDataToWorkspace(d.data())))
}

export const getWorkspace = async ({ workspaceId }: { workspaceId: WorkspaceId }): Promise<Workspace | null> => {
    const snapshot = await workspaces.doc(workspaceId).get()
    const data = snapshot.data()
    if (!data) return null
    return fsDocDataToWorkspace(data)
}

export const addWorkspace = async (input: WorkspaceInput) => {
    const workspaceId = newId()
    const { userIds, rooms, ...wsInputs } = input
    const createAt = Date.now().valueOf()
    const data = {
        workspaceId,
        ...wsInputs,
        userIds,
        createAt,
        updateAt: createAt,
    }
    await workspaces.doc(workspaceId).set(data)
    await Promise.all(rooms.map(r => addRoom(workspaceId, r)))
    return await getWorkspace({ workspaceId })
}

