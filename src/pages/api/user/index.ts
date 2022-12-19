import { withIronSessionApiRoute } from "iron-session/next/dist"
import { userDB } from "lib/api/userDB"
import { authCookieInformation } from "lib/auth"
import { NextApiRequest, NextApiResponse } from "next"
import ApiRepsonse, { HTTPMethods } from "types/ApiResponse"
import { User } from "types/User"

export default withIronSessionApiRoute(
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const json: ApiRepsonse<User[] | User | undefined> = {
        success: true,
        result: undefined,
      }
      console.log(req.body)
      const { id, ...rest } = JSON.parse(req.body || "{}") as User
      res.status(200)
      switch (req.method as HTTPMethods) {
        case "GET":
          // json.result =
          //   id === undefined ? await userDB.getAll() : await userDB.get(id)
          // @ts-ignore
          res.send({ user: req.session.user });
          // res.json(json)
          break
        case "PUT":
          console.log(id)
          await userDB.update(id, rest)
          res.json(json)
          break
        case "POST":
          json.result = await userDB.add(rest)
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
      return res
        .status(500)
        .json({ success: false, message: e?.message || "unknown error" })
    }
  },
  authCookieInformation
)
