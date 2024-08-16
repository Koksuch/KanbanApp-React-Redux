import { useSelector } from "react-redux"
import EmptyRoomView from "./EmptyRoomView"
import LoadedRoomView from "./LoadedRoomView"
import { RootState } from "../../redux/store"

const Room = () => {
  const activeBoard = useSelector((state: RootState) => state.rooms.activeBoard)

  return (
    <>
      <EmptyRoomView />
      {activeBoard && <LoadedRoomView />}
    </>
  )
}

export default Room
