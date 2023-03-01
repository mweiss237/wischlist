import { withIronSessionApiRoute } from "iron-session/next"
import { authCookieInformation } from "lib/auth"
import { NextApiRequest, NextApiResponse } from "next"
import ApiResponse, { HTTPMethods } from "types/ApiResponse"
import { Wish } from "types/Wish"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const json: ApiResponse<Wish[] | Wish | undefined> = {
      success: true,
      result: undefined,
    }
    const user = req.session?.user
    if (!user || user?.id === null || user?.id === undefined) {
      res.status(405).send({ message: "Unauthorized." })
      return
    }
    const { id, ...rest } = JSON.parse(req.body || "{}") as Wish
    res.status(200)
    switch (req.method as HTTPMethods) {
      // case "GET":
      //   json.result 
      //   = await wishDB.where("userId", "==", user.id)
      //   res.json(json)
      //   break
      // case "PUT":
      //   await wishDB.update(id, { ...rest })
      //   res.json(json)
      //   break
      // case "POST":
      //   json.result = await wishDB.add({ ...rest })
      //   res.json(json)
      //   break
      // case "DELETE":
      //   await wishDB.delete(id)
      //   res.json(json)
      //   break
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
