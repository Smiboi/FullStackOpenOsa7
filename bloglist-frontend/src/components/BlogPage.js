import blogService from '../services/blogs'
import { useParams } from 'react-router-dom'

const BlogPage = ({ blogs, users, setBlogs }) => {
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const user = users.find(u => u.id === blog.user.id)
  const addLike = async () => {
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    const returnedBlog = await blogService.update(id, changedBlog)
    setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
  }

  if (!blog || !user) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button onClick={addLike}>like</button>
      </div>
      <div>added by {user.name}</div>
      <h3>comments</h3>
      <ul>
        {blog.comments
          .map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
      </ul>
    </div>
  )
}

export default BlogPage
