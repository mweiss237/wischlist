import { wishDB } from "lib/api/wish";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // const { wish } = req.body;
      // if (!wish.id) throw "";

      const data = await wishDB.getAll();

      return res.status(200).json({ success: true, result: data });
    } else {
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed` });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "wish is missing in body" });
  }
}
