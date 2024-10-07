import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog }) => {
  const [viewInfo, toggleInfo] = useState(false)
  const label = viewInfo
    ? 'hide'
    : 'view'
  return (
    <div className="blog">
      {blog.title} by {blog.author}
      <button onClick={() => toggleInfo(!viewInfo)}>{label}</button>
      { viewInfo &&
        <div>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}
            <button onClick={addLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
      }
    </div>
  )
}

export default Blog
