import { createSlice, nanoid } from "@reduxjs/toolkit"
import {
  BoardType,
  CollumnType,
  SubtaskType,
  TaskType,
} from "../helpers/boardTypes"
import { toast } from "react-toastify"
import {
  boardsData,
  collumnsData,
  subtasksData,
  tasksData,
} from "./initialData"

const boardsFromLocalStorage = localStorage.getItem("boards")
const collumnsFromLocalStorage = localStorage.getItem("collumns")
const tasksFromLocalStorage = localStorage.getItem("tasks")
const subtasksFromLocalStorage = localStorage.getItem("subtasks")

export type RoomsStateType = {
  boards: BoardType[]
  collumns: CollumnType[]
  tasks: TaskType[]
  subtasks: SubtaskType[]
  activeBoard: BoardType | null
}

const setInitBoards = () => {
  if (!boardsFromLocalStorage) {
    localStorage.setItem("boards", JSON.stringify(boardsData))
  }

  return boardsFromLocalStorage
    ? JSON.parse(boardsFromLocalStorage)
    : boardsData
}

const setInitCollumns = () => {
  if (!collumnsFromLocalStorage) {
    localStorage.setItem("collumns", JSON.stringify(collumnsData))
  }

  return collumnsFromLocalStorage
    ? JSON.parse(collumnsFromLocalStorage)
    : collumnsData
}

const setInitTasks = () => {
  if (!tasksFromLocalStorage) {
    localStorage.setItem("tasks", JSON.stringify(tasksData))
  }

  return tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : tasksData
}

const setInitSubtasks = () => {
  if (!subtasksFromLocalStorage) {
    localStorage.setItem("subtasks", JSON.stringify(subtasksData))
  }

  return subtasksFromLocalStorage
    ? JSON.parse(subtasksFromLocalStorage)
    : subtasksData
}

const initialState: RoomsStateType = {
  boards: setInitBoards(),
  collumns: setInitCollumns(),
  tasks: setInitTasks(),
  subtasks: setInitSubtasks(),
  activeBoard: setInitBoards()[0],
}

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    createBoard: (state, actions: { payload: { name: string } }) => {
      const newBoard = {
        id: nanoid(),
        name: actions.payload.name,
      }
      state.boards.unshift(newBoard)
      state.activeBoard = { ...newBoard }

      localStorage.setItem("boards", JSON.stringify(state.boards))
    },

    deleteBoard: (state) => {
      if (!state.activeBoard) {
        return
      }

      const activeBoardId = state.activeBoard.id

      state.boards = state.boards.filter(
        (board) => board.id !== state.activeBoard?.id,
      )

      state.collumns.forEach((collumn) => {
        if (collumn.boardId === activeBoardId) {
          roomSlice.caseReducers.deleteCollumn(state, {
            payload: { id: collumn.id },
          })
        }
      })

      state.activeBoard = state.boards[0] || null
      localStorage.setItem("boards", JSON.stringify(state.boards))

      toast.success("Board deleted successfully")
    },

    editBoard: (state, actions: { payload: { id: string; name: string } }) => {
      const boardIndex = state.boards.findIndex(
        (board) => board.id === actions.payload.id,
      )
      state.boards[boardIndex].name = actions.payload.name

      roomSlice.caseReducers.setActiveBoard(state, {
        payload: { id: actions.payload.id },
      })

      localStorage.setItem("boards", JSON.stringify(state.boards))
    },

    setActiveBoard: (state, actions: { payload: { id: string } }) => {
      state.activeBoard =
        state.boards.find((board) => board.id === actions.payload.id) ||
        ({} as BoardType)
    },

    addCollumn: (
      state,
      actions: { payload: { name: string; color: string } },
    ) => {
      if (!state.activeBoard) {
        toast.error("Please create a board first")
        return
      }

      const newCollumn: CollumnType = {
        id: nanoid(),
        name: actions.payload.name,
        color: actions.payload.color,
        boardId: state.activeBoard.id,
      }
      state.collumns.push(newCollumn)

      localStorage.setItem("collumns", JSON.stringify(state.collumns))
    },

    deleteCollumn: (state, actions: { payload: { id: string } }) => {
      state.collumns = state.collumns.filter(
        (collumn) => collumn.id !== actions.payload.id,
      )

      state.tasks.forEach((task) => {
        if (task.collumnId === actions.payload.id) {
          roomSlice.caseReducers.deleteTask(state, {
            payload: { id: task.id },
          })
        }
      })

      localStorage.setItem("collumns", JSON.stringify(state.collumns))
    },

    editCollumn: (
      state,
      actions: { payload: { id: string; name: string; color: string } },
    ) => {
      const collumnIndex = state.collumns.findIndex(
        (collumn) => collumn.id === actions.payload.id,
      )
      state.collumns[collumnIndex].name = actions.payload.name
      state.collumns[collumnIndex].color = actions.payload.color

      localStorage.setItem("collumns", JSON.stringify(state.collumns))
    },

    editCollumnsOrder: (
      state,
      actions: { payload: { collumns: CollumnType[] } },
    ) => {
      actions.payload.collumns.forEach((collumn) => {
        const collumnIndex = state.collumns.findIndex(
          (stateCollumn) => stateCollumn.id === collumn.id,
        )
        const movedCollumn = state.collumns.splice(collumnIndex, 1)[0]
        state.collumns.push(movedCollumn)
      })

      localStorage.setItem("collumns", JSON.stringify(state.collumns))
    },

    addTask: (
      state,
      actions: {
        payload: {
          id: string
          name: string
          description: string
          collumnId: string
          collumnName: string
        }
      },
    ) => {
      const newTask: TaskType = {
        id: actions.payload.id,
        name: actions.payload.name,
        description: actions.payload.description,
        status: actions.payload.collumnName,
        collumnId: actions.payload.collumnId,
      }
      state.tasks.push(newTask)

      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },

    deleteTask: (state, actions: { payload: { id: string } }) => {
      state.tasks = state.tasks.filter((task) => task.id !== actions.payload.id)

      state.subtasks.forEach((subtask) => {
        if (subtask.taskId === actions.payload.id) {
          roomSlice.caseReducers.deleteSubtask(state, {
            payload: { id: subtask.id },
          })
        }
      })

      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },

    editTask: (
      state,
      actions: {
        payload: {
          id: string
          name: string
          description: string
        }
      },
    ) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === actions.payload.id,
      )
      state.tasks[taskIndex].name = actions.payload.name
      state.tasks[taskIndex].description = actions.payload.description

      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },

    moveTask: (
      state,
      actions: {
        payload: {
          taskId: string
          fromCollumnId: string
          toCollumnId: string
        }
      },
    ) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === actions.payload.taskId,
      )
      const toCollumn = state.collumns.find(
        (collumn) => collumn.id === actions.payload.toCollumnId,
      )
      if (!toCollumn) return

      state.tasks[taskIndex].collumnId = toCollumn.id
      state.tasks[taskIndex].status = toCollumn.name

      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },

    editTasksOrder: (state, actions: { payload: { tasks: TaskType[] } }) => {
      // znajdź taski w state który zostały wysłane w payload i przenieś je na koniec tablicy w takiej samej kolejności jak w payload
      actions.payload.tasks.forEach((task) => {
        const taskIndex = state.tasks.findIndex(
          (stateTask) => stateTask.id === task.id,
        )
        const movedTask = state.tasks.splice(taskIndex, 1)[0]
        state.tasks.push(movedTask)
      })

      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },

    editTaskStatus: (
      state,
      actions: { payload: { id: string; collumnId: string } },
    ) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === actions.payload.id,
      )
      const sellectedCollumn = state.collumns.find(
        (collumn) => collumn.id === actions.payload.collumnId,
      )

      if (!sellectedCollumn) return

      state.tasks[taskIndex].collumnId = sellectedCollumn.id
      state.tasks[taskIndex].status = sellectedCollumn.name

      //move task to end of the list
      const task = state.tasks.splice(taskIndex, 1)[0]
      state.tasks.push(task)

      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    },

    addSubtask: (
      state,
      actions: {
        payload: {
          name: string
          taskId: string
        }
      },
    ) => {
      const newSubtask: SubtaskType = {
        id: nanoid(),
        name: actions.payload.name,
        isCompleted: false,
        taskId: actions.payload.taskId,
      }
      state.subtasks.push(newSubtask)

      localStorage.setItem("subtasks", JSON.stringify(state.subtasks))
    },

    deleteSubtask: (state, actions: { payload: { id: string } }) => {
      state.subtasks = state.subtasks.filter(
        (subtask) => subtask.id !== actions.payload.id,
      )

      localStorage.setItem("subtasks", JSON.stringify(state.subtasks))
    },

    editSubtask: (
      state,
      actions: { payload: { id: string; name: string } },
    ) => {
      const subtaskIndex = state.subtasks.findIndex(
        (subtask) => subtask.id === actions.payload.id,
      )
      state.subtasks[subtaskIndex].name = actions.payload.name

      localStorage.setItem("subtasks", JSON.stringify(state.subtasks))
    },

    toggleSubtask: (
      state,
      actions: { payload: { id: string; isCompleted: boolean } },
    ) => {
      const subtaskIndex = state.subtasks.findIndex(
        (subtask) => subtask.id === actions.payload.id,
      )
      state.subtasks[subtaskIndex].isCompleted = actions.payload.isCompleted

      localStorage.setItem("subtasks", JSON.stringify(state.subtasks))
    },
  },
})

export const {
  createBoard,
  editBoard,
  deleteBoard,
  setActiveBoard,
  addCollumn,
  deleteCollumn,
  editCollumn,
  editCollumnsOrder,
  addTask,
  deleteTask,
  editTask,
  moveTask,
  editTasksOrder,
  editTaskStatus,
  addSubtask,
  deleteSubtask,
  editSubtask,
  toggleSubtask,
} = roomSlice.actions

export default roomSlice.reducer
