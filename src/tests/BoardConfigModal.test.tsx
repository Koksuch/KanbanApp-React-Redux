import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import BoardConfigModal from "../components/Modals/BoardConfigureModal/BoardConfigModal"

const mockDispatch = vi.fn()
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux")
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn((selector) =>
      selector({
        rooms: {
          collumns: [
            { id: "1", name: "To Do", color: "#f0f0f0", boardId: "board1" },
            {
              id: "2",
              name: "In Progress",
              color: "#d0d0d0",
              boardId: "board1",
            },
            { id: "3", name: "Done", color: "#b0b0b0", boardId: "board1" },
          ],
          activeBoard: {
            id: "board1",
            name: "Mock Board",
          },
        },
      }),
    ),
  }
})

const mockSetIsShowing = vi.fn()

describe("BoardConfigModal", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockDispatch.mockClear()
    mockSetIsShowing.mockClear()
  })

  it("should render in create mode and allows typing board name", async () => {
    render(
      <BoardConfigModal
        isShowing={true}
        setIsShowing={mockSetIsShowing}
        isEdit={false}
        theme="light"
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Add New Board",
      )
    })

    const input = await screen.findByLabelText(/board name/i)
    expect(input).toHaveValue("")

    await user.type(input, "New Board")
    expect(input).toHaveValue("New Board")

    const button = screen.getByRole("button", { name: "Create New Board" })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it("should render in edit mode with existing board data", async () => {
    render(
      <BoardConfigModal
        isShowing={true}
        setIsShowing={mockSetIsShowing}
        isEdit={true}
        theme="light"
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Edit Board",
      )
    })

    const input = await screen.findByLabelText(/board name/i)
    expect(input).toHaveValue("Mock Board")

    await user.clear(input)
    await user.type(input, "Updated Board")
    expect(input).toHaveValue("Updated Board")

    const collumnInput = await screen.findByDisplayValue("To Do")
    expect(collumnInput).toBeInTheDocument()

    await user.clear(collumnInput)
    await user.type(collumnInput, "Updated To Do")
    expect(collumnInput).toHaveValue("Updated To Do")

    const button = screen.getByRole("button", { name: "Save Changes" })
    expect(button).toBeInTheDocument()
  })

  it("should show validation error if board name is missing", async () => {
    render(
      <BoardConfigModal
        isShowing={true}
        setIsShowing={mockSetIsShowing}
        isEdit={false}
        theme="light"
      />,
    )

    const button = screen.getByRole("button", { name: "Create New Board" })
    await user.click(button)

    const errorMessage = screen.getByText(/all fields are required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it("should show validation errot if collumn name is missing", async () => {
    render(
      <BoardConfigModal
        isShowing={true}
        setIsShowing={mockSetIsShowing}
        isEdit={true}
        theme="light"
      />,
    )

    const collumnInput = await screen.findByDisplayValue("To Do")
    await user.clear(collumnInput)

    const button = screen.getByRole("button", { name: "Save Changes" })
    await user.click(button)

    const errorMessage = screen.getByText(/all fields are required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it("should add a new collumn input when 'Add New Collumn' is clicked", async () => {
    render(
      <BoardConfigModal
        isShowing={true}
        setIsShowing={mockSetIsShowing}
        isEdit={true}
        theme="light"
      />,
    )

    const addButton = screen.getByRole("button", { name: "Add New Collumn" })
    await user.click(addButton)

    const newCollumnInput = await screen.findByDisplayValue("")
    expect(newCollumnInput).toBeInTheDocument()
  })

  it("should close the modal when clicking outside", async () => {
    render(
      <BoardConfigModal
        isShowing={true}
        setIsShowing={mockSetIsShowing}
        isEdit={false}
        theme="light"
      />,
    )

    await user.click(document.body)
    expect(mockSetIsShowing).toHaveBeenCalledWith(false)
  })
})
