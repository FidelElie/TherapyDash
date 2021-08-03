// ! Next and React
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

// ! Library
import getServerAuth from "../lib/auth/server";

// ! Components
import AppLayout from "../components/layouts/app";
import { SignInParams, signIn } from "../lib/auth/client";

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const modifyData = (key: string, value: string) => setFormData({
    ...formData, ...{
      [key]: value
    }
  });

  const handleLogin = async () => {
    const loginResponse = await signIn(formData as SignInParams);

    console.log(loginResponse);

    if (loginResponse.status == "success") {
      router.push("/dashboard");
    }
  }

  return (
    <AppLayout>
      <div className="card w-1/3 px-5 py-8 ">
        <div className="mb-8 text-center">
          <span className="text-4xl text-secondary tracking-tighter">Log In To TherapyDash</span>
        </div>
        <form
          className="space-y-3 flex flex-col"
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
            className="input"
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
            className="input"
            type="password"
            value={formData.password}
            onChange={
              (event: ChangeEvent) =>
                modifyData("password", (event.target as HTMLInputElement).value)
            }
            required
          />
          <button className="button disabled:opacity-50" type="submit">Log In</button>
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
