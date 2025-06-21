import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ThemeToggle from "../components/SideBar/ThemeToggle"

describe("ThemeToggle", () => {
  it("should render with light theme styles and unchecked checbox", () => {
    const mockToggle = vi.fn()

    render(<ThemeToggle theme="light" toggleTheme={mockToggle} />)

    const checbox = document.querySelector("input[type='checkbox']")
    expect(checbox).toBeInTheDocument()
    expect(checbox).not.toBeChecked()

    const container = checbox?.closest("div")
    expect(container).toHaveClass("bg-[#f4f7fd]")
  })

  it("should render with dark theme styles and checked checbox", () => {
    const mockToggle = vi.fn()

    render(<ThemeToggle theme="dark" toggleTheme={mockToggle} />)

    const checbox = document.querySelector("input[type='checkbox']")
    expect(checbox).toBeInTheDocument()
    expect(checbox).toBeChecked()

    const container = checbox?.closest("div")
    expect(container).toHaveClass("bg-[#20212c]")
  })
})
