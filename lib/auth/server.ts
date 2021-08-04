import { db } from "../../config/firebase.client";
import { admin } from "../../config/firebase.server";
import { parseCookies } from "nookies";
import { NextPageContext } from "next";

type verifyAuthType = {
    errorUrl?: string,
    successUrl?: string
    redirectOnSuccess?: boolean,
    redirectOnError?: boolean,
}

const verifyAuthDefaults = {
    errorUrl: "/",
    redirectOnSuccess: false,
    redirectOnError: true,
    successUrl: "/"
}

const redirect = (context: NextPageContext, redirectURL: string) => {
    context.res!.writeHead(302, { Location: redirectURL })
    context.res!.end()
    return { props: { user: null } }
}

const fetchAuthenticatedUser = async (uid: string) => {
    const userRef = db().collection("users");
    const currentUser = await userRef.where("id", "==", uid).get();
    return currentUser.docs[0].data();
}

const fetchSessionCookie = (context: NextPageContext) => {
    const cookies = parseCookies(context);
    return cookies.session || "";
}

const getServerAuth = (options: verifyAuthType = verifyAuthDefaults) => {
    const { successUrl, errorUrl, redirectOnSuccess, redirectOnError } = options;

    return async (context: NextPageContext) => {
        const sessionCookie = fetchSessionCookie(context);

        return admin
            .auth()
            .verifySessionCookie(sessionCookie, true)
            .then(async (decodedClaims) => {
                // Fetch User Information From Firestore
                const userInfo = await fetchAuthenticatedUser(decodedClaims.uid)

                return redirectOnSuccess ? redirect(context, successUrl!) : { props: { user: userInfo } }
            })
            .catch(() => {
                // User Cookie Not Found or Authenticated No One Is Logged In
                return redirectOnError ? redirect(context, errorUrl!) : { props: { user: null } }
            });
    }
}

export default getServerAuth;
