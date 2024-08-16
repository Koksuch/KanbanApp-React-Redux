export type BoardType = {
  id: string
  name: string
}

export type CollumnType = {
  id: string
  name: string
  color: string
  boardId: string
}

export type TaskType = {
  id: string
  name: string
  description: string
  status: string
  collumnId: string
}

export type SubtaskType = {
  id: string
  name: string
  isCompleted: boolean
  taskId: string
}
