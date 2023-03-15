import { addRoom, getRoom, getRooms } from "lib/server/firestore/room";
import { NextApiHandler } from "next";
import { RoomInputScheme, WorkspaceId } from "types";

const handler: NextApiHandler = async (req, res) => {
    const workspaceId = req.query.workspaceId as WorkspaceId
    if (req.method === "GET") {
        // const session = await unstable_getServerSession(req, res, authOptions)
        // const userId = session?.user.id
        // if (!userId) return res.json({ msg: `invalid userId :${userId}` })
        const rooms = await getRooms({ workspaceId, })
        res.json(rooms)
        return
    }
    if (req.method === "POST") {
        const input = RoomInputScheme.parse(JSON.parse(req.body))
        const newRoom = await addRoom(workspaceId, input)
        res.json(await getRoom({ workspaceId, roomId: newRoom?.roomId ?? "" }))
        return
    }
}
export default handler
