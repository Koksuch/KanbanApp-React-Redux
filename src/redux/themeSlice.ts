import { createSlice } from "@reduxjs/toolkit"

const themeFromLocalStorage = localStorage.getItem("theme")
const initialState: { value: string } = {
  value:
    themeFromLocalStorage !== null
      ? JSON.parse(themeFromLocalStorage)
      : "light",
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === "light" ? "dark" : "light"
      localStorage.setItem("theme", JSON.stringify(state.value))
    },
  },
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer
