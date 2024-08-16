import { forwardRef, useEffect, useState } from "react"
import TaskConfigureModal from "../TaskConfigureModal/TaskConfigureModal"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import DeleteTaskModal from "../DeleteTaskModal"

type ConfigureTaskBtnsProps = {
  isShowing: boolean
  setIsShowing: (isShowing: boolean) => void
  taskId: string
}

const ConfigureTaskBtns = forwardRef<HTMLDivElement, ConfigureTaskBtnsProps>(
  (props, ref) => {
    const theme = useSelector((state: RootState) => state.theme.value)

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

    useEffect(() => {
      if (isDeleteShowing) {
        props.setIsShowing(false)
      }
      if (isEditShowing) {
        props.setIsShowing(false)
      }
    }, [isDeleteShowing, isEditShowing, props])

    return (
      <>
        {props.isShowing && (
          <div
            ref={ref}
            className={`absolute flex w-max flex-col rounded-md py-2 ${theme === "light" ? "bg-white shadow-lg" : "bg-[#20212c]"}`}
          >
            <button
              onClick={handleEditClick}
              className={`w-full px-5 py-1 text-left text-[#828fa3] ${theme === "light" ? "hover:bg-[#0000000a]" : "hover:bg-[#ffffff14]"}`}
            >
              Edit Task
            </button>
            <button
              onClick={handleDeleteClick}
              className={`w-full px-5 py-1 text-left text-red-500 ${theme === "light" ? "hover:bg-[#0000000a]" : "hover:bg-[#ffffff14]"}`}
            >
              Delete Task
            </button>
          </div>
        )}
        <TaskConfigureModal
          isShowing={isEditShowing}
          setIsShowing={(value) => setIsEditShowing(value)}
          isEdit={true}
          taskId={props.taskId}
        />
        <DeleteTaskModal
          isShowing={isDeleteShowing}
          setIsShowing={(value) => setIsDeleteShowing(value)}
          taskId={props.taskId}
        />
      </>
    )
  },
)
export default ConfigureTaskBtns
