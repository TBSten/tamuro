import { addWorkspace, getWorkspace, getWorkspaces } from "lib/server/firestore/workspace";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { WorkspaceInputScheme } from "types";
import { authOptions } from "./auth/[...nextauth]";

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        const session = await unstable_getServerSession(req, res, authOptions)
        const userId = session?.user.id
        if (!userId) return res.json({ msg: `invalid userId :${userId}` })
        const workspaces = await getWorkspaces({ userId, })
        res.json(workspaces)
        return
    }
    if (req.method === "POST") {
        const input = WorkspaceInputScheme.parse(JSON.parse(req.body))
        const newWorkspace = await addWorkspace(input)
        res.json(await getWorkspace({ workspaceId: newWorkspace?.workspaceId ?? "" }))
        return
    }
}
export default handler
