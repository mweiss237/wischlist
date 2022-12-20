import { AuthenticatedUser } from "types/User"

export const authCookieInformation = {
  cookieName: "wischlistAuthToken",
  password: "aTptU_4r)F#EG2pLY?jneb786>5R9K4EB3^+:CGp)3",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

declare module "iron-session" {
  interface IronSessionData {
    user?: AuthenticatedUser
  }
}
