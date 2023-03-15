import { addMessage, getMessage, getPartMessages } from "lib/server/firestore/message";
import { NextApiHandler } from "next";
import { MessageInputScheme, RoomId, WorkspaceId } from "types";

const handler: NextApiHandler = async (req, res) => {
    const workspaceId = req.query.workspaceId as WorkspaceId
    const roomId = req.query.roomId as RoomId
    if (req.method === "GET") {
        const before = parseInt(req.query.before as string)
        const limit = parseInt(req.query.limit as string)
        const messages = await getPartMessages({
            workspaceId,
            roomId,
            before,
            limit,
        })
        res.json(messages)
        return
    }
    if (req.method === "POST") {
        const input = MessageInputScheme.parse(JSON.parse(req.body))
        const newMessage = await addMessage(workspaceId, roomId, input)
        res.json(await getMessage({ workspaceId, roomId, messageId: newMessage?.messageId ?? "" }))
        return
    }
}
export default handler
