describe("Board", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should create new board with 2 collumns", () => {
    cy.get('[data-testid="new-board-btn"]').click()
    cy.get('[data-testid="board-config-modal"]').should("be.visible")

    cy.get('[data-testid="board-name-input"]').type("New Test Board")

    cy.get('[data-testid="add-collumn-btn"]').click()
    cy.get('[data-testid="collumn-name-input"]').eq(0).type("To Do")

    cy.get('[data-testid="add-collumn-btn"]').click()
    cy.get('[data-testid="collumn-name-input"]').eq(1).type("In Progress")

    cy.get('[data-testid="create-new-board-btn"]').click()
    cy.get('[data-testid="sidebar"]').should("contain", "New Test Board")
    cy.get('[data-testid="board-container"]').should("contain", "To Do")
    cy.get('[data-testid="board-container"]').should("contain", "In Progress")

    cy.get('[data-testid="board-container"]').should("contain", "New Collumn")

    cy.get(".Toastify__toast", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "New board created successfully")
  })

  it("should edit existing board and add new collumns", () => {
    cy.get('[data-testid="sidebar"]').contains("Kanban Board").click()
    cy.get('[data-testid="configure-board-btns"]').click()
    cy.get('[data-testid="edit-board-btn"]').click()
    cy.get('[data-testid="board-config-modal"]').should("be.visible")

    cy.get('[data-testid="board-name-input"]')
      .clear()
      .type("Updated Board Name")

    cy.get('[data-testid="collumn-name-input"]')
      .eq(0)
      .clear()
      .type("Updated To Do")

    cy.get('[data-testid="collumn-name-input"]')
      .eq(1)
      .clear()
      .type("Updated In Progress")

    cy.get('[data-testid="save-changes-btn"]').click()

    cy.get('[data-testid="sidebar"]').should("contain", "Updated Board Name")
    cy.get('[data-testid="board-container"]').should("contain", "Updated To Do")
    cy.get('[data-testid="board-container"]').should(
      "contain",
      "Updated In Progress",
    )

    cy.get(".Toastify__toast", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Board updated successfully")
  })

  it("should delete existing board", () => {
    cy.get('[data-testid="sidebar"]').contains("Kanban Board").click()
    cy.get('[data-testid="configure-board-btns"]').click()
    cy.get('[data-testid="delete-board-btn"]').click()
    cy.get('[data-testid="confirm-delete-btn"]').click()

    cy.get('[data-testid="sidebar"]').should("not.contain", "Kanban Board")
    cy.get(".Toastify__toast", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Board deleted successfully")

    cy.get('[data-testid="board-container"]').should(
      "contain",
      "You don't have any boards yet",
    )
  })
})
