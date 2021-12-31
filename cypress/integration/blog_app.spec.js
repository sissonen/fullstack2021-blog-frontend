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
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs/',
            body: { title: 'test-title-1', author: 'test-author', url: 'test-url', likes: 1 },
            headers: { 'Authorization': 'bearer ' + body.token }
          })
            .then(function() {
              cy.visit('http://localhost:3000')
            })
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
      cy.get('.blogTitle').click()
      cy.contains('Likes: 1')
      cy.contains('+ Like').click()
      cy.contains('Likes: 2')
    })

    it('remove a blog', function() {
      cy.get('.blogTitle').click()
      cy.contains('Remove blog').click()
      cy.on('window:confirm', () => true)
      cy.contains('removed succesfully')
    })

    it('another user cannot remove a blog', function() {
      const testuser = { name: 'Test2', username: 'testuser2', password: 'testpass' }
      cy.request('POST', 'http://localhost:3003/api/users', testuser)
        .then(function() {
          cy.request('POST', 'http://localhost:3003/api/login', { username: testuser.username, password: testuser.password })
            .then(function({ body }) {
              localStorage.setItem('blogAppUser', JSON.stringify(body))
              cy.visit('http://localhost:3000')
              cy.get('.blogTitle').click()
              cy.contains('Remove blog').should('not.exist')
            })
      })
    })

    it.only('blogs sorted by likes', function() {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/blogs/',
        body: { title: 'test-title-2', author: 'test-author-2', url: 'test-url-2', likes: 2 },
        headers: { 'Authorization': 'bearer ' + JSON.parse(localStorage.getItem('blogAppUser')).token }
      })
        .then(function() {
          cy.visit('http://localhost:3000')
          cy.get('.blogContainer')
            .then(function(blogList) {
              // Check if blogs are in correct order
              cy.wrap(blogList[0]).contains('test-title-2')
              cy.wrap(blogList[1]).contains('test-title-1')
              // Clike like-button on "title-1" twice
              cy.wrap(blogList[1]).contains('test-title-1').click()
              cy.wrap(blogList[1]).contains('+ Like').click()
              cy.wait(1000)
              cy.wrap(blogList[1]).contains('+ Like').click()
              cy.wait(1000)
              cy.get('.blogContainer')
                .then(function(blogList2) {
                  cy.wrap(blogList2[0]).contains('test-title-1')
                  cy.wrap(blogList2[1]).contains('test-title-2')
                })
            })
        })
    })
  })

})
