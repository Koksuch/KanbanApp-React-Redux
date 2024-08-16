import { useSelector } from "react-redux"
import { SubtaskType, TaskType } from "../../helpers/boardTypes"
import { RootState } from "../../redux/store"
import { useEffect, useState } from "react"

type TaskProps = {
  task: TaskType
  isShowing?: boolean
  setIsShowing?: (isShowing: boolean) => void
  getTask?: (taskId: string) => void
}

const Task = (props: TaskProps) => {
  const theme = useSelector((state: RootState) => state.theme.value)
  const subtasks = useSelector((state: RootState) => state.rooms.subtasks)

  const [taskSubtasks, setTaskSubtasks] = useState<SubtaskType[]>([])
  const [completedSubtasks, setCompletedSubtasks] = useState<SubtaskType[]>([])

  useEffect(() => {
    const taskSubtasks = subtasks.filter(
      (subtask) => subtask.taskId === props.task.id,
    )
    setTaskSubtasks([...taskSubtasks])

    const completedSubtasks = taskSubtasks.filter(
      (subtask) => subtask.isCompleted,
    )
    setCompletedSubtasks([...completedSubtasks])
  }, [subtasks, props.task.id])

  const handleClick = () => {
    if (!props.setIsShowing) return
    if (!props.getTask) return
    props.setIsShowing(true)
    props.getTask(props.task.id)
  }

  return (
    <div className="mb-7">
      <button
        className={`flex h-20 w-full cursor-grab flex-col rounded-md p-4 text-left hover:text-[#a8a4ff] hover:transition-all ${theme === "light" ? "bg-white" : "bg-[#2b2c37]"}`}
        onClick={handleClick}
      >
        <h2 className="rounded-full text-lg font-bold">{props.task.name}</h2>
        <p className="text-sm font-semibold tracking-tight text-[#828fa3]">
          {completedSubtasks.length} of {taskSubtasks.length} subtasks
        </p>
      </button>
    </div>
  )
}

export default Task
