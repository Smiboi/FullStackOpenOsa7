import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import InfoNotification from './components/InfoNotification'
import ErrorNotification from './components/ErrorNotification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newTitle, setNewTitle] = useState('')
  // const [newAuthor, setNewAuthor] = useState('')
  // const [newUrl, setNewUrl] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    // try {
    // const blogObject = {
    //   title: newTitle,
    //   author: newAuthor,
    //   url: newUrl
    // }
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    setInfoMessage(`a new blog ${blogObject.title} from ${blogObject.author} added`)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
    // } catch (exception) {
    //   setErrorMessage('invalid input')
    //   setTimeout(() => {
    //     setErrorMessage(null)
    //   }, 5000)
    // }
  }

  // const handleTitleChange = (event) => {
  //   setNewTitle(event.target.value)
  // }

  // const handleAuthorChange = (event) => {
  //   setNewAuthor(event.target.value)
  // }

  // const handleUrlChange = (event) => {
  //   setNewUrl(event.target.value)
  // }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (/*event*/) => {
    // try {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(user)
    setUsername('')
    setPassword('')
    // } catch (exception) {
    //   setErrorMessage('wrong credentials')
    //   setTimeout(() => {
    //     setErrorMessage(null)
    //   }, 5000)
    // }
  }

  const addLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    console.log('changedBlog:', changedBlog)
    // console.log('blogs before:', blogs)

    const returnedBlog = await blogService.update(id, changedBlog)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    // console.log('blogs after:', blogs)
    // blogService
    //   .update(id, changedBlog).then(returnedBlog => {
    //     setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    //   })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(blog.id, blogService.setToken(user.token))
        .then(() => {
          setBlogs(blogs.filter(single_blog => single_blog.id !== blog.id))
        })
    }
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>login to application</h2>

        <InfoNotification message={infoMessage} />
        <ErrorNotification message={errorMessage} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h1>blogs</h1>

      <InfoNotification message={infoMessage} />
      <ErrorNotification message={errorMessage} />

      <form onSubmit={handleLogout}>
        <div>
          <>{user.name} logged in</>
          <button id="logout-button" type="submit">logout</button>
        </div>
      </form>

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>

      <h2>blog list</h2>
      {blogs.sort((blog1, blog2) => blog1.likes - blog2.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLike(blog.id)}
          removeBlog={removeBlog}
        />
      )}
    </div>
  )
}

export default App
