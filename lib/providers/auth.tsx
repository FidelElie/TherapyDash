// ! Next and React
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ! Library
import { auth, db } from "../../config/firebase.client";
import type { User } from "../types";

type authType = { user: User | null }

const AuthContext = createContext<authType>({ user: null });

const AuthProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [authUser, setAuthUser] = useState<authType>({ user: null });

  console.log(authUser)

  useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      console.log("here");
      if (user) {
        const userId = user.uid;
        console.log(userId)
        const userRequest = db().collection("users").doc(userId);
        const userResponse = await userRequest.get();
        if (userResponse.exists) {
          const userInformation = userResponse.data() as User;
          setAuthUser({ user: userInformation });
        }
      } else {
        setAuthUser({ user: null });
      }
    })
  }, []);

  return (
    <AuthContext.Provider value={authUser}>
      { children }
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext);

export default AuthProvider;
export { useAuth };
