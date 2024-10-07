require('dotenv').config()

let PORT = 3001
let MONGODB_URI = "mongodb+srv://fs_user:fs_pass@blogilista.epupm49.mongodb.net/?retryWrites=true&w=majority&appName=blogilista"

module.exports = {
  MONGODB_URI,
  PORT
}