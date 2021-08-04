// ! Next and React
import { useRouter } from "next/router";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

// ! Library
import getServerAuth from "../lib/auth/server";
import { useLoader } from "../lib/providers/loader";
import { db } from "../config/firebase.client";

// ! Components
import AppLayout from "../components/layouts/app";
import { signUp, SignUpParams } from "../lib/auth/client";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
  picture: "",
}

const initialFormValidations = {
  passwordsNoMatch: false,
  passwordTooShort: false,
  usernameExists: false
}

const initialFormErrors = {
  "auth/email-already-exists": false,
}

export default function SignUpScreen() {
  const router = useRouter();
  const { openLoader, closeLoader } = useLoader();
  const [formData, setFormData] = useState(initialFormData);
  const [formValidations, setFormValidations] = useState(initialFormValidations);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [fileData, setFileData] = useState<Blob | null>(null);

  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);

  const modifyData = (key: string, value: string) => setFormData({
    ...formData, ...{ [key]: value }
  });
  const toggleValidations = (validations: { [key: string]: boolean }) =>
    setFormValidations({ ...formValidations, ... validations });

  const enableFormError = (key: string) => setFormErrors({
    ...formErrors, ... { [key]: true }
  });
  const resetFormErrors = () => setFormErrors(initialFormErrors);

  const handleSignUp = async () => {
    resetFormErrors();
    openLoader();
    const signUpResponse = await signUp({...formData, ...{ fileData }} as SignUpParams);

    if (signUpResponse.status == "success") {
      router.push("/dashboard");
    } else {
      if (signUpResponse.error.code in initialFormErrors) {
        enableFormError(signUpResponse.error.code);
      }
    }
    closeLoader();
  }

  const checkUsernameExists = async () => {
    const usersRef = db().collection("users");
    const userQuery = usersRef.where("username", "==", formData.username);
    const queryResponse = await userQuery.get();

    toggleValidations({ usernameExists: !(queryResponse.empty) });
    setUsernameCheckLoading(false);
  }

  useEffect(() => {
    if (fileData) {
      URL.revokeObjectURL(formData.picture);
      modifyData("picture", URL.createObjectURL(fileData));
    } else {
      modifyData("picture", "");
    }
  }, [fileData]);

  useEffect(() => {
    let validations: {[key: string]: boolean } = {}
    if (formData.password != "") {
      validations.passwordTooShort = formData.password.length < 6;
    } else {
      validations.passwordTooShort = false;
    }

    if (formData.password != "" && formData.repeatPassword != "") {
      validations.passwordsNoMatch = !(formData.password == formData.repeatPassword)
    } else {
      validations.passwordsNoMatch = false;
    }

    toggleValidations(validations);
  }, [formData.password, formData.repeatPassword]);

  useEffect(() => {
    if (usernameCheckLoading) checkUsernameExists();
  }, [usernameCheckLoading])

  return (
    <AppLayout center>
      <div className="card w-2/5 overflow-hidden">
        <div className="text-center bg-secondary px-3 py-5 mb-5">
          <h1 className="text-4xl text-white tracking-tighter font-semibold">Sign Up To TherapyDash</h1>
        </div>
        {
          formErrors["auth/email-already-exists"] && (
            <div className="w-full text-center px-5">
              <span className="text-tertiary mr-3">
                Sorry, Seems Like You Already Have An Account, Login Below
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
            handleSignUp();
          }}
        >
          <div className="flex flex-col space-y-2 items-center w-full mb-5">
            <h2 className="text-tertiary">User Information</h2>
            <div className="flex items-center">
              <div className="rounded-full w-16 h-16 flex flex-col items-center  overflow-hidden object-cover justify-center bg-secondary mr-2 relative">
                {
                  formData.picture ? (
                    <img className="absolute w-full h-full rounded-full" src={formData.picture}/>
                  ) : (
                    <span className="text-white">Image</span>
                  )
                }
              </div>
              <label htmlFor="picture" className="cursor-pointer button flex items-center justify-center">
                Choose Image
                <input
                  id="picture"
                  name="picture"
                  type="file"
                  className="sr-only"
                  onChange={(event: ChangeEvent) => {
                    const files = (event.target as HTMLInputElement).files;
                    if (files) setFileData(files[0]);
                  }}
                  required
                />
              </label>
            </div>
            <label htmlFor="email" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Username"
              className="input w-full"
              type="text"
              onBlur={() => setUsernameCheckLoading(true)}
              value={formData.username}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("username", (event.target as HTMLInputElement).value)
              }
              required
            />
            {
              (formValidations.usernameExists && !usernameCheckLoading) && (
                <span className="text-tertiary text-xs">Username is Already Taken</span>
              )
            }
            {
              usernameCheckLoading && (
                <span className="text-secondary text-xs">
                  Checking Username Availability...
                </span>
              )
            }
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              placeholder="Email"
              className="input w-full"
              type="email"
              value={formData.email}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("email", (event.target as HTMLInputElement).value)
              }
              required
            />
          </div>
          <div className="flex flex-col space-y-2 items-center w-full mb-5">
            <h2 className="text-tertiary">Password Information</h2>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              placeholder="Password"
              className="input w-full"
              type="password"
              value={formData.password}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("password", (event.target as HTMLInputElement).value)
              }
              required
            />
            {
              formValidations.passwordTooShort && (
                <span className="text-tertiary text-xs">Password Is Too Short</span>
              )
            }
            <label htmlFor="repeatPassword" className="sr-only">Repeat Password</label>
            <input
              id="repeatPassword"
              name="repeatPassword"
              placeholder="Repeat Password"
              className="input w-full"
              type="password"
              value={formData.repeatPassword}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("repeatPassword", (event.target as HTMLInputElement).value)
              }
              required
            />
            {
              formValidations.passwordsNoMatch && (
                <span className="text-tertiary text-xs">Passwords Do Not Match</span>
              )
            }
          </div>
          <button
            className="mb-3 button disabled:opacity-50"
            disabled={Object.values(formValidations).includes(true)}
            type="submit"
          >
            Sign Up
          </button>
          <div className="text-tertiary flex justify-center">
            Already Have An Account?
            <Link href="/">
              <a className="text-secondary ml-2">Login In Here</a>
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
