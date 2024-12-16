const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('blog tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned notes', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      'Jarkon ploki'
    )
  })

  test('blog has an id', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body[0].id).toBeDefined()
  })

  test('blog cannot be added without token', async () => {
    const newBlog = {
      title: 'Roskaruokablogi',
      author: 'MC Donald',
      url: 'https://www.ruokea.fi',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a valid blog can be added', async () => {
    // const blogit = await helper.blogsInDb()
    // const userit = await helper.usersInDb()
    // const useri = userit[0]
    // const id = useri.id
    // console.log('blogs:', blogit)
    // console.log('users:', userit)
    // console.log('useri:', useri)
    // console.log('id:', id)
    // const newBlog = await {
    //   title: 'Roskaruokablogi',
    //   author: 'MC Donald',
    //   url: 'https://www.ruokea.fi',
    //   likes: 6,
    //   user: id
    // }

    const newUser = {
      username: 'uusi',
      name: 'Uusi Ukko',
      password: 'salasana',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newLogin = {
      username: 'uusi',
      password: 'salasana'
    }

    // const userit = await helper.usersInDb()
    // console.log('userit:', userit)

    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token

    const newBlog = {
      title: 'Roskaruokablogi',
      author: 'MC Donald',
      url: 'https://www.ruokea.fi',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'Roskaruokablogi'
    )
  })

  test('if likes not set, set likes to zero', async () => {
    const newUser = {
      username: 'uusi2',
      name: 'Uusi Ukkonen',
      password: 'salasana2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newLogin = {
      username: 'uusi2',
      password: 'salasana2'
    }

    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token

    const newBlog = {
      title: 'Roskaruokablogi',
      author: 'MC Donald',
      url: 'https://www.ruokea.fi'
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[2].likes).toBe(0)
  })

  test('blog without title or url is not added', async () => {
    const newUser = {
      username: 'uusi4',
      name: 'Uutinen Ukkonen',
      password: 'salasana4',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newLogin = {
      username: 'uusi4',
      password: 'salasana4'
    }

    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token

    const newBlog1 = {
      title: 'Roskaruokablogi',
      author: 'MC Donald',
      likes: 6
    }
    const newBlog2 = {
      author: 'MC Donald',
      url: 'https://www.ruokea.fi',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog1)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)
    await api
      .post('/api/blogs')
      .send(newBlog2)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
    const newUser = {
      username: 'uusi3',
      name: 'Uutinen Ukko',
      password: 'salasana3',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newLogin = {
      username: 'uusi3',
      password: 'salasana3'
    }

    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token

    const newBlog = {
      title: 'Roskaruokablogi',
      author: 'MC Donald',
      url: 'https://www.ruokea.fi',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()

    // console.log('blogsAtStart:', blogsAtStart)

    const blogToDelete = blogsAtStart[2]

    // console.log('blogToDelete:', blogToDelete)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('updating likes of a blog succeeds with status code 200 and likes are updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
      title: 'Jarkon ploki',
      author: 'Jarkko Jurkka',
      url: "https://www.jartsunosote.com",
      likes: 100
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toBe(100)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'me',
      name: 'Matti Meikäläinen',
      password: 'salainen',
    }
    const newUser2 = {
      username: 'meikä',
      name: 'Matti Meikäläinen',
      password: 'on',
    }

    const result1 = await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('username and password must be at least 3 characters long')

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('username and password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
