import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../redux/store"
import {
  addCollumn,
  createBoard,
  deleteCollumn,
  editBoard,
  editCollumn,
} from "../../../redux/boardSlice"
import CollumnInput from "./CollumnInput"
import { CollumnType as GlobalCT } from "../../../helpers/boardTypes"
import { toast } from "react-toastify"

type CollumnType = {
  id?: string
  name: string
  color: string
  boardId?: string
}

type BoardConfigModalProps = {
  theme: string
  isShowing: boolean
  setIsShowing: (isShowing: boolean) => void
  isEdit: boolean
}

const BoardConfigModal = (props: BoardConfigModalProps) => {
  const boardCollumns = useSelector((state: RootState) => state.rooms.collumns)
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)

  const [boardName, setBoardName] = useState("")
  const [collumns, setCollumns] = useState<CollumnType[] | []>([])
  const [isValidationError, setIsValidationError] = useState(false)

  const dispatch: AppDispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.isEdit) {
      if (activeBoard) {
        const activeBoardCollumns = boardCollumns.filter(
          (collumn: GlobalCT) => collumn.boardId === activeBoard?.id,
        )

        setBoardName(activeBoard.name)
        setCollumns([...activeBoardCollumns])
      }
    }
  }, [props.isEdit, activeBoard, boardCollumns, props.isShowing])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        props.setIsShowing(false)
        setBoardName("")
        setCollumns([])
        setIsValidationError(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, props])

  const addColl = () => {
    let color: string = "#000000"
    if (collumns.length === 0) {
      //red
      color = "#ff0000"
    } else if (collumns.length === 1) {
      //orange
      color = "#ff9900"
    } else if (collumns.length === 2) {
      //green
      color = "#00ff00"
    } else {
      //random color
      color = "#" + Math.floor(Math.random() * 16777215).toString(16)
    }

    setCollumns([...collumns, { name: "", color: color }])
  }

  const removeCollumn = (index: number) => {
    const newCollumns = collumns.filter((_, i) => i !== index)
    setCollumns(newCollumns)
  }

  const updateCollumn = (index: number, key: string, value: string) => {
    const newCollumns = collumns.map((collumn, i) => {
      if (i === index) {
        return { ...collumn, [key]: value }
      }
      return collumn
    })
    setCollumns(newCollumns)
  }

  const checkValidation = () => {
    let isValid = true
    if (!boardName) {
      setIsValidationError(true)
      isValid = false
    }
    collumns.forEach((collumn) => {
      if (!collumn.name) {
        setIsValidationError(true)
        isValid = false
      }
    })
    return isValid
  }

  const createNewBoard = () => {
    if (!checkValidation()) return

    setIsValidationError(false)

    dispatch(createBoard({ name: boardName }))
    collumns.forEach((collumn) => {
      dispatch(addCollumn({ name: collumn.name, color: collumn.color }))
    })

    toast.success("New board created successfully")
    props.setIsShowing(false)
    setBoardName("")
    setCollumns([])
  }

  const updateBoard = () => {
    if (!checkValidation()) return
    setIsValidationError(false)

    if (props.isEdit) {
      if (activeBoard) {
        const activeBoardCollumns = boardCollumns.filter(
          (collumn: GlobalCT) => collumn.boardId === activeBoard?.id,
        )
        const collumnsToDelete = activeBoardCollumns.filter(
          (collumn) => !collumns.some((coll) => collumn.id === coll.id),
        )
        const collumnsToAdd = collumns.filter(
          (collumn) =>
            !activeBoardCollumns.some((coll) => collumn.id === coll.id),
        )

        dispatch(editBoard({ id: activeBoard.id, name: boardName }))

        collumnsToAdd.forEach((coll) =>
          dispatch(addCollumn({ name: coll.name, color: coll.color })),
        )
        collumnsToDelete.forEach((coll) =>
          dispatch(deleteCollumn({ id: coll.id })),
        )
        collumns.forEach((collumn) => {
          if (collumn.id) {
            dispatch(
              editCollumn({
                id: collumn.id,
                name: collumn.name,
                color: collumn.color,
              }),
            )
          }
        })

        toast.success("Board updated successfully")
      }
    }

    props.setIsShowing(false)
    setBoardName("")
    setCollumns([])
  }

  return (
    props.isShowing && (
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#00000099] ${props.theme === "light" ? "text-black" : "text-white"}`}
      >
        <div
          ref={ref}
          className={`flex w-1/3 flex-col gap-2 rounded-lg p-8 ${props.theme === "light" ? "bg-white" : "bg-[#2b2c37]"}`}
        >
          <h2 className="mb-5 text-xl font-bold">
            {props.isEdit ? "Edit Board" : "Add New Board"}
          </h2>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold">Board Name</label>
            <input
              className={`mb-5 rounded-md border border-[#828fa3] p-2 outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7] ${props.theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
              value={boardName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBoardName(e.target.value)
              }
              type="text"
            />
          </div>
          <div>
            {collumns[0] && (
              <h3 className="mb-2 text-sm font-bold">Board Collumns</h3>
            )}
            {collumns?.map((collumn, index) => (
              <div className="mb-3 flex w-full gap-2" key={index}>
                <CollumnInput
                  collumn={collumn}
                  collumnIndex={index}
                  theme={props.theme}
                  updateCollumn={updateCollumn}
                  removeCollumn={removeCollumn}
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
              className={`flex justify-center gap-1 rounded-full fill-[#635fc7] px-5 py-2 text-base font-bold text-[#635fc7] outline-none transition-all hover:border-[#635fc7] hover:bg-[#d8d7f1] focus:border-[#635fc7] focus:ring-2 focus:ring-[#635fc7] ${props.theme === "light" ? "bg-[#f4f7fd] hover:bg-[#f4f7fd]" : "bg-white"}`}
              onClick={addColl}
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
              Add New Collumn
            </button>
            {props.isEdit ? (
              <button
                className={`rounded-full bg-[#635fc7] fill-white py-2 font-bold text-white outline-none transition-all hover:border-[#a8a4ff] hover:bg-[#a8a4ff] focus:border-[#a8a4ff] focus:ring-2 focus:ring-[#a8a4ff]`}
                onClick={updateBoard}
              >
                Save Changes
              </button>
            ) : (
              <button
                className={`rounded-full bg-[#635fc7] fill-white py-2 font-bold text-white outline-none transition-all hover:border-[#a8a4ff] hover:bg-[#a8a4ff] focus:border-[#a8a4ff] focus:ring-2 focus:ring-[#a8a4ff]`}
                onClick={createNewBoard}
              >
                Create New Board
              </button>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default BoardConfigModal
