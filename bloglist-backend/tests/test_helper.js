const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    blogs: [],
    username: "tarzan",
    name: "Tarmo Sukkula",
    password: "pass"
  }
]

const initialBlogs = [
  {
    title: 'Jarkon ploki',
    author: 'Jarkko Jurkka',
    url: "https://www.jartsunosote.com",
    likes: 56
  },
  {
    title: 'Näin se elämä makaa',
    author: 'Hellevi Hälläväliä',
    url: "https://www.elämä.com",
    likes: 2
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon',  author: 'Will Removethissoon',  title: 'https://www.willremovethissoon.com',  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialUsers, initialBlogs, nonExistingId, blogsInDb, usersInDb
}
