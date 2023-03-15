import { getUser } from "lib/server/firestore/user";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "GET") {
        const userId = req.query.userId as string
        const user = await getUser({ userId })
        res.json(user)
        return
    }
}
export default handler;
