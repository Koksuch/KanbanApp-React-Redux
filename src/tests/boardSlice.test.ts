import { assertType, beforeEach, describe, expect, it, vi } from "vitest"
import reducer, {
  addCollumn,
  addSubtask,
  addTask,
  createBoard,
  deleteBoard,
  deleteCollumn,
  deleteSubtask,
  deleteTask,
  editBoard,
  editCollumn,
  editCollumnsOrder,
  editSubtask,
  editTask,
  editTasksOrder,
  editTaskStatus,
  moveTask,
  RoomsStateType,
  setActiveBoard,
  toggleSubtask,
} from "../redux/boardSlice"
import {
  BoardType,
  CollumnType,
  SubtaskType,
  TaskType,
} from "../helpers/boardTypes"
import { nanoid } from "@reduxjs/toolkit"
import {
  boardsData,
  collumnsData,
  tasksData,
  subtasksData,
} from "../redux/initialData"
import { toast } from "react-toastify"

const mockState: RoomsStateType = {
  boards: JSON.parse(JSON.stringify(boardsData)),
  collumns: JSON.parse(JSON.stringify(collumnsData)),
  tasks: JSON.parse(JSON.stringify(tasksData)),
  subtasks: JSON.parse(JSON.stringify(subtasksData)),
  activeBoard: JSON.parse(JSON.stringify(boardsData[0])),
}

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe("boardSlice", () => {
  let state: RoomsStateType

  //deep copy before each test
  beforeEach(() => {
    state = JSON.parse(JSON.stringify(mockState))
    vi.clearAllMocks()
  })

  it("should create a new board", () => {
    const boardName = "New Test Board"
    const result = reducer(
      state,
      createBoard({
        name: boardName,
      }),
    )

    assertType<BoardType>(
      result.boards.find((board) => board.name === boardName)!,
    )
    expect(result.boards.length).toBe(state.boards.length + 1)
    expect(result.boards.find((board) => board.name === boardName)?.name).toBe(
      boardName,
    )
    expect(
      result.boards.find((board) => board.name === boardName)?.id,
    ).toBeDefined()
    expect(result.activeBoard).toEqual(
      result.boards.find((board) => board.name === boardName),
    )
  })

  it("should edit board name by ID", () => {
    const newBoardName = "Updated Board Name"
    const initialBoard: BoardType = {
      id: nanoid(),
      name: "New Test Board",
    }

    state.boards.push(initialBoard)
    state.activeBoard = { ...initialBoard }

    const result = reducer(
      state,
      editBoard({
        id: initialBoard.id,
        name: newBoardName,
      }),
    )

    expect(result.boards.length).toBe(state.boards.length)
    expect(
      result.boards.find((board) => board.name === newBoardName)?.name,
    ).toBe(newBoardName)
    expect(result.activeBoard).toEqual(
      result.boards.find((board) => board.name === newBoardName),
    )
  })

  it("should delete an existing board and setActiveBoard to first board from the ramaining boards in table assuming that boards will not be null", () => {
    const initialBoards: BoardType[] = [
      {
        id: nanoid(),
        name: "Board To Delete",
      },
      {
        id: nanoid(),
        name: "Test Board ",
      },
    ]
    state.boards.push(...initialBoards)
    state.activeBoard = { ...initialBoards[0] }

    const result = reducer(state, deleteBoard())

    expect(result.boards.length).toBeGreaterThan(0)
    expect(result.boards.length).toBe(state.boards.length - 1)
    expect(
      result.boards.find((board) => board.name === initialBoards[0].name),
    ).toBeFalsy()
    expect(result.activeBoard).toEqual(result.boards[0])
  })

  it("should delete an existing board and setActiveBoard to NULL assuming that there are no reamining boards", () => {
    const initialBoard: BoardType = {
      id: nanoid(),
      name: "Board to Delete",
    }
    state.boards = [{ ...initialBoard }]
    state.activeBoard = { ...initialBoard }

    const result = reducer(state, deleteBoard())

    expect(result.boards.length).toBe(0)
    expect(result.activeBoard).toBeNull()
  })

  it("should delete board and show success toast", () => {
    reducer(state, deleteBoard())

    expect(toast.success).toHaveBeenCalledWith("Board deleted successfully")
  })

  it("should do nothing if there are no active board", () => {
    state.activeBoard = null
    const result = reducer(state, deleteBoard())
    expect(result).toEqual(state)
  })

  it("should delete board with all collumns of it", () => {
    const result = reducer(state, deleteBoard())

    expect(result.boards.length).toBe(state.boards.length - 1)
    expect(
      result.collumns.filter(
        (collumn) => collumn.boardId === state.activeBoard?.id,
      ),
    ).toHaveLength(0)
  })

  it("should set active board by ID", () => {
    const initialBoards: BoardType[] = [
      {
        id: nanoid(),
        name: "Currently Active Board",
      },
      {
        id: nanoid(),
        name: "Board to be Active",
      },
    ]

    state.boards.push(...initialBoards)
    state.activeBoard = { ...initialBoards[0] }

    const result = reducer(
      state,
      setActiveBoard({
        id: initialBoards[1].id,
      }),
    )

    expect(result.activeBoard).toEqual(
      initialBoards.find((board) => board.id === initialBoards[1].id),
    )
  })

  it("should add collumn to the active board", () => {
    const initialBoard: BoardType = {
      id: nanoid(),
      name: "Test Board",
    }
    state.boards.push(initialBoard)
    state.activeBoard = { ...initialBoard }

    const newCollumnName = "New Collumn"
    const newCollumnColor = "#ff0000"
    const result = reducer(
      state,
      addCollumn({
        name: newCollumnName,
        color: newCollumnColor,
      }),
    )

    expect(result.collumns.length).toBe(state.collumns.length + 1)
    expect(
      result.collumns.find(
        (collumn) =>
          collumn.name === newCollumnName && collumn.color === newCollumnColor,
      ),
    ).toBeDefined()
    expect(
      result.collumns.find(
        (collumn) =>
          collumn.name === newCollumnName && collumn.color === newCollumnColor,
      )?.boardId,
    ).toBe(state.activeBoard?.id)
  })

  it("should do nothing and show error toast if there is no active board when adding new collumn", () => {
    state.activeBoard = null
    const result = reducer(
      state,
      addCollumn({
        name: "New Collumn",
        color: "#ff0000",
      }),
    )

    expect(result).toEqual(state)
    expect(toast.error).toHaveBeenCalledWith("Please create a board first")
  })

  it("should edit collumn name and color by ID", () => {
    const initialCollumn: CollumnType = {
      id: nanoid(),
      name: "Collumn to Edit",
      color: "#00ff00",
      boardId: state.activeBoard?.id || "",
    }
    state.collumns.push(initialCollumn)

    const newCollumnName = "Edited Collumn"
    const newCollumnColor = "#0000ff"
    const result = reducer(
      state,
      editCollumn({
        id: initialCollumn.id,
        name: newCollumnName,
        color: newCollumnColor,
      }),
    )

    expect(result.collumns.length).toBe(state.collumns.length)
    expect(
      result.collumns.find(
        (collumn) =>
          collumn.name === newCollumnName && collumn.color === newCollumnColor,
      ),
    ).toBeTruthy()
  })

  it("should delete collumn by ID", () => {
    const initialCollumn: CollumnType = {
      id: nanoid(),
      name: "Collumn to Delete",
      color: "#00ff00",
      boardId: state.activeBoard?.id || "",
    }
    state.collumns.push(initialCollumn)

    const result = reducer(state, deleteCollumn({ id: initialCollumn.id }))

    expect(result.collumns.length).toBe(state.collumns.length - 1)
    expect(
      result.collumns.find((collumn) => collumn.id === initialCollumn.id),
    ).toBeFalsy()
  })

  it("should delete collumn with all tasks of it", () => {
    const result = reducer(state, deleteCollumn({ id: state.collumns[0].id }))

    expect(result.collumns.length).toBe(state.collumns.length - 1)
    expect(
      result.tasks.filter((task) => task.collumnId === state.collumns[0].id),
    ).toHaveLength(0)
  })

  it("should edit collumns order in array", () => {
    const initialCollumns: CollumnType[] = [
      {
        id: nanoid(),
        name: "Collumn 1",
        color: "#ff0000",
        boardId: state.activeBoard?.id || "",
      },
      {
        id: nanoid(),
        name: "Collumn 2",
        color: "#00ff00",
        boardId: state.activeBoard?.id || "",
      },
    ]

    // Initialize state with only two collumns to easier check if order is changed
    state.collumns = [...initialCollumns]

    const result = reducer(
      state,
      editCollumnsOrder({
        collumns: [initialCollumns[1], initialCollumns[0]],
      }),
    )

    expect(result.collumns.length).toBe(state.collumns.length)
    expect(result.collumns[0].id).toBe(initialCollumns[1].id)
    expect(result.collumns[1].id).toBe(initialCollumns[0].id)
  })

  it("should add a new task to a collumn", () => {
    const initialCollumn: CollumnType = {
      id: nanoid(),
      name: "Collumn for Task",
      color: "#ff0000",
      boardId: state.activeBoard?.id || "",
    }
    state.collumns.push(initialCollumn)
    const dataOfNewTask: TaskType = {
      id: nanoid(),
      name: "New Task",
      description: "New Task Description",
      status: initialCollumn.name,
      collumnId: initialCollumn.id,
    }

    const result = reducer(
      state,
      addTask({
        id: dataOfNewTask.id,
        name: dataOfNewTask.name,
        description: dataOfNewTask.description,
        collumnName: dataOfNewTask.status,
        collumnId: dataOfNewTask.collumnId,
      }),
    )

    expect(result.tasks.length).toBe(state.tasks.length + 1)
    expect(result.tasks.find((task) => task.id === dataOfNewTask.id)).toEqual(
      dataOfNewTask,
    )
  })

  it("should edit task name and description by ID", () => {
    const initialTask: TaskType = {
      id: nanoid(),
      name: "Task to Edit",
      description: "Task Description",
      status: state.collumns[0].name,
      collumnId: state.collumns[0].id,
    }
    state.tasks.push(initialTask)

    const newTaskName = "Edited Task Name"
    const newTaskDescription = "Edited Task Description"
    const result = reducer(
      state,
      editTask({
        id: initialTask.id,
        name: newTaskName,
        description: newTaskDescription,
      }),
    )

    expect(result.tasks.length).toBe(state.tasks.length)
    expect(result.tasks.find((task) => task.id === initialTask.id)?.name).toBe(
      newTaskName,
    )
    expect(
      result.tasks.find((task) => task.id === initialTask.id)?.description,
    ).toBe(newTaskDescription)
  })

  it("should delete task by ID", () => {
    const initialTask: TaskType = {
      id: nanoid(),
      name: "Task to Delete",
      description: "Task Description",
      status: state.collumns[0].name,
      collumnId: state.collumns[0].id,
    }
    state.tasks.push(initialTask)

    const result = reducer(state, deleteTask({ id: initialTask.id }))

    expect(result.tasks.length).toBe(state.tasks.length - 1)
    expect(result.tasks.find((task) => task.id === initialTask.id)).toBeFalsy()
  })

  it("should delete task with all subtasks of it", () => {
    const result = reducer(state, deleteTask({ id: state.tasks[1].id }))

    expect(result.tasks.length).toBe(state.tasks.length - 1)
    expect(
      result.subtasks.filter((subtaks) => subtaks.taskId === state.tasks[1].id),
    ).toHaveLength(0)
  })

  it("should move task to another collumn by taks Id, source collumn ID and target collumn ID", () => {
    const initialCollumns: CollumnType[] = [
      {
        id: nanoid(),
        name: "Source Collumn",
        color: "#ff0000",
        boardId: state.activeBoard?.id || "",
      },
      {
        id: nanoid(),
        name: "Target Collumn",
        color: "#00ff00",
        boardId: state.activeBoard?.id || "",
      },
    ]
    state.collumns.push(...initialCollumns)

    const initialTask: TaskType = {
      id: nanoid(),
      name: "Task to Move",
      description: "Task Description",
      status: initialCollumns[0].name,
      collumnId: initialCollumns[0].id,
    }
    state.tasks.push(initialTask)

    const result = reducer(
      state,
      moveTask({
        taskId: initialTask.id,
        fromCollumnId: initialCollumns[0].id,
        toCollumnId: initialCollumns[1].id,
      }),
    )

    expect(result.tasks.length).toBe(state.tasks.length)
    expect(
      result.tasks.find((task) => task.id === initialTask.id)?.collumnId,
    ).toBe(initialCollumns[1].id)
    expect(
      result.tasks.find((task) => task.id === initialTask.id)?.status,
    ).toBe(initialCollumns[1].name)
  })

  it("should edit tasks order in array", () => {
    const initialTasks: TaskType[] = [
      {
        id: nanoid(),
        name: "Task 1",
        description: "Task 1 Description",
        status: state.collumns[0].name,
        collumnId: state.collumns[0].id,
      },
      {
        id: nanoid(),
        name: "Task 2",
        description: "Task 2 Description",
        status: state.collumns[0].name,
        collumnId: state.collumns[0].id,
      },
    ]
    // Initialize state with only two tasks to easier check if order is changed
    state.tasks = [...initialTasks]

    const newOrder = [{ ...initialTasks[1] }, { ...initialTasks[0] }]
    const result = reducer(
      state,
      editTasksOrder({
        tasks: newOrder,
      }),
    )

    expect(result.tasks.length).toBe(state.tasks.length)
    expect(result.tasks[0].id).toBe(newOrder[0].id)
    expect(result.tasks[1].id).toBe(newOrder[1].id)
  })

  it("should edit task status(this is collumn name) by collumn ID", () => {
    const initialCollumns: CollumnType[] = [
      {
        id: nanoid(),
        name: "Old Task Status Collumn",
        color: "#ff0000",
        boardId: state.activeBoard?.id || "",
      },
      {
        id: nanoid(),
        name: "New Task Status Collumn",
        color: "#00ff00",
        boardId: state.activeBoard?.id || "",
      },
    ]
    const initialTask: TaskType = {
      id: nanoid(),
      name: "Task to Edit Status",
      description: "Task Description",
      status: initialCollumns[0].name,
      collumnId: initialCollumns[0].id,
    }
    state.collumns.push(...initialCollumns)
    state.tasks.push(initialTask)

    const result = reducer(
      state,
      editTaskStatus({
        id: initialTask.id,
        collumnId: initialCollumns[1].id,
      }),
    )

    expect(result.tasks.length).toBe(state.tasks.length)
    expect(
      result.tasks.find((task) => task.id === initialTask.id)?.status,
    ).toBe(initialCollumns[1].name)
  })

  it("should add a new subtask to a task", () => {
    const initialTask: TaskType = {
      id: nanoid(),
      name: "Task for Subtask",
      description: "Task Description",
      status: state.collumns[0].name,
      collumnId: state.collumns[0].id,
    }
    state.tasks.push(initialTask)

    const subtaskName = "New Subtask"
    const result = reducer(
      state,
      addSubtask({
        taskId: initialTask.id,
        name: subtaskName,
      }),
    )

    expect(result.subtasks.length).toBe(state.subtasks.length + 1)
    const addedSubtask = result.subtasks.find(
      (subtask) =>
        subtask.name === subtaskName && subtask.taskId === initialTask.id,
    )
    expect(addedSubtask).toBeDefined()
    expect(addedSubtask?.id).toBeDefined()
    expect(addedSubtask?.taskId).toBe(initialTask.id)
    expect(addedSubtask?.name).toBe(subtaskName)
    expect(addedSubtask?.isCompleted).toBeFalsy()
  })

  it("should edit subtask name by ID", () => {
    const initialSubtask: SubtaskType = {
      id: nanoid(),
      name: "Subtask to Edit",
      isCompleted: false,
      taskId: state.tasks[0].id,
    }
    state.subtasks.push(initialSubtask)

    const newSubtaskName = "Edited Subtask Name"
    const result = reducer(
      state,
      editSubtask({
        id: initialSubtask.id,
        name: newSubtaskName,
      }),
    )

    expect(result.subtasks.length).toBe(state.subtasks.length)
    expect(
      result.subtasks.find((subtask) => subtask.id === initialSubtask.id)?.name,
    ).toBe(newSubtaskName)
  })

  it("should delete subtask by ID", () => {
    const initialSubtask: SubtaskType = {
      id: nanoid(),
      name: "Subtask to Delete",
      isCompleted: false,
      taskId: state.tasks[0].id,
    }
    state.subtasks.push(initialSubtask)

    const result = reducer(state, deleteSubtask({ id: initialSubtask.id }))

    expect(result.subtasks.length).toBe(state.subtasks.length - 1)
    expect(
      result.subtasks.find((subtask) => subtask.id === initialSubtask.id),
    ).toBeFalsy()
  })

  it("should edit subtask completion status by ID", () => {
    const initialSubtask: SubtaskType = {
      id: nanoid(),
      name: "Subtask to Edit Completion",
      isCompleted: false,
      taskId: state.tasks[0].id,
    }
    state.subtasks.push(initialSubtask)

    const result = reducer(
      state,
      toggleSubtask({
        id: initialSubtask.id,
        isCompleted: true,
      }),
    )

    expect(result.subtasks.length).toBe(state.subtasks.length)
    expect(
      result.subtasks.find((subtask) => subtask.id === initialSubtask.id)
        ?.isCompleted,
    ).toBeTruthy()
  })
})
