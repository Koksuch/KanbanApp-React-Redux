import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useState } from "react"
import BoardConfigModal from "../Modals/BoardConfigureModal/BoardConfigModal"

const NewCollumn = () => {
  const theme = useSelector((state: RootState) => state.theme.value)

  const [isShowing, setIsShowing] = useState(false)

  return (
    <div className="mt-9 w-72 shrink-0 grow-0 basis-72">
      <button
        className={`flex h-full w-full items-center justify-center rounded-md fill-[#828fa3] text-2xl font-bold text-[#828fa3] hover:fill-[#635fc7] hover:text-[#635fc7] hover:transition-all ${theme === "light" ? "bg-[#ebf0fb] hover:bg-[#e7edf8]" : "bg-[#23242f] hover:bg-[#292b37]"} `}
        onClick={() => setIsShowing(true)}
      >
        <svg
          width="32"
          height="32"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
        </svg>{" "}
        New Collumn
      </button>
      <BoardConfigModal
        isShowing={isShowing}
        setIsShowing={(value) => setIsShowing(value)}
        theme={theme}
        isEdit={true}
      />
    </div>
  )
}

export default NewCollumn
