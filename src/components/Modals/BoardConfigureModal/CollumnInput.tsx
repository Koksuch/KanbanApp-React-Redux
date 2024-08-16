type CollumnInputProps = {
  collumn: { name: string; color: string }
  collumnIndex: number
  theme: string
  updateCollumn: (index: number, key: string, value: string) => void
  removeCollumn: (index: number) => void
}

const CollumnInput = (props: CollumnInputProps) => {
  return (
    <>
      <input
        className={`w-full rounded-md border border-[#828fa3] p-2 outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7] ${props.theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
        value={props.collumn.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.updateCollumn(props.collumnIndex, "name", e.target.value)
        }
        type="text"
      />
      <input
        className="self-center rounded-sm outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-2 focus:ring-[#635fc7]"
        value={props.collumn.color}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.updateCollumn(props.collumnIndex, "color", e.target.value)
        }
        type="color"
      />
      <button
        className="rounded-md fill-[#828fa3] outline-none transition-all hover:border-[#635fc7] hover:fill-red-500 focus:border-[#635fc7] focus:ring-2 focus:ring-[#635fc7]"
        onClick={() => props.removeCollumn(props.collumnIndex)}
      >
        <svg
          width="24"
          height="24"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>
      </button>
    </>
  )
}

export default CollumnInput
