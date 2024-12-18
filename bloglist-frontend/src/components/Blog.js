import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
} from '@mui/material'

const Blog = ({ blog, addLike, removeBlog }) => {
  const [viewInfo, toggleInfo] = useState(false)
  const label = viewInfo ? 'hide' : 'view'
  const color = viewInfo ? 'secondary' : 'primary'
  return (
    <div className="blog">
      <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      <Button variant="contained" color={color} onClick={() => toggleInfo(!viewInfo)}>{label}</Button>
      {viewInfo && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}
            <Button variant="contained" color="success" onClick={addLike}>like</Button>
          </div>
          <div>{blog.user.name}</div>
          <Button variant="contained" color="secondary" onClick={() => removeBlog(blog)}>remove</Button>
        </div>
      )}
    </div>
  )
}

export default Blog
