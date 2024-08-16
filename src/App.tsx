// import { useState } from "react"
import SideBar from "./components/SideBar/SideBar"
import Header from "./components/Header/Header"
import Room from "./components/Board/Room"
import { RootState } from "./redux/store"
import { useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"

function App() {
  const theme = useSelector((state: RootState) => state.theme.value)

  return (
    <>
      <ToastContainer position="bottom-right" theme={theme} draggable />
      <div
        className={`flex h-screen w-full flex-col text-white ${theme === "light" ? "text-black; bg-white" : "bg-[#2b2c37] text-white"}`}
      >
        <div className="w-full">
          <Header />
        </div>
        <div className={`flex h-full w-full`}>
          <div className="w-1/6">
            <SideBar />
          </div>
          <div
            className={`flex w-5/6 ${theme === "light" ? "bg-[#f4f7fd] text-black" : "bg-[#20212c] text-white"}`}
          >
            <Room />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
