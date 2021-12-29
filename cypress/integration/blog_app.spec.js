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

  describe('Logging in', function() {
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
  describe('Logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', { username: user.username, password: user.password })
        .then(({ body }) => {
          localStorage.setItem('blogAppUser', JSON.stringify(body))
          cy.visit('http://localhost:3000')
        })
    })

    it('add blog', function() {
      cy.contains('Add blog').click()
      cy.get('input[name=Title]').type('testtitle')
      cy.get('input[name=Author]').type('testauthor')
      cy.get('input[name=URL]').type('testurl')
      cy.get('input[name=Likes]').type('1')
      cy.get('#submit-new-blog').contains('Create').click()
      cy.contains('Blog "testtitle" added')
      cy.get('.blogTitle').contains('testtitle')
    })
    
    it('like a blog', function() {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/blogs/',
        body: { title: 'test-title', author: 'test-author', url: 'test-url', likes: 1 },
        headers: { 'Authorization': 'bearer ' + JSON.parse(localStorage.getItem('blogAppUser')).token }
      })
        .then(function() {
          cy.visit('http://localhost:3000')
          cy.get('.blogTitle').click()
          cy.contains('Likes: 1')
          cy.contains('+ Like').click()
          cy.contains('Likes: 2')
        })
    })
  })

})
