import { userDB } from "lib/api/userDB"
import { NextApiRequest, NextApiResponse } from "next"
import { HTTPMethods } from "types/ApiResponse"
import { User, AuthenticatedUser } from "types/User"
import { withIronSessionApiRoute } from "iron-session/next"
import { authCookieInformation } from "lib/auth"

async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = JSON.parse(req.body || "{}") as User
    switch (req.method as HTTPMethods) {
      case "POST":
        const fetchedUsers = await userDB.where("email", "==", user.email)
        if (fetchedUsers.length === 0) throw `No user with email ${user.email}`

        const matchedUserSnap = fetchedUsers[0]
        const matchedUser = matchedUserSnap.data()

        if (matchedUser.passwordHash !== user.passwordHash)
          throw "Password incorrect"

        userDB.update(matchedUserSnap.id, { lastLogin: new Date() })

        req.session.user = {
          id: matchedUserSnap.id,
          username: matchedUser.username,
          admin: matchedUser?.admin || false,
        }
        await req.session.save()
        res.status(200)
        res.send({
          ...req.session.user,
          isLoggedIn: true,
        } as AuthenticatedUser)

        break
      case "DELETE":
        await req.session.destroy()
        res.send({
          isLoggedIn: false,
          username: null,
          id: null,
          admin: null,
        } as AuthenticatedUser)

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

export default withIronSessionApiRoute(loginHandler, authCookieInformation)
