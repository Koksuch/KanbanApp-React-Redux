import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../redux/store"
import { CollumnType, SubtaskType, TaskType } from "../../../helpers/boardTypes"
import { useEffect, useRef, useState } from "react"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { editTaskStatus, toggleSubtask } from "../../../redux/boardSlice"
import OpenConfigBtn from "./OpenConfigBtn"

type TaskInfoModalProps = {
  task: TaskType
  isShowing: boolean
  setIsShowing: (isShowing: boolean) => void
}

const TaskInfoModal = (props: TaskInfoModalProps) => {
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)
  const allCollumns = useSelector((state: RootState) => state.rooms.collumns)
  const allSubTasks = useSelector((state: RootState) => state.rooms.subtasks)
  const theme = useSelector((state: RootState) => state.theme.value)
  const dispatch: AppDispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null)

  const [collumns, setCollumns] = useState<CollumnType[]>([])
  const [subtasks, setSubtasks] = useState<SubtaskType[]>([])
  const [completedSubtasks, setCompletedSubtasks] = useState<SubtaskType[]>([])
  const [selectedCollumn, setSelectedCollumn] = useState<CollumnType>(
    {} as CollumnType,
  )

  useEffect(() => {
    if (activeBoard) {
      const boardCollumns = allCollumns.filter(
        (collumn: CollumnType) => collumn.boardId === activeBoard.id,
      )
      setCollumns([...boardCollumns])
      const selectedCollumn = boardCollumns.find(
        (collumn) => collumn.id === props.task.collumnId,
      )
      if (!selectedCollumn) return

      setSelectedCollumn({ ...selectedCollumn })
    }
  }, [activeBoard, allCollumns, props.task.collumnId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".p-dropdown-items")
      ) {
        props.setIsShowing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, props])

  useEffect(() => {
    const taskSubTasks = allSubTasks.filter(
      (subTask: SubtaskType) => subTask.taskId === props.task.id,
    )
    if (taskSubTasks.length === 0) return

    setSubtasks([...taskSubTasks])

    const completedSubTasks = taskSubTasks.filter(
      (subTask: SubtaskType) => subTask.isCompleted,
    )
    setCompletedSubtasks([...completedSubTasks])
  }, [allSubTasks, props.task.id])

  const handleCheckbox = (subTaskId: string, isCompleted: boolean) => {
    dispatch(toggleSubtask({ id: subTaskId, isCompleted: !isCompleted }))
  }

  const handleDropdownChange = (e: DropdownChangeEvent) => {
    const selectedCollumn = collumns.find(
      (collumn) => collumn.id === e.value.id,
    )
    if (!selectedCollumn) return

    setSelectedCollumn({ ...selectedCollumn })

    dispatch(
      editTaskStatus({
        id: props.task.id,
        collumnId: selectedCollumn.id,
      }),
    )
  }

  const dropdownItemTemplate = (option: CollumnType) => {
    const isActive = selectedCollumn.id === option.id
    const isFirst = option.id === collumns[0].id
    const isLast = option.id === collumns[collumns.length - 1].id

    return (
      <div
        className={`flex items-center gap-2 p-3 ${isFirst ? "rounded-t-md" : ""} ${isLast ? "rounded-b-md" : ""} ${theme === "light" ? "hover:bg-[#0000000a] focus:bg-[#0000000a] " + (isActive ? "bg-[#635fc712]" : "") : "hover:bg-[#ffffff14] focus:bg-[#ffffff14] " + (isActive ? "bg-[#635fc729]" : "")}`}
      >
        <div
          className={`h-4 w-4 rounded-full`}
          style={{ backgroundColor: option.color }}
        ></div>
        <span>{option.name}</span>
      </div>
    )
  }

  return (
    props.isShowing && (
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#00000099] ${theme === "light" ? "text-black" : "text-white"}`}
      >
        <div
          ref={ref}
          className={`flex w-1/3 flex-col gap-2 rounded-lg p-8 ${theme === "light" ? "bg-white" : "bg-[#2b2c37]"}`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{props.task.name}</h2>
            <OpenConfigBtn taskId={props.task.id} />
          </div>
          <div className="my-4 text-sm text-[#828fa3]">
            {props.task.description && <p>{props.task.description}</p>}
          </div>
          <div>
            <h2 className="text-base font-bold">
              Subtasks ({completedSubtasks.length} of {subtasks.length})
            </h2>
            <div className="mt-3 flex w-full flex-col gap-2">
              {subtasks.map((subtask) => (
                <label
                  key={subtask.id}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded p-2 pl-4 text-sm font-bold transition-all ${theme === "light" ? "bg-[#f4f7fd] hover:bg-[#635fc720]" : "bg-[#20212c] hover:bg-[#635fc720]"}`}
                >
                  <input
                    type="checkbox"
                    className={`my-2 outline-none focus:ring-1 focus:ring-[#635fc7] ${theme === "light" ? "accent-[#f4f7fd] hover:accent-[#635fc720]" : "accent-[#20212c] hover:accent-[#635fc720]"}`}
                    checked={subtask.isCompleted}
                    onChange={() =>
                      handleCheckbox(subtask.id, subtask.isCompleted)
                    }
                  />
                  <p
                    className={` ${subtask.isCompleted ? "text-[#828fa3] line-through" : ""}`}
                  >
                    {subtask.name}
                  </p>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <h2 className="mb-2 text-base font-bold">Status</h2>
            <div>
              <Dropdown
                className={`mb-2 w-full rounded-md border border-[#828fa3] p-2 outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-2 focus:ring-[#635fc7] ${theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
                panelClassName={`rounded-md py-1 ${theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
                value={selectedCollumn}
                options={collumns}
                optionLabel="name"
                optionValue="id"
                itemTemplate={dropdownItemTemplate}
                onChange={handleDropdownChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default TaskInfoModal
