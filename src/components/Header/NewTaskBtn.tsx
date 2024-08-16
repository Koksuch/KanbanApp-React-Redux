type NewTaskBtnProps = {
  theme: string
  onClick: () => void
  disabled?: boolean
}

const NewTaskBtn = (props: NewTaskBtnProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`flex gap-1 rounded-full bg-[#635fc7] fill-white px-5 py-2 text-base font-bold text-white transition-all hover:bg-[#a8a4ff] ${props.theme === "light" ? "disabled:bg-[#0000001f] disabled:fill-[#00000042] disabled:text-[#00000042]" : "disabled:bg-[#ffffff1f] disabled:fill-[#ffffff4d] disabled:text-[#ffffff4d]"}`}
      disabled={props.disabled}
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
      Add New Task
    </button>
  )
}

export default NewTaskBtn
