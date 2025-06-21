describe("Tasks and Subtasks", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.get('[data-testid="sidebar"]').contains("Kanban Board").click()
    cy.get('[data-testid="board-container"]').should(
      "not.contain",
      "You don't have any boards yet",
    )
  })

  it("should create a task with subtasks", () => {
    cy.get('[data-testid="new-task-btn"]').click()
    cy.get('[data-testid="task-config-modal"]').should("be.visible")
    cy.get('[data-testid="task-title-input"]').type("New Task with Subtasks")
    cy.get('[data-testid="task-description-input"]').type(
      "This is a task with subtasks",
    )
    cy.get('[data-testid="add-subtask-btn"]').click()
    cy.get('[data-testid="subtask-name-input"]').eq(0).type("Subtask 1")
    cy.get('[data-testid="add-subtask-btn"]').click()
    cy.get('[data-testid="subtask-name-input"]').eq(1).type("Subtask 2")
    cy.get('[data-testid="create-task-btn"]').click()

    cy.get('[data-testid="board-container"]')
      .should("contain", "New Task with Subtasks")
      .should("contain", "0 of 2 subtasks")

    cy.get(".Toastify__toast", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "New task created successfully")
  })

  it("should check and uncheck subtasks", () => {
    cy.get('[data-testid="board-container"]')
      .contains("In Progress task 2")
      .click()
    cy.get('[data-testid="task-info-modal"]').should("be.visible")

    cy.get('[data-testid="subtask-checkbox"]').eq(1).check()
    cy.get('[data-testid="subtask-checkbox"]').eq(0).should("be.checked")
    cy.get('[data-testid="subtask-checkbox"]').eq(1).should("be.checked")

    cy.get('[data-testid="subtask-checkbox"]').eq(0).uncheck()
    cy.get('[data-testid="subtask-checkbox"]').eq(0).should("not.be.checked")
    cy.get('[data-testid="subtask-checkbox"]').eq(1).should("be.checked")

    //click outside to close the modal
    cy.get("body").click(0, 0)
  })

  it("should edit a task and its subtasks", () => {
    cy.get('[data-testid="board-container"]')
      .contains("In Progress task 2")
      .click()
    cy.get('[data-testid="task-info-modal"]').should("be.visible")
    cy.get('[data-testid="open-task-config-btns"]').click()
    cy.get('[data-testid="edit-task-btn"]').click()
    cy.get('[data-testid="task-config-modal"]').should("be.visible")

    cy.get('[data-testid="task-title-input"]').clear().type("Edited Task Title")
    cy.get('[data-testid="task-description-input"]')
      .clear()
      .type("Edited task description")
    cy.get('[data-testid="subtask-name-input"]').should("have.length", 2)
    cy.get('[data-testid="subtask-name-input"]')
      .eq(0)
      .clear()
      .type("Edited Subtask 1")

    cy.get('[data-testid="remove-subtask-btn"]').eq(1).click()
    cy.get('[data-testid="subtask-name-input"]').should("have.length", 1)
    cy.get('[data-testid="save-task-btn"]').click()

    cy.get('[data-testid="board-container"]').should(
      "contain",
      "Edited Task Title",
    )

    cy.get(".Toastify__toast", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Task updated successfully")
  })

  it("should delete a task", () => {
    cy.get('[data-testid="board-container"]')
      .contains("In Progress task 2")
      .click()
    cy.get('[data-testid="task-info-modal"]').should("be.visible")
    cy.get('[data-testid="open-task-config-btns"]').click()
    cy.get('[data-testid="delete-task-btn"]').click()
    cy.get('[data-testid="delete-task-confirm-btn"]').click()

    cy.get('[data-testid="board-container"]').should(
      "not.contain",
      "In Progress task 2",
    )
  })
})
