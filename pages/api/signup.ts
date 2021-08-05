import { admin } from "../../config/firebase.server";


import type { NextApiRequest, NextApiResponse } from 'next'

const SignUp = async (req: NextApiRequest, res: NextApiResponse) => {
    const authInformation = req.body.userInformation;

    try {
        await admin.auth().createUser(authInformation);

        return res.status(200).json({ status: "success", error: null })
    } catch (error) {
        console.log(`Error Signing Up User ${authInformation.displayName}`)
        console.log(error);
        return res.status(500).json({ status: "error", error: error.errorInfo })
    }
}

export default SignUp;
