import { useEffect, useRef, useState } from "react"
import { CollumnType, TaskType } from "../../helpers/boardTypes"
import Task from "./Task"
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { DraggableAttributes } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableTask } from "./SortableTask"
import TaskInfoModal from "../Modals/TaskInfoModal/TaskInfoModal"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

type CollumnProps = {
  collumn: CollumnType
  tasks: TaskType[]
  dragHandleProps?: SyntheticListenerMap
  attributes?: DraggableAttributes
}

const Collumn = (props: CollumnProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const allTasks = useSelector((state: RootState) => state.rooms.tasks)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<TaskType>({} as TaskType)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.backgroundColor = props.collumn.color
    }
  }, [props.collumn.color])

  useEffect(() => {
    if (activeTask.id) {
      const task = allTasks.find((t) => t.id === activeTask.id)
      if (!task) {
        setIsModalOpen(false)
      }
    }
  }, [activeTask, allTasks])

  return (
    <div className="flex w-72 shrink-0 grow-0 basis-72 flex-col">
      <div className="mb-3 flex h-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <div ref={ref} className={`h-4 w-4 rounded-full`}></div>
          <h3 className="font-bold tracking-widest text-[#828fa3]">
            {props.collumn.name} ({props.tasks.length})
          </h3>
        </div>
        <div className="cursor-grab fill-[#635fc7]" {...props.dragHandleProps}>
          <svg
            width="24"
            height="24"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </div>
      </div>
      <SortableContext
        items={props.tasks}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex h-full w-full flex-col rounded-md">
          {props.tasks.length > 0 ? (
            props.tasks.map((task) => (
              <div key={task.id}>
                <SortableTask
                  key={task.id}
                  id={task.id}
                  data={{ type: "task", task, collumnId: props.collumn.id }}
                >
                  <Task
                    key={task.id}
                    task={task}
                    isShowing={isModalOpen}
                    setIsShowing={setIsModalOpen}
                    getTask={(taskId) =>
                      setActiveTask(
                        props.tasks.find((t) => t.id === taskId) as TaskType,
                      )
                    }
                  />
                </SortableTask>
              </div>
            ))
          ) : (
            <SortableTask
              id="empty-task"
              data={{ type: "empty-task", collumnId: props.collumn.id }}
            >
              <div className="h-20 w-full"></div>
            </SortableTask>
          )}
        </div>
      </SortableContext>
      {isModalOpen && (
        <TaskInfoModal
          task={{ ...activeTask } as TaskType}
          isShowing={isModalOpen}
          setIsShowing={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default Collumn
