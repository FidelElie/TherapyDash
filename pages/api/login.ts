import { setCookie } from "nookies";
import { admin } from "../../config/firebase.server";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const userToken = req.body.userToken;
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    return admin
        .auth()
        .createSessionCookie(userToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true, path: "/" }
                setCookie({ res }, "session", sessionCookie, options);
                return res.status(200).json({ status: "success", error: null });
            }
        ).catch(
            (error) => {
                console.log(error);
                return res.status(401).json({ status: "error", error: "server" });
            }
        )
}
