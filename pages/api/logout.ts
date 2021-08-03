import { destroyCookie } from "nookies";

import type { NextApiResponse } from "next";

export default async (_: null, res: NextApiResponse) => {
    try {
        destroyCookie({ res }, "session", { path: "/" });
        return res.status(200).json({ status: "success", error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", error: "server"});
    }
}
