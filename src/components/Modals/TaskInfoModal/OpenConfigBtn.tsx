import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import ConfigureTaskBtns from "./ConfigureTaskBtns"
import { useEffect, useRef, useState } from "react"

type OpenConfigBtnProps = {
  taskId: string
}

const OpenConfigBtn = (props: OpenConfigBtnProps) => {
  const theme = useSelector((state: RootState) => state.theme.value)

  const [isShowing, setIsShowing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsShowing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef])

  return (
    <div className="relative">
      <button
        className={`rounded-full p-2 transition-all ${theme === "light" ? "fill-[#3c424b] hover:bg-[#0000000a]" : "fill-white hover:bg-[#ffffff14]"}`}
        onClick={() => setIsShowing(!isShowing)}
      >
        <svg
          width="24"
          height="24"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
        </svg>
      </button>
      <ConfigureTaskBtns
        ref={modalRef}
        isShowing={isShowing}
        setIsShowing={(val) => setIsShowing(val)}
        taskId={props.taskId}
      />
    </div>
  )
}

export default OpenConfigBtn
