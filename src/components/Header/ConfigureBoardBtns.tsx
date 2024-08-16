import { forwardRef, useState } from "react"
import DeleteModal from "../Modals/DeleteModal"
import BoardConfigModal from "../Modals/BoardConfigureModal/BoardConfigModal"

type ConfigureBoardBtnsProps = {
  theme: string
  isShowing: boolean
  setIsShowing: (isShowing: boolean) => void
}

const ConfigureBoardBtns = forwardRef<HTMLDivElement, ConfigureBoardBtnsProps>(
  (props, ref) => {
    const [isDeleteShowing, setIsDeleteShowing] = useState(false)
    const [isEditShowing, setIsEditShowing] = useState(false)

    const handleEditClick = () => {
      setIsEditShowing(!isEditShowing)
      props.setIsShowing(false)
    }
    const handleDeleteClick = () => {
      setIsDeleteShowing(!isDeleteShowing)
      props.setIsShowing(false)
    }

    return (
      <>
        {props.isShowing && (
          <div
            ref={ref}
            className={`absolute bottom-0 right-0 mr-6 flex translate-y-full flex-col rounded-b-md py-2 ${props.theme === "light" ? "bg-white" : "bg-[#2b2c37]"}`}
          >
            <button
              onClick={handleEditClick}
              className={`w-full px-5 py-1 text-left text-[#828fa3] ${props.theme === "light" ? "hover:bg-[#0000000a]" : "hover:bg-[#ffffff14]"}`}
            >
              Edit Board
            </button>
            <button
              onClick={handleDeleteClick}
              className={`w-full px-5 py-1 text-left text-red-500 ${props.theme === "light" ? "hover:bg-[#0000000a]" : "hover:bg-[#ffffff14]"}`}
            >
              Delete Board
            </button>
          </div>
        )}
        <BoardConfigModal
          isShowing={isEditShowing}
          setIsShowing={(value) => setIsEditShowing(value)}
          theme={props.theme}
          isEdit={true}
        />
        <DeleteModal
          isShowing={isDeleteShowing}
          setIsShowing={(value) => setIsDeleteShowing(value)}
        />
      </>
    )
  },
)

export default ConfigureBoardBtns
