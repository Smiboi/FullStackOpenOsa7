import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    // try {
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    // } catch (exception) {
    //   setErrorMessage('invalid input')
    //   setTimeout(() => {
    //     setErrorMessage(null)
    //   }, 5000)
    // }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <>title:</>
          <input
            id='title'
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='title of the blog'
          />
        </div>
        <div>
          <>author:</>
          <input
            id='author'
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='author of the blog'
          />
        </div>
        <div>
          <>url:</>
          <input
            id='url'
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='url of the blog'
          />
        </div>
        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
