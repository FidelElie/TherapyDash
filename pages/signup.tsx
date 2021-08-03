// ! Next and React
import { useRouter } from "next/router";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

// ! Library
import getServerAuth from "../lib/auth/server";

// ! Components
import AppLayout from "../components/layouts/app";
import { signUp, SignUpParams } from "../lib/auth/client";

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    picture: "",
  });
  const [formValidations, setFormValidations] = useState({
    passwordsNoMatch: false
  })
  const [fileData, setFileData] = useState<Blob | null>(null);

  const modifyData = (key: string, value: string) => setFormData({
    ...formData, ...{ [key]: value }
  });

  const toggleValidation = (key: string, value: boolean) => setFormValidations({
    ...formValidations, ... { [key]: value }
  })

  const handleSignUp = async () => {
    const signUpResponse = await signUp({...formData, ...{ fileData }} as SignUpParams);

    if (signUpResponse.status == "success") {
      router.push("/dashboard");
    }
  }

  useEffect(() => {
    if (fileData) {
      URL.revokeObjectURL(formData.picture);
      modifyData("picture", URL.createObjectURL(fileData));
    } else {
      modifyData("picture", "");
    }
  }, [fileData]);

  // FIXME fix this shit

  useEffect(() => {
    if (formData.password != "" && formData.repeatPassword != "") {
      toggleValidation(
        "passwordsNoMatch", !(formData.password == formData.repeatPassword)
      );
    } else {
      toggleValidation("passwordsNoMatch", false);
    }
  }, [formData.password, formData.repeatPassword])

  return (
    <AppLayout>
      <div className="card w-1/3 px-5 py-8 ">
        <div className="mb-8 text-center">
          <h1 className="text-4xl text-secondary tracking-tighter">Sign Up To TherapyDash</h1>
        </div>
        <form
          className="space-y-3 flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            handleSignUp();
          }}
        >
          <div className="flex flex-col space-y-1 items-center w-full">
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
              className="input"
              type="text"
              value={formData.username}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("username", (event.target as HTMLInputElement).value)
              }
              required
            />
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              placeholder="Email"
              className="input"
              type="email"
              value={formData.email}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("email", (event.target as HTMLInputElement).value)
              }
              required
            />
          </div>
          <div className="flex flex-col space-y-1 items-center w-full">
            <h2 className="text-tertiary">Password Information</h2>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              placeholder="Password"
              className="input"
              type="password"
              value={formData.password}
              onChange={
                (event: ChangeEvent) =>
                  modifyData("password", (event.target as HTMLInputElement).value)
              }
              required
            />
            <label htmlFor="repeatPassword" className="sr-only">Repeat Password</label>
            <input
              id="repeatPassword"
              name="repeatPassword"
              placeholder="Repeat Password"
              className="input"
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
                <span className="">Passwords Do Not Match</span>
              )
            }
          </div>
          <button className="button disabled:opacity-50" type="submit">Sign Up</button>
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
