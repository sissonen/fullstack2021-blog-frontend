describe('Blog app tests', function() {
  beforeEach(function() {
    cy.request('GET', 'http://localhost:3003/api/testing/reset')
    const user = {
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
})
