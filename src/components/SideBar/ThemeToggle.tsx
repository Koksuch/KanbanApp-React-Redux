type ThemeToggleProps = {
  theme: string
  toggleTheme: () => void
}

const ThemeToggle = (props: ThemeToggleProps) => {
  return (
    <div
      className={`mx-4 mb-6 flex justify-center gap-3 rounded-lg p-3 text-center ${props.theme === "light" ? "bg-[#f4f7fd]" : "bg-[#20212c]"}`}
    >
      <svg
        width="25"
        height="25"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="WbSunnyIcon"
      >
        <path d="m6.76 4.84-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7 1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91 1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"></path>
      </svg>
      <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          onChange={() => props.toggleTheme()}
          checked={props.theme === "dark"}
        />
        <div className="peer relative h-6 w-11 rounded-full bg-[#828fa3] after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#635fc7] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
      </label>
      <svg
        width="25"
        height="25"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="NightsStayIcon"
      >
        <path d="M11.1 12.08c-2.33-4.51-.5-8.48.53-10.07C6.27 2.2 1.98 6.59 1.98 12c0 .14.02.28.02.42.62-.27 1.29-.42 2-.42 1.66 0 3.18.83 4.1 2.15 1.67.48 2.9 2.02 2.9 3.85 0 1.52-.87 2.83-2.12 3.51.98.32 2.03.5 3.11.5 3.5 0 6.58-1.8 8.37-4.52-2.36.23-6.98-.97-9.26-5.41z"></path>
        <path d="M7 16h-.18C6.4 14.84 5.3 14 4 14c-1.66 0-3 1.34-3 3s1.34 3 3 3h3c1.1 0 2-.9 2-2s-.9-2-2-2z"></path>
      </svg>
    </div>
  )
}

export default ThemeToggle
