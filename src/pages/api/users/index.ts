import { userDB } from "lib/api/userDB";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { user } = req.body;
      if (!user.id) throw "";

      userDB.get(user.id).then((reponse) => {});

      return res
        .status(200)
        .json({ success: true, message: "successful fetched" });
    } else {
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed` });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "user is missing in body" });
  }
}
