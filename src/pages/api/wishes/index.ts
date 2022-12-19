import { wishDB } from "lib/api/wishDB"
import { NextApiRequest, NextApiResponse } from "next"
import ApiRepsonse, { HTTPMethods } from "types/ApiResponse"
import { Wish } from "types/Wish"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const json: ApiRepsonse<Wish[] | Wish | undefined> = {
      success: true,
      result: undefined,
    }
    console.log(req.body)
    const { id, ...rest } = JSON.parse(req.body || "{}") as Wish
    res.status(200)
    switch (req.method as HTTPMethods) {
      case "GET":
        json.result = await wishDB.getAll()
        res.json(json)
        break
      case "PUT":
        console.log(id)
        await wishDB.update(id, rest)
        res.json(json)
        break
      case "POST":
        json.result = await wishDB.add(rest)
        res.json(json)
        break
      case "DELETE":
        await wishDB.delete(id)
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
}
