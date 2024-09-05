import Collumn from "./Collumn"
import NewCollumn from "./NewCollumn"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import { CollumnType, TaskType } from "../../helpers/boardTypes"
import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { SortableItem } from "./SortableItem"
import {
  editCollumnsOrder,
  editTasksOrder,
  moveTask,
} from "../../redux/boardSlice"

const LoadedRoomView = () => {
  const boardCollumns = useSelector((state: RootState) => state.rooms.collumns)
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)
  const allTasks = useSelector((state: RootState) => state.rooms.tasks)
  const dispatch: AppDispatch = useDispatch()

  const [collumns, setCollumns] = useState<CollumnType[]>([])
  const [currentTasks, setCurrentTasks] = useState<{
    [key: string]: TaskType[]
  }>({})

  useEffect(() => {
    if (activeBoard) {
      const activeBoardCollumns = boardCollumns.filter(
        (collumn: CollumnType) => collumn.boardId === activeBoard?.id,
      )

      setCollumns([...activeBoardCollumns])

      const tasksByColumn: { [key: string]: TaskType[] } = {}
      activeBoardCollumns.forEach((collumn) => {
        tasksByColumn[collumn.id] = allTasks.filter(
          (task) => task.collumnId === collumn.id,
        )
      })
      setCurrentTasks({ ...tasksByColumn })
    }
  }, [activeBoard, boardCollumns, allTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      if (active.data.current?.type !== "task") {
        setCollumns((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)
          const newArray = arrayMove(items, oldIndex, newIndex)
          dispatch(
            editCollumnsOrder({
              collumns: [...newArray],
            }),
          )
          return newArray
        })
      }
    }

    if (active.data.current?.type === "task") {
      const collumnId = active.data.current.collumnId

      if (active.id !== over.id) {
        setCurrentTasks((prev) => {
          const tasksInColumn = prev[collumnId]
          const oldIndex = tasksInColumn.findIndex(
            (item) => item.id === active.id,
          )
          const newIndex = tasksInColumn.findIndex(
            (item) => item.id === over.id,
          )
          const newArray = arrayMove(tasksInColumn, oldIndex, newIndex)
          dispatch(
            editTasksOrder({
              tasks: newArray,
            }),
          )
          return {
            ...prev,
            [collumnId]: newArray,
          }
        })
      }
    }
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.data.current?.type === "task") {
      const { task, collumnId } = active.data.current
      const toCollumnId = over.data.current?.collumnId || over.id.toString()
      if (toCollumnId && collumnId !== toCollumnId) {
        dispatch(
          moveTask({
            taskId: task.id,
            fromCollumnId: collumnId,
            toCollumnId,
          }),
        )
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <SortableContext
        items={collumns}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-8 overflow-x-auto p-5">
          {collumns.map((collumn) => (
            <SortableItem
              key={collumn.id}
              id={collumn.id}
              data={{ type: "collumn", collumn, collumnId: collumn.id }}
            >
              <Collumn collumn={collumn} tasks={currentTasks[collumn.id]} />
            </SortableItem>
          ))}
          {collumns.length > 0 && <NewCollumn />}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default LoadedRoomView
