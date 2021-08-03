import { admin } from "../../config/firebase.server";


import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const authInformation = req.body.userInformation;

    try {
        const authResponse = await admin.auth().createUser(authInformation);

        return res.status(200).json({ user: authResponse })
    } catch (error) {
        console.log(`Error Signing Up User ${authInformation.displayName}`)
        console.log(error);
        return res.status(500).json({ user: null })
    }
}
