import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import Logo from "./Logo"
import NewTaskBtn from "./NewTaskBtn"
import ConfigureBoardBtns from "./ConfigureBoardBtns"
import { useEffect, useRef, useState } from "react"
import { CollumnType } from "../../helpers/boardTypes"
import TaskConfigureModal from "../Modals/TaskConfigureModal/TaskConfigureModal"

const Header = () => {
  const [isBoardButtonsShowing, setIsBoardButtonsShowing] = useState(false)
  const [isNewTaskModalShowing, setIsNewTaskModalShowing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const theme = useSelector((state: RootState) => state.theme.value)
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)
  const boardCollumns = useSelector((state: RootState) => state.rooms.collumns)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsBoardButtonsShowing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef])

  const isDisabled = () => {
    if (!activeBoard) return true

    if (activeBoard) {
      const activeBoardCollumns = boardCollumns.filter(
        (collumn: CollumnType) => collumn.boardId === activeBoard?.id,
      )
      if (!activeBoardCollumns[0]) return true
    }
    return false
  }

  return (
    <header className="flex">
      <Logo theme={theme} />
      <div
        className={`relative flex w-5/6 justify-between border-b-[1px] p-6 ${theme === "light" ? "border-[#e4ebfa]" : "border-[#ffffff22]"}`}
      >
        <h1 className={`text-left text-xl font-bold`}>{activeBoard?.name}</h1>
        <div className="flex gap-4">
          <NewTaskBtn
            theme={theme}
            disabled={isDisabled()}
            onClick={() => setIsNewTaskModalShowing(!isNewTaskModalShowing)}
          />
          {activeBoard && (
            <button
              onClick={() => setIsBoardButtonsShowing(!isBoardButtonsShowing)}
              className={`rounded-full p-2 transition-all ${theme === "light" ? "fill-[#3c424b] hover:bg-[#0000000a]" : "fill-white hover:bg-[#ffffff14]"}`}
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
          )}
        </div>
        <ConfigureBoardBtns
          ref={modalRef}
          theme={theme}
          isShowing={isBoardButtonsShowing}
          setIsShowing={(value) => setIsBoardButtonsShowing(value)}
        />
      </div>
      <TaskConfigureModal
        isShowing={isNewTaskModalShowing}
        setIsShowing={(value) => setIsNewTaskModalShowing(value)}
        isEdit={false}
      />
    </header>
  )
}

export default Header
