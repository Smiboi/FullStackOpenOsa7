const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://user:${password}@blogilista.epupm49.mongodb.net/testBlogApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
//   title: 'Jeren metästys blogi',
  author: "Jere Jänis",
  url: "https://www.metälle.org",
  likes: 40
})

blog.save().then(() => {
  console.log('blog saved!')
  mongoose.connection.close()
})

// Blog.find({}).then(result => {
//   result.forEach(blog => {
//     console.log(blog)
//   })
//   mongoose.connection.close()
// })
