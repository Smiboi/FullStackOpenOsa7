import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const loadUser = () => {
  const user = window.localStorage.getItem('loggedBlogappUser')
  return user ? JSON.parse(user) : null
}

const getConfit = () => ({
  headers : { Authorization: `Bearer ${loadUser().token}` }
})

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfit())
  return response.data
}

export default { getAll, setToken, create, update, remove }
