const express = require('express')
const { expressCspHeader } = require('express-csp-header');
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const { json, urlencoded } = require('body-parser')
const consola = require('consola')
const mongoose = require('mongoose')
require('dotenv').config()

// Routes
const postRoutes = require('./api/routes/post')


// Middleware
app.use(morgan('dev'))
app.use(expressCspHeader({
  directives: {
    'img-src': ['static', 'localhost:3000']
  }
}));
app.use('/static/', express.static('static'))
app.use(urlencoded({extended: false}))
app.use(json())
app.use(cors())
app.use('/posts', postRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// Connect DB & Start Server
const main = async () => {
  try{
    await mongoose.connect(process.env.APP_DB, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    })
    consola.success("DataBase Connected..")
    app.listen(process.env.PORT || 3000, () => {
      consola.success(`App listening at http://localhost:${process.env.PORT}`)
    })
  } catch (e) {
    consola.error(`Unable to start the server ${e.message}`)
  }
}
main().then()

