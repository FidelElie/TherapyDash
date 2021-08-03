// ! Next and React
import React, { createContext, useContext, useState, ReactNode } from "react";

type loaderType = {
  openLoader: Function,
  closeLoader: Function
}

const LoaderContent = createContext<loaderType>({
  openLoader: () => {},
  closeLoader: () => {}
});

const LoaderProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [loaderOpen, setLoaderOpen] = useState(false);

  return (
    <LoaderContent.Provider value={{
      openLoader: () => setLoaderOpen(true),
      closeLoader: () => setLoaderOpen(false)
    }}>
      {
        loaderOpen && (
          <div className="fixed w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
            <span className="text-white text-xl">Loading... Please Wait</span>
          </div>
        )
      }
      { children }
    </LoaderContent.Provider>
  )
}

const useLoader = () => useContext(LoaderContent);

export default LoaderProvider;
export { useLoader };
