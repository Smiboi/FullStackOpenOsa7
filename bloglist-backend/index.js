const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')

// const http = require('http')

// const PORT = process.env.PORT // vanha
// app.listen(PORT, () => { // vanha
//   console.log(`Server running on port ${PORT}`) // vanha
// }) // vanha

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
