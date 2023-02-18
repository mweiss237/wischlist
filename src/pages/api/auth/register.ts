import { userDB } from "lib/api/userDB"
import { NextApiRequest, NextApiResponse } from "next"
import ApiResponse, { HTTPMethods } from "types/ApiResponse"
import { User } from "types/User"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const json: ApiResponse<User[] | User | undefined> = {
      success: true,
      result: undefined,
    }
    const { id, ...user } = JSON.parse(req.body || "{}") as User
    res.status(200)
    switch (req.method as HTTPMethods) {
      case "POST":
        const usernameCheck = await userDB.where(
          "username",
          "==",
          user.username
        )
        const emailCheck = await userDB.where("email", "==", user.email)
        if (usernameCheck.length > 0 || emailCheck.length > 0)
          throw "email or username exist already"

        const docRef = await userDB.add(user)
        const docSnap = await docRef.get()
        json.result = { id: docRef.id, ...docSnap.data() } as User
        res.json(json)
        break
      case "DELETE":
        await userDB.delete(id)
        res.json(json)
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
