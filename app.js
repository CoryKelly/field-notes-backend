const express = require('express')
const { expressCspHeader } = require('express-csp-header')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const consola = require('consola')
const mongoose = require('mongoose')
require('dotenv').config()
const port = process.env.PORT || 3000

// Routes
const postRoutes = require('./api/routes/post')

// Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Headers", '*');

  console.log('middleware hit!')

  if(req.method === 'OPTIONS') {
    res.send()
  } else {
    next();
  }
})
app.use(morgan('dev'))
app.use(expressCspHeader({
  directives: {
    'img-src': ['static', 'localhost:3000']
  }
}));
app.use('/static/', express.static('static'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// Routes
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
    app.listen(port, () => {
      consola.success(`App listening at http://localhost:${port}`)
    })
  } catch (e) {
    consola.error(`Unable to start the server ${e.message}`)
  }
}

main().then()

