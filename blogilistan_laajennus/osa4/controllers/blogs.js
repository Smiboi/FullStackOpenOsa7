const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  // console.log('request.token:', request.token)
  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id) // VANHA
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.likes) {
    blog.likes = 0
  }

  if (!blog.title || !blog.url) {
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)  
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  // const user = await User.findById(decodedToken.id) // VANHA
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  // console.log('user:', user)
  // console.log('user._id.toString():', user._id.toString())
  // const bloginUserId = await request.params.user.id.toString()
  // const xxxxx = await request.params
  // console.log('request.params.user.id.toString():', request.params.user.id.toString())
  // console.log('blogUserId:', blog.user.toString())

  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'not authorized to delete' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter
