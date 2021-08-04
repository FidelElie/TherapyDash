
// ! Library
import { auth, db, storage } from "../../config/firebase.client";
import { newId } from "../utils";

interface SignInParams {
    email: string,
    password: string
}

interface SignUpParams extends SignInParams {
    repeatPassword: string,
    username: string,
    fileData: Blob
}

const signIn = async ({ email, password }: SignInParams) => {
    return auth().signInWithEmailAndPassword(email, password)
        .then(async ({ user }) => {
            try {
                const idToken = await user!.getIdToken();
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userToken: idToken })
                });
                return await response.json();
            } catch (error) {
                return { status: "error", error: error.code }
            }
        })
        .catch((error) =>  {
            console.clear();
            return { status: "error", error: error.code}
        });
}

const signUp = async ({ username, email, password, fileData}: SignUpParams) => {
    const userId = newId();
    const currentDate = new Date();

    const adminCreationRequest =  await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userInformation: {
                uid: userId,
                email,
                password,
                displayName: username
            }
        })
    });
    const adminCreationResponse = await adminCreationRequest.json();

    if (adminCreationResponse.status == "error") {
        return { status: "error", error: adminCreationResponse.error };
    }

    const storageRef = storage().ref();
    const storagePath = storageRef.child(`profiles/${userId}/${fileData.type.split("/")[0]}`);
    const userReference = db().collection("users");
    const metadataReference = db().collection("metadata");
    const metadataRequest = await metadataReference.doc("users").get();
    const metadataResponse = metadataRequest.exists ? metadataRequest.data() : {
        entries: 0
    }

    try {
        await storagePath.put(fileData);
        const storageDownload = await storagePath.getDownloadURL();

        const batch = db().batch();

        batch.set(userReference.doc(userId), {
            username,
            email,
            id: userId,
            picture: storageDownload
        });

        batch.set(metadataReference.doc("users"), {
            entries: metadataResponse!.entries + 1,
            dateModified: currentDate
        });

        await batch.commit();

        return await signIn({ email, password });
    } catch(error) {
        // Cleanup
        await storagePath.delete();
        console.clear();
        return { status: "error", error: error.code }
    }
}

const signOut = async () => {
    const response = await fetch("/api/logout", { method: "POST"});
    console.clear();
    return await response.json();
}

export { signIn, signUp, signOut };
export type {SignInParams, SignUpParams};

