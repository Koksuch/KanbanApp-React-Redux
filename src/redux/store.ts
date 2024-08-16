import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "./themeSlice"
import roomReducer from "./boardSlice"

const store = configureStore({
  reducer: {
    theme: themeReducer,
    rooms: roomReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
