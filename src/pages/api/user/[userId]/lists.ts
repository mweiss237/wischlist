import { withIronSessionApiRoute } from "iron-session/next"
import { userDB } from "lib/api"
import { authCookieInformation } from "lib/auth"
import { NextApiRequest, NextApiResponse } from "next"
import { List, User } from "types"
import ApiResponse, { HTTPMethods } from "types/ApiResponse"

interface UserDocumentData extends User, FirebaseFirestore.DocumentData {}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const json: ApiResponse<User[] | User | undefined> = {
      success: true,
      result: undefined,
    }
    res.status(200)

    const { userId } = req.query
    if (!userId || typeof userId !== "string") throw `Invalid user id ${userId}`
    const userRef = await userDB.get(userId)

    const userData = (await (await userRef.get()).data()) as User
    const userLists = await Promise.all(
      userData.lists.map(async (listRef) => ({
        id: listRef.id,
        ...(await (await listRef.get()).data()),
      }))
    )
    switch (req.method as HTTPMethods) {
      case "GET":
        res.send(userLists)
        break

      default:
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} not allowed`,
        })
    }

    return res
  } catch (e: any) {
    console.error(`Error: ${e.stack}`)
    return res.status(500).json({
      success: false,
      message: typeof e === "string" ? e : e?.message || "unknown error",
    })
  }
}

export default withIronSessionApiRoute(handler, authCookieInformation)
