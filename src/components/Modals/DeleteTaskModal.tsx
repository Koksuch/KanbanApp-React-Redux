import { useEffect, useRef } from "react"
import { deleteTask } from "../../redux/boardSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"

type DeleteTaskModalProps = {
  isShowing: boolean
  setIsShowing: (isShowing: boolean) => void
  taskId: string
}

const DeleteTaskModal = (props: DeleteTaskModalProps) => {
  const selectedTask = useSelector((state: RootState) =>
    state.rooms.tasks.find((task) => task.id === props.taskId),
  )
  const theme = useSelector((state: RootState) => state.theme.value)
  const dispatch: AppDispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        props.setIsShowing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, props])

  const handleDeleteClick = () => {
    if (!selectedTask) return

    dispatch(deleteTask({ id: selectedTask.id }))
    props.setIsShowing(false)
  }

  return (
    props.isShowing && (
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#00000099] ${theme === "light" ? "text-black" : "text-white"}`}
      >
        <div
          ref={ref}
          className={`flex w-1/4 flex-col gap-2 rounded-lg p-8 ${theme === "light" ? "bg-white" : "bg-[#2b2c37]"}`}
        >
          <h2 className="mb-5 text-xl font-bold text-red-500">
            Delete this Task?
          </h2>
          <p
            className={`mb-4 text-sm font-bold ${theme === "light" ? "text-[#00000099]" : "text-[#ffffffb3]"}`}
          >
            Are you sure you want to delete the "{selectedTask?.name}" task and
            its subtasks? This action cannot be reversed.
          </p>
          <div className="flex w-full gap-5">
            <button
              className={`w-full rounded-full bg-red-500 px-5 py-2 text-base font-bold text-white outline-none transition-all hover:border-[#635fc7] hover:bg-[#ff9898] focus:border-[#635fc7] focus:ring-4 focus:ring-[#635fc7]`}
              onClick={handleDeleteClick}
            >
              Delete
            </button>
            <button
              className={`w-full rounded-full px-5 py-2 text-base font-bold text-[#635fc7] outline-none transition-all hover:border-[#635fc7] hover:bg-[#d8d7f1] focus:border-[#635fc7] focus:ring-4 focus:ring-[#635fc7] ${theme === "light" ? "bg-[#f4f7fd] hover:bg-[#f4f7fd]" : "bg-white"}`}
              onClick={() => props.setIsShowing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default DeleteTaskModal
