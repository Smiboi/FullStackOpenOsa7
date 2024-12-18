import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import UserPage from './components/UserPage'
import BlogPage from './components/BlogPage'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import InfoNotification from './components/InfoNotification'
import ErrorNotification from './components/ErrorNotification'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material'
import styled from 'styled-components'

const Page = styled.div`
padding: 1em;
background: papayawhip;
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  // const [newTitle, setNewTitle] = useState('')
  // const [newAuthor, setNewAuthor] = useState('')
  // const [newUrl, setNewUrl] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
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

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
    })

    setInfoMessage(
      `a new blog ${blogObject.title} from ${blogObject.author} added`,
    )
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
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

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
    const blog = blogs.find((b) => b.id === id)
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
    setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
    // console.log('blogs after:', blogs)
    // blogService
    //   .update(id, changedBlog).then(returnedBlog => {
    //     setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    //   })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.remove(blog.id, blogService.setToken(user.token)).then(() => {
        setBlogs(blogs.filter((single_blog) => single_blog.id !== blog.id))
      })
    }
  }

  const blogFormRef = useRef()

  const Blogs = () => (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h2>Blogs</h2>
      {blogs
        .sort((blog1, blog2) => blog1.likes - blog2.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={() => addLike(blog.id)}
            removeBlog={removeBlog}
          />
        ))}
    </div>
  )

  // const User = ({ user }) => {
  //   return (
  //     <tbody>
  //       <tr>
  //         <td>
  //           <Link to={`/users/${user.id}`}>{user.name}</Link>
  //         </td>
  //         <td>{user.blogs.length}</td>
  //       </tr>
  //     </tbody>
  //   )
  // }

  const Users = () => (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell><b>blogs created</b></TableCell>
            </TableRow>
          </TableHead>
          {users
            .sort((user1, user2) => user2.blogs.length - user1.blogs.length)
            .map((user) => (
              <TableBody key={user.id}>
                <TableRow>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              </TableBody>
            ))}
        </Table>
      </TableContainer>
    </div>
  )

  if (user === null) {
    return (
      <Page>
        <div>
          <h2>login to application</h2>

          <InfoNotification message={infoMessage} />
          <ErrorNotification message={errorMessage} />

          <form onSubmit={handleLogin}>
            <div>
              <TextField
                label="username"
                id="username"
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <TextField
                label="password"
                id="password"
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <Button variant="contained" color="primary" id="login-button" type="submit">
              login
            </Button>
          </form>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
              <Button color="inherit" component={Link} to="/">
                blogs
              </Button>
              <Button color="inherit" component={Link} to="/users">
                users
              </Button>
            </Toolbar>
          </AppBar>
          <form onSubmit={handleLogout}>
            <div>
              <>{user.name} logged in </>
              <Button variant="contained" color="secondary" id="logout-button" type="submit">
                logout
              </Button>
            </div>
          </form>
        </div>

        <div>
          <h1>blog app</h1>

          <InfoNotification message={infoMessage} />
          <ErrorNotification message={errorMessage} />

        </div>

        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserPage users={users} />} />
          <Route path="/blogs/:id" element={<BlogPage blogs={blogs} users={users} setBlogs={() => setBlogs(blogs)}/>} />
        </Routes>
      </Router>
    </Page>
  )
}

export default App
