import {
  BoardType,
  CollumnType,
  SubtaskType,
  TaskType,
} from "../helpers/boardTypes"

export const boardsData: BoardType[] = [
  {
    id: "nTKJE7F-VuRbb9L9fQWPu",
    name: "Kanban Board",
  },
]

export const collumnsData: CollumnType[] = [
  {
    id: "JQlxt6ZzFKZVwB1fT-jyr",
    name: "To Do",
    color: "#ff0000",
    boardId: "nTKJE7F-VuRbb9L9fQWPu",
  },
  {
    id: "rck0Su5fIowpfTF6P7gnk",
    name: "In Progress",
    color: "#ff9900",
    boardId: "nTKJE7F-VuRbb9L9fQWPu",
  },
  {
    id: "uw38_enabA4OxyKxU7CSL",
    name: "Done",
    color: "#00ff00",
    boardId: "nTKJE7F-VuRbb9L9fQWPu",
  },
]

export const tasksData: TaskType[] = [
  {
    id: "KJB-fdCvvfFkrMSzXSYV3",
    name: "To do task 1",
    description: "To do task 1 description ",
    status: "To Do",
    collumnId: "JQlxt6ZzFKZVwB1fT-jyr",
  },
  {
    id: "jg8tvQ19UsiAX526q4LPy",
    name: "To do task 2",
    description: "To do task 2 description ",
    status: "To Do",
    collumnId: "JQlxt6ZzFKZVwB1fT-jyr",
  },
  {
    id: "KeyT_THPHfRA1tzVtc1_B",
    name: "In Progress task 1",
    description: "In Progress task 1 description",
    status: "In Progress",
    collumnId: "rck0Su5fIowpfTF6P7gnk",
  },
  {
    id: "N8IEXpwCbt_pP-DDAX3BY",
    name: "In Progress task 2",
    description: "In Progress task 2 description",
    status: "In Progress",
    collumnId: "rck0Su5fIowpfTF6P7gnk",
  },
  {
    id: "ACCKZ90KEBIdx2aACOede",
    name: "In Progress task 3",
    description: "In Progress task 3 description",
    status: "In Progress",
    collumnId: "rck0Su5fIowpfTF6P7gnk",
  },
  {
    id: "ga29Cpdbw8beZEZjYAMQI",
    name: "Done task 1",
    description: "Done task 1 description",
    status: "Done",
    collumnId: "uw38_enabA4OxyKxU7CSL",
  },
  {
    id: "dFOvO-CR1xsR9wwDZOvBF",
    name: "Done task 2",
    description: "Done task 2 description",
    status: "Done",
    collumnId: "uw38_enabA4OxyKxU7CSL",
  },
]

export const subtasksData: SubtaskType[] = [
  {
    id: "A2GkvLmckaHpfop_nkJUj",
    name: "SubTask",
    isCompleted: false,
    taskId: "jg8tvQ19UsiAX526q4LPy",
  },
  {
    id: "DjxKUsE38NTaao0r3mpGi",
    name: "subtask 1",
    isCompleted: true,
    taskId: "N8IEXpwCbt_pP-DDAX3BY",
  },
  {
    id: "M1AoFN4fEEBjlouNXl3NW",
    name: "subtask 2",
    isCompleted: false,
    taskId: "N8IEXpwCbt_pP-DDAX3BY",
  },
  {
    id: "PKUHuyUNTOuvY_WTBlW4S",
    name: "subtaks 1",
    isCompleted: true,
    taskId: "dFOvO-CR1xsR9wwDZOvBF",
  },
  {
    id: "GBqE7fb6TDNoCxcdohe1G",
    name: "subtask 2",
    isCompleted: true,
    taskId: "dFOvO-CR1xsR9wwDZOvBF",
  },
]
