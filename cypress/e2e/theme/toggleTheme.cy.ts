describe("Theme Toggle", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad: (win) => {
        win.localStorage.setItem("theme", JSON.stringify("light"))
      },
    })
  })

  it("should have light theme initially", () => {
    cy.window().then((win) => {
      const initialTheme = JSON.parse(win.localStorage.getItem("theme")!)
      expect(initialTheme).to.equal("light")
    })

    cy.get('[data-testid="sidebar"')
      .should("have.class", "border-[#e4ebfa]")
      .and("not.have.class", "border-[#ffffff22]")

    cy.get('[data-testid="app-container"]')
      .should("have.class", "bg-white text-black")
      .and("not.have.class", "bg-[#2b2c37] text-white")

    cy.get('[data-testid="board-container"]')
      .should("have.class", "bg-[#f4f7fd] text-black")
      .and("not.have.class", "bg-[#20212c] text-white")
  })

  it("should toggle theme from light to dark", () => {
    // Click the theme toggle button
    cy.get('[data-testid="theme-toggle-checkbox"]').click()

    // Check if the theme has changed to dark
    cy.window().then((win) => {
      const newTheme = JSON.parse(win.localStorage.getItem("theme")!)
      expect(newTheme).to.equal("dark")
    })

    cy.get('[data-testid="sidebar"')
      .should("have.class", "border-[#ffffff22]")
      .and("not.have.class", "border-[#e4ebfa]")

    cy.get('[data-testid="app-container"]')
      .should("have.class", "bg-[#2b2c37] text-white")
      .and("not.have.class", "bg-white text-black")

    cy.get('[data-testid="board-container"]')
      .should("have.class", "bg-[#20212c] text-white")
      .and("not.have.class", "bg-[#f4f7fd] text-black")
  })
})
