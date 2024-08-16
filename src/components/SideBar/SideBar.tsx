import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../redux/themeSlice"
import { RootState, AppDispatch } from "../../redux/store"
import ThemeToggle from "./ThemeToggle"
import BoardsList from "./BoardsList"
import NewBoardBtn from "./NewBoardBtn"
import { useState } from "react"
import BoardConfigModal from "../Modals/BoardConfigureModal/BoardConfigModal"

const SideBar = () => {
  const theme = useSelector((state: RootState) => state.theme.value)
  const boardsCount = useSelector(
    (state: RootState) => state.rooms.boards.length,
  )
  const dispatch: AppDispatch = useDispatch()
  const [isShowing, setIsShowing] = useState(false)

  return (
    <div
      className={`flex h-full w-full flex-col justify-between border-r-[1px] fill-[#828fa3] text-left text-[#828fa3] ${theme === "light" ? "border-[#e4ebfa]" : "border-[#ffffff22]"}`}
    >
      <div className="">
        <p className="mb-6 pl-6 font-bold uppercase">
          All Boards ({boardsCount})
        </p>
        <BoardsList theme={theme} />
        <NewBoardBtn theme={theme} onClick={() => setIsShowing(!isShowing)} />
      </div>
      <div>
        <ThemeToggle
          theme={theme}
          toggleTheme={() => dispatch(toggleTheme())}
        />
      </div>
      <BoardConfigModal
        theme={theme}
        isShowing={isShowing}
        setIsShowing={(value) => setIsShowing(value)}
        isEdit={false}
      />
    </div>
  )
}

export default SideBar
