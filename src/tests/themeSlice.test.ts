import { beforeEach, describe, expect, it, vi } from "vitest"
import reducer, { toggleTheme } from "../redux/themeSlice"

const lightTheme = "light"
const darkTheme = "dark"

describe("themeSlice", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it("should initialize with the light theme from localStorage", async () => {
    localStorage.setItem("theme", JSON.stringify(lightTheme))

    const { default: reducer } = await import("../redux/themeSlice")

    const result = reducer(undefined, { type: "" })
    expect(result.value).toBe(lightTheme)
  })

  it("should initialize with the dark theme from localStorage", async () => {
    localStorage.setItem("theme", JSON.stringify(darkTheme))

    const { default: reducer } = await import("../redux/themeSlice")

    const result = reducer(undefined, { type: "" })
    expect(result.value).toBe(darkTheme)
  })

  it("should initialize with the default light theme when localStorage is empty", async () => {
    localStorage.removeItem("theme")

    const { default: reducer } = await import("../redux/themeSlice")

    const result = reducer(undefined, { type: "" })
    expect(result.value).toBe(lightTheme)
  })

  it("should toggle theme from light to dark", () => {
    const initialState = { value: lightTheme }

    const result = reducer(initialState, toggleTheme())

    expect(result.value).toBe(darkTheme)
  })

  it("should toggle theme from dark to light", () => {
    const initialState = { value: darkTheme }
    const result = reducer(initialState, toggleTheme())

    expect(result.value).toBe(lightTheme)
  })
})
