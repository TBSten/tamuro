import { User, UserInput, UserScheme } from "types";
import { UserId } from "types/id";
import { db } from ".";
import { newId } from "../id";

export const users = db.collection("users")

const fsDocDataToUser = async (data: FirebaseFirestore.DocumentData) => {
    return UserScheme.parse(data)
}

export const getUsers = async ({ userIds }: { userIds: UserId[] }): Promise<User[]> => {
    const users = await Promise.all(userIds.map(userId => getUser({ userId })))
    return users.filter((user): user is User => !!user)
}
export const getUser = async ({ userId }: { userId: UserId }): Promise<User | null> => {
    const snapshot = await users.doc(userId).get()
    const data = snapshot.data()
    if (!data) return null
    return await fsDocDataToUser(data)
}

export const addUser = async (accountId: string | null, input: UserInput): Promise<User> => {
    const userId = accountId ?? newId()
    const data: User = {
        userId,
        ...input,
    }
    await users.doc(userId).set(data)
    return UserScheme.parse(await getUser({ userId, }))
}

