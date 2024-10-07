describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Matti Meikäläinen',
      username: 'masa',
      password: 'meikä'
    }
    const user2 = {
      name: 'Maija Teikäläinen',
      username: 'maja',
      password: 'teikä'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('login to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('masa')
      cy.get('#password').type('meikä')
      cy.get('#login-button').click()
      cy.contains('Matti Meikäläinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('masa')
      cy.get('#password').type('meikäläinen')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in and there is at least one blog in the list', function() {
    beforeEach(function() {
      cy.get('#username').type('masa')
      cy.get('#password').type('meikä')
      cy.get('#login-button').click()
      cy.contains('create new blog').click()
      cy.get('#title').type('Awesome blog')
      cy.get('#author').type('Jared Johnson')
      cy.get('#url').type('www.something.com')
      cy.get('#create-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Hieno blogi')
      cy.get('#author').type('Jarmo Manner')
      cy.get('#url').type('www.jotain.fi')
      cy.get('#create-button').click()
      cy.contains('Hieno blogi by Jarmo Manner')
    })

    it('A blog can be liked', function() {
      cy.contains('Awesome blog by Jared Johnson').contains('view').click()
      cy.contains('Awesome blog by Jared Johnson').contains('like').click()
      cy.contains('Awesome blog by Jared Johnson').contains('likes: 1')
    })

    it('A blog can be deleted by its creator', function () {
      cy.contains('Awesome blog by Jared Johnson').contains('view').click()
      cy.contains('Awesome blog by Jared Johnson').contains('remove').click()
      cy.get('html').should('not.contain', 'Awesome blog by Jared Johnson')
    })

    it('A remove button of a blog cannot be seen by others than the creator', function () {
      cy.get('#logout-button').click()
      cy.get('#username').type('maja')
      cy.get('#password').type('teikä')
      cy.get('#login-button').click()
      cy.contains('Awesome blog by Jared Johnson').contains('view').click()
      cy.get('html').should('not.contain', 'remove')
    })
  })

  describe('When logged in and there is multiple blogs in the list', function() {
    beforeEach(function() {
      cy.get('#username').type('masa')
      cy.get('#password').type('meikä')
      cy.get('#login-button').click()
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog with 1 like')
      cy.get('#author').type('Kyösti Ykkönen')
      cy.get('#url').type('www.1.com')
      cy.get('#create-button').click()
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog with 0 likes')
      cy.get('#author').type('Kyösti Nollanen')
      cy.get('#url').type('www.0.com')
      cy.get('#create-button').click()
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog with 2 likes')
      cy.get('#author').type('Kyösti Kakkonen')
      cy.get('#url').type('www.2.com')
      cy.get('#create-button').click()
    })

    it('Blogs are sorted by likes', function() {
      cy.contains('Blog with 1 like by Kyösti Ykkönen').contains('view').click()
      cy.contains('Blog with 1 like by Kyösti Ykkönen').contains('like').click()
      cy.contains('Blog with 2 likes by Kyösti Kakkonen').contains('view').click()
      cy.contains('Blog with 2 likes by Kyösti Kakkonen').contains('like').click()
      cy.contains('Blog with 2 likes by Kyösti Kakkonen').contains('likes: 1')
      cy.contains('Blog with 2 likes by Kyösti Kakkonen').contains('like').click()
      cy.get('.blog').eq(0).should('contain', 'Blog with 0 likes by Kyösti Nollanen')
      cy.get('.blog').eq(1).should('contain', 'Blog with 1 like by Kyösti Ykkönen')
      cy.get('.blog').eq(2).should('contain', 'Blog with 2 likes by Kyösti Kakkonen')
    })
  })
})
