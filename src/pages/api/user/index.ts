import { withIronSessionApiRoute } from "iron-session/next"
import { authCookieInformation } from "lib/auth"
import { NextApiRequest, NextApiResponse } from "next"
import ApiResponse, { HTTPMethods } from "types/ApiResponse"
import { User } from "types/User"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const json: ApiResponse<User[] | User | undefined> = {
      success: true,
      result: undefined,
    }
    res.status(200)
    switch (req.method as HTTPMethods) {
      case "GET":
        res.send({
          ...req.session.user,
          isLoggedIn: req.session.user ? true : false,
        })
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
      .json({
        success: false,
        message: typeof e === "string" ? e : e?.message || "unknown error",
      })
  }
}

export default withIronSessionApiRoute(handler, authCookieInformation)
