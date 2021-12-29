describe('Blog app tests', function() {
  let user

  beforeEach(function() {
    cy.request('GET', 'http://localhost:3003/api/testing/reset')
    user = {
      name: 'Testi User',
      username: 'testiuser',
      password: 'secretpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page with login', function() {
    cy.contains('blogs')
    cy.contains('Username')
    cy.get('input[name=Username]')
    cy.get('input[name=Password]')
    cy.contains('Login')
  })

  describe('Login tests', function() {
    it('correct login', function() {
      cy.get('input[name=Username]').type(user.username)
      cy.get('input[name=Password]').type(user.password)
      cy.contains('Login').click()
      cy.contains('Logged in as ' + user.name)
    })

    it('incorrect login', function() {
      cy.get('input[name=Username]').type(user.username)
      cy.get('input[name=Password]').type('wrongpass')
      cy.contains('Login').click()
      cy.contains('Failed to login')
    })
  })

})
