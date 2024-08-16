import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../redux/store"
import {
  CollumnType,
  SubtaskType as GlobalST,
  TaskType,
} from "../../../helpers/boardTypes"
import SubTaskInput from "./SubtaskInput"
import { toast } from "react-toastify"
import {
  addSubtask,
  addTask,
  deleteSubtask,
  editSubtask,
  editTask,
  editTaskStatus,
} from "../../../redux/boardSlice"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { nanoid } from "@reduxjs/toolkit"

type TaskConfigureModalProps = {
  isShowing: boolean
  setIsShowing: (isShowing: boolean) => void
  isEdit: boolean
  taskId?: string
}

type SubtaskType = {
  id?: string
  name: string
  taskId?: string
  isCompleted?: boolean
}

const TaskConfigureModal = (props: TaskConfigureModalProps) => {
  const theme = useSelector((state: RootState) => state.theme.value)
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)
  const allCollumns = useSelector((state: RootState) => state.rooms.collumns)
  const allTasks = useSelector((state: RootState) => state.rooms.tasks)
  const allSubTasks = useSelector((state: RootState) => state.rooms.subtasks)

  const dispatch: AppDispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null)

  const [collumns, setCollumns] = useState<CollumnType[]>([])
  const [currentTask, setCurrentTask] = useState<TaskType>({} as TaskType)
  const [subTasks, setSubTasks] = useState<SubtaskType[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCollumn, setSelectedCollumn] = useState<CollumnType>(
    {} as CollumnType,
  )
  const [isValidationError, setIsValidationError] = useState(false)

  useEffect(() => {
    if (activeBoard) {
      const boardCollumns = allCollumns.filter(
        (collumn: CollumnType) => collumn.boardId === activeBoard.id,
      )
      setCollumns([...boardCollumns])
      setSelectedCollumn({ ...boardCollumns[0] })
    }
  }, [activeBoard, allCollumns])

  useEffect(() => {
    if (props.isEdit) {
      if (activeBoard) {
        if (props.taskId) {
          const task = allTasks.find((task) => task.id === props.taskId)
          if (!task) return

          setCurrentTask(task)
          setDescription(task.description)
          setTitle(task.name)

          const taskSubTasks = allSubTasks.filter(
            (subtask: GlobalST) => subtask.taskId === props.taskId,
          )
          setSubTasks([...taskSubTasks])

          const selectedCollumn = collumns.find(
            (collumn) => collumn.id === task.collumnId,
          )
          if (!selectedCollumn) return

          setSelectedCollumn({ ...selectedCollumn })
        }
      }
    }
  }, [
    props.isEdit,
    activeBoard,
    allSubTasks,
    props.isShowing,
    props.taskId,
    allTasks,
    collumns,
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".p-dropdown-items")
      ) {
        props.setIsShowing(false)
        setSubTasks([])
        setTitle("")
        setDescription("")
        setIsValidationError(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, props])

  const addSubTask = () => {
    setSubTasks([...subTasks, { name: "" }])
  }

  const removeSubTask = (index: number) => {
    const newSubtasks = subTasks.filter((_, i) => i !== index)
    setSubTasks([...newSubtasks])
  }

  const updateSubTask = (index: number, key: string, value: string) => {
    const newSubtasks = subTasks.map((subTask, i) => {
      if (i === index) {
        return { ...subTask, [key]: value }
      }
      return subTask
    })
    setSubTasks([...newSubtasks])
  }

  const checkValidation = () => {
    let isValid = true
    if (!title) {
      setIsValidationError(true)
      isValid = false
    }
    subTasks.forEach((subTask) => {
      if (!subTask.name) {
        setIsValidationError(true)
        isValid = false
      }
    })
    return isValid
  }

  const createNewTask = () => {
    if (!checkValidation()) return

    setIsValidationError(false)

    const taskId = nanoid()

    dispatch(
      addTask({
        id: taskId,
        name: title,
        description: description,
        collumnId: selectedCollumn.id,
        collumnName: selectedCollumn.name,
      }),
    )

    subTasks.forEach((subTask) => {
      dispatch(addSubtask({ name: subTask.name, taskId: taskId }))
    })

    toast.success("New task created successfully")
    props.setIsShowing(false)
    setSubTasks([])
    setTitle("")
    setDescription("")
  }

  const updateTask = () => {
    if (!checkValidation()) return
    setIsValidationError(false)

    if (props.isEdit) {
      if (activeBoard) {
        if (currentTask.id) {
          const currentTaskSubTasks = allSubTasks.filter(
            (subtask: GlobalST) => subtask.taskId === currentTask.id,
          )
          const subTasksToDelete = currentTaskSubTasks.filter(
            (subtask) => !subTasks.some((sub) => subtask.id === sub.id),
          )
          const subTasksToAdd = subTasks.filter(
            (subtask) =>
              !currentTaskSubTasks.some((sub) => subtask.id === sub.id),
          )
          if (selectedCollumn.id !== currentTask.collumnId) {
            dispatch(
              editTaskStatus({
                id: currentTask.id,
                collumnId: selectedCollumn.id,
              }),
            )
          }

          dispatch(
            editTask({
              id: currentTask.id,
              name: title,
              description: description,
            }),
          )
          subTasksToAdd.forEach((sub) =>
            dispatch(addSubtask({ name: sub.name, taskId: currentTask.id })),
          )
          subTasksToDelete.forEach((sub) =>
            dispatch(deleteSubtask({ id: sub.id })),
          )
          subTasks.forEach((subtask) => {
            if (subtask.id) {
              dispatch(
                editSubtask({
                  id: subtask.id,
                  name: subtask.name,
                }),
              )
            }
          })

          toast.success("Task updated successfully")
        }
      }
    }

    props.setIsShowing(false)
    setSubTasks([])
    setTitle("")
    setDescription("")
  }

  const handleDropdownChange = (e: DropdownChangeEvent) => {
    const selectedCollumn = collumns.find(
      (collumn) => collumn.id === e.value.id,
    )
    if (!selectedCollumn) return

    setSelectedCollumn({ ...selectedCollumn })
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
          <h2 className="mb-5 text-xl font-bold">
            {props.isEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold" htmlFor="title">
              Title
            </label>
            <input
              className={`mb-5 rounded-md border border-[#828fa3] p-2 outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7] ${theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
              id="title"
              type="text"
              placeholder="e.g. Stop being lazy"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="description">
              Description
            </label>
            <textarea
              className={`w-full rounded-md border border-[#828fa3] p-2 outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7] ${theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
              id="description"
              placeholder="e.g. It's always good to take a break. I'll be back in 5 minutes."
              rows={5}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
            />
          </div>
          <div>
            {subTasks[0] && (
              <h3 className="mb-2 text-sm font-bold">SubTasks</h3>
            )}
            {subTasks?.map((subTask, index) => (
              <div className="mb-3 flex w-full gap-2" key={index}>
                <SubTaskInput
                  subTask={subTask}
                  subTaskIndex={index}
                  theme={theme}
                  updateSubtask={updateSubTask}
                  removeSubtask={removeSubTask}
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-4">
            {isValidationError && (
              <p className="text-center font-bold text-red-500">
                All fields are required
              </p>
            )}
            <button
              className={`flex justify-center gap-1 rounded-full fill-[#635fc7] px-5 py-2 text-base font-bold text-[#635fc7] outline-none transition-all hover:border-[#635fc7] hover:bg-[#d8d7f1] focus:border-[#635fc7] focus:ring-2 focus:ring-[#635fc7] ${theme === "light" ? "bg-[#f4f7fd] hover:bg-[#f4f7fd]" : "bg-white"}`}
              onClick={addSubTask}
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
              Add New Subtask
            </button>
            <div>
              <p className="text-sm font-bold">Status</p>
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
            {props.isEdit ? (
              <button
                className={`rounded-full bg-[#635fc7] fill-white py-2 font-bold text-white outline-none transition-all hover:border-[#a8a4ff] hover:bg-[#a8a4ff] focus:border-[#a8a4ff] focus:ring-2 focus:ring-[#a8a4ff]`}
                onClick={updateTask}
              >
                Save Changes
              </button>
            ) : (
              <button
                className={`rounded-full bg-[#635fc7] fill-white py-2 font-bold text-white outline-none transition-all hover:border-[#a8a4ff] hover:bg-[#a8a4ff] focus:border-[#a8a4ff] focus:ring-2 focus:ring-[#a8a4ff]`}
                onClick={createNewTask}
              >
                Create Task
              </button>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default TaskConfigureModal
