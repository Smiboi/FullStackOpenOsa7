const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) {
    return null
  }
  let mostLikes = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > mostLikes.likes) {
      mostLikes = blogs[i]
    }
  }
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes
  }
}

const mostBlogs = (blogs) => {
  if(blogs.length < 1) {
    return null
  }
  const authors = lodash.countBy(blogs, blog => blog.author)
  let mostBlogsAuthor = ""
  let mostBlogsAuthorBlogs = 0
  for (let i in authors) {
    if (authors[i] > mostBlogsAuthorBlogs) {
        mostBlogsAuthor = i
        mostBlogsAuthorBlogs = authors[i]
    }
  }
  return {
    author: mostBlogsAuthor,
    blogs: mostBlogsAuthorBlogs
  }
}

const mostLikes = (blogs) => {
  if(blogs.length < 1) {
    return null
  }
  const authors = lodash.groupBy(blogs, blog => blog.author)
  let mostLikesAuthor = ""
  let mostLikesAuthorLikes = 0
  for (let i in authors) {
    let sumOfLikes = lodash.sum(authors[i].map(blog => blog.likes))
    if (sumOfLikes > mostLikesAuthorLikes) {
        mostLikesAuthor = i
        mostLikesAuthorLikes = sumOfLikes
    }
  }
  return {
    author: mostLikesAuthor,
    likes: mostLikesAuthorLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
