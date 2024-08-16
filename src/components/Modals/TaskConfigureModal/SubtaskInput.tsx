type SubTaskInputProps = {
  subTask: { name: string }
  subTaskIndex: number
  theme: string
  updateSubtask: (index: number, key: string, value: string) => void
  removeSubtask: (index: number) => void
}

const SubTaskInput = (props: SubTaskInputProps) => {
  return (
    <>
      <input
        className={`w-full rounded-md border border-[#828fa3] p-2 outline-none transition-all hover:border-[#635fc7] focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7] ${props.theme === "light" ? "bg-white text-black" : "bg-[#2b2c37] text-white"}`}
        value={props.subTask.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.updateSubtask(props.subTaskIndex, "name", e.target.value)
        }
        placeholder="e.g. Take a break"
        type="text"
      />
      <button
        className="rounded-md fill-[#828fa3] outline-none transition-all hover:border-[#635fc7] hover:fill-red-500 focus:border-[#635fc7] focus:ring-2 focus:ring-[#635fc7]"
        onClick={() => props.removeSubtask(props.subTaskIndex)}
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

export default SubTaskInput
