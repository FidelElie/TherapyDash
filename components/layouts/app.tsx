// ! Next and React
import Head from "next/head";
import { ReactNode } from "react";

type appLayoutProps = {
  title?: string,
  center?: boolean,
  children: ReactNode
}

export default function AppLayout(props: appLayoutProps) {
  const { title, center, children } = props;
  return (
    <div className="relative z-0">
      <Head>
        <title>{ title ? title : "TherapyDash"}</title>
      </Head>
      <img src="https://firebasestorage.googleapis.com/v0/b/therapydash---development.appspot.com/o/website%2Fbackground.png?alt=media&token=4d0496f3-1d67-48ff-b500-82e265aca5f0" className="absolute top-0 left-0 w-full z-0 h-full"/>
      <div className="w-screen h-screen relative z-0">
        <div className={`container mx-auto min-h-full flex justify-center z-10 max-w-6xl ${center ? "items-center": ""}`}>
          { children }
        </div>
      </div>
    </div>
  )
}
