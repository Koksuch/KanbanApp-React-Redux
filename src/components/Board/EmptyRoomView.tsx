import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { CollumnType } from "../../helpers/boardTypes"
import BoardConfigModal from "../Modals/BoardConfigureModal/BoardConfigModal"

const EmptyRoomView = () => {
  const boardCollumns = useSelector((state: RootState) => state.rooms.collumns)
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)
  const theme = useSelector((state: RootState) => state.theme.value)

  const [isCreateShowing, setIsCreateShowing] = useState(false)
  const [isEditShowing, setIsEditShowing] = useState(false)

  if (activeBoard) {
    const activeBoardCollumns = boardCollumns.filter(
      (collumn: CollumnType) => collumn.boardId === activeBoard?.id,
    )
    if (activeBoardCollumns[0]) return
  }

  return (
    <div className="flex w-full items-center justify-center overflow-auto p-4">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-[#828fa3]">
          {activeBoard
            ? "This board is empty. Create a new column to get started."
            : "You don't have any boards yet. Create a new board to get started."}
        </h2>
        {activeBoard ? (
          <button
            className={`flex gap-1 rounded-full bg-[#635fc7] fill-white px-5 py-2 text-base font-bold text-white transition-all hover:bg-[#a8a4ff]`}
            onClick={() => setIsEditShowing(true)}
          >
            <svg
              width="24"
              height="24"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Add New Collumn
          </button>
        ) : (
          <button
            className={`flex gap-1 rounded-full bg-[#635fc7] fill-white px-5 py-2 text-base font-bold text-white transition-all hover:bg-[#a8a4ff]`}
            onClick={() => setIsCreateShowing(true)}
          >
            <svg
              width="24"
              height="24"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Add New Board
          </button>
        )}
        <BoardConfigModal
          isShowing={isCreateShowing}
          setIsShowing={(value) => setIsCreateShowing(value)}
          theme={theme}
          isEdit={false}
        />
        <BoardConfigModal
          isShowing={isEditShowing}
          setIsShowing={(value) => setIsEditShowing(value)}
          theme={theme}
          isEdit={true}
        />
      </div>
    </div>
  )
}

export default EmptyRoomView
