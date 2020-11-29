import {buildUser} from '../support/generate'

describe('smoke', () => {
  it('should allow a typical user flow', () => {
    cy.visit('/')
    cy.findByRole('button', {name: /register/i}).click()
    cy.findByRole('dialog').within(() => {
      const fakerUser = buildUser()
      cy.findByRole('textbox', {name: /username/i}).type(fakerUser.username)
      cy.findByRole('textbox', {name: /password/i}).type(fakerUser.password)
      cy.findByRole('button', {name: /register/i}).click()
    })
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /discover/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.get('input', {name: /search/i}).type('How to Be an Antiracist{enter}')
      cy.findByRole('listitem').within(() => {
        cy.findByRole('button', {name: /add to list/i}).click()
        cy.findByLabelText(/loading/i).should('exist')
        cy.findByLabelText(/loading/i).should('not.exist')
      })
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /reading list/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('list')
        .should('have.length', 1)
        .within(() => {
          cy.findByRole('heading', {name: 'How to Be an Antiracist'}).click()
        })

      cy.findByRole('textbox', {name: /notes/i}).type('notes')
      cy.findByLabelText(/loading/i).should('exist')
      cy.findByLabelText(/loading/i).should('not.exist')
      cy.findByRole('button', {name: /mark as read/i}).click()
      cy.findByRole('radio', {name: /5 stars/i}).click({force: true})
    })
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /finished books/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('list')
        .should('have.length', 1)
        .within(() => {
          cy.findByRole('radio', {name: /5 stars/i}).should('have.value', 5)
          cy.findByRole('heading', {name: 'How to Be an Antiracist'}).click()
        })

      cy.findByRole('button', {name: /remove from list/i}).click()
      cy.findByRole('textbox').should('not.exist')
      cy.findByRole('radio').should('not.exist')
    })
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /finished books/i}).click()
    })
    cy.findByRole('main').within(() => {
      cy.findByRole('list').should('have.length', 0)
    })
  })
})
