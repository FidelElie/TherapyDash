// ! Next and React
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

// ! Library
import getServerAuth from "../lib/auth/server";
import { useLoader } from "../lib/providers/loader";

// ! Components
import AppLayout from "../components/layouts/app";
import { SignInParams, signIn } from "../lib/auth/client";

const initialFormData = {
  email: "",
  password: ""
}

const initialFormErrors = {
  "auth/wrong-password": false,
  "auth/user-not-found": false
}

export default function LoginScreen() {
  const router = useRouter();
  const { openLoader, closeLoader } = useLoader();
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  const modifyData = (key: string, value: string) => setFormData({
    ...formData, ...{ [key]: value }
  });
  const enableFormError = (key: string) => setFormErrors({
    ...formErrors, ... { [key]: true}
  });
  const resetFormErrors = () => setFormErrors(initialFormErrors);

  const handleLogin = async () => {
    resetFormErrors();
    openLoader();
    const loginResponse = await signIn(formData as SignInParams);

    console.log(loginResponse);

    if (loginResponse.status == "success") {
      router.push("/dashboard");
    } else {
      if (loginResponse.error in initialFormErrors) {
        enableFormError(loginResponse.error)
      }
    }
    closeLoader();
  }

  return (
    <AppLayout center>
      <div className="card w-2/5 overflow-hidden">
        <div className="text-center bg-secondary p-5 mb-5">
          <span className="text-4xl text-white font-semibold tracking-tighter">Log In To TherapyDash</span>
        </div>
        {
          formErrors["auth/wrong-password"] && (
            <div className="w-full text-center px-5">
              <span className="text-tertiary mr-3">
                Sorry, You Have Entered The Wrong Email/ Password
              </span>
              <span className="text-secondary cursor-pointer" onClick={resetFormErrors}>
                Clear
              </span>

            </div>
          )
        }
        {
          formErrors["auth/user-not-found"] && (
            <div className="w-full text-center px-5">
              <span className="text-tertiary mr-3">
                Sorry, We Could Not Find Your Account, Join Below
              </span>
              <span className="text-secondary cursor-pointer" onClick={resetFormErrors}>
                Clear
              </span>

            </div>
          )
        }
        <form
          className="flex flex-col px-5 pb-10 pt-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            className="input mb-5"
            type="email"
            value={formData.email}
            onChange={
              (event: ChangeEvent) =>
                modifyData("email", (event.target as HTMLInputElement).value)
            }
            required
          />
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            placeholder="Password"
            className="input mb-5"
            type="password"
            value={formData.password}
            onChange={
              (event: ChangeEvent) =>
                modifyData("password", (event.target as HTMLInputElement).value)
            }
            required
          />
          <button className="mb-3 button disabled:opacity-50" type="submit">Log In</button>
          <div className="text-tertiary flex justify-center">
            New To TherapyDash?
            <Link href="/signup">
              <a className="text-secondary ml-2">Sign Up Here</a>
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

const getServerSideProps = getServerAuth({
  successUrl: "/dashboard",
  redirectOnSuccess: true,
  redirectOnError: false,
})

export { getServerSideProps };
