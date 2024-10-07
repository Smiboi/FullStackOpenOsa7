import axios from 'axios'

const login = async (credentials) => {
  const response = await axios.post('http://localhost:3001/api/login', credentials)
  return response.data
}

export default { login }