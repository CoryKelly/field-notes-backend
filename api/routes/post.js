const express = require('express')
const cors = require('cors')
const { Types } = require('mongoose')
const multer = require('multer')
const consola = require('consola')
const router = express.Router()

const corsOptions = {
  origin: 'https://fieldnotes-f0ccd.web.app',
  optionsSuccessStatus: 200
}

// Image Upload Config
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './static/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// Mongoose Models
const Post = require('../models/post')


// GET ALL POST
router.get('/', cors(corsOptions), (req, res) => {
  Post.find().select('_id title notes task product amount units mowHeight date photo zone').exec().then(result => {
    const response = {
      count: result.length,
      post: result
    }
    res.status(200).json(response)
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
})

// POST NEW POST
router.post('/createPost', cors(corsOptions), upload.single('photo') , (req, res) => {
  const post = new Post({
    _id: new Types.ObjectId(),
    title: req.body.title,
    notes: req.body.notes,
    task: req.body.task,
    product: req.body.product,
    amount: req.body.amount,
    units: req.body.units,
    zone: req.body.zone,
    mowHeight: req.body.mowHeight,
    date: req.body.date,
    photo: req.file.path
  })

  // Save Post
  post.save().then( result => {
    const { _id, title, notes, task, product, amount, units, mowHeight, date, photo, zone } = result;
    res.status(201).json({
        title, notes, task, photo, _id, product, amount, units, mowHeight, date, zone
      })
  }).catch((err) => {
    consola.error(`Unable to save post to DB ${err}`)
  })
})

// GET POST BY ID
router.get('/:postId', cors(corsOptions), (req, res) => {
  const { postId: id } = req.params;
  Post.findById(id).select('_id title notes task product amount units mowHeight date photo zone').exec().then(result => {
    if(result) {
      res.status(201).json({
        post: result
      })
    } else {
      res.status(400).json({message: 'No valid entry found for provided ID' })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
})

// UPDATE Post
router.patch('/:postId', cors(corsOptions), (req, res) => {
  const { postId: id } = req.params;
  Post.updateOne({ _id: id }, { $set: req.body }).exec().then(() => {
    res.status(200).json({
      message: 'Post Updated Successfully'
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

// DELETE Post
router.delete('/:postId', cors(corsOptions), (req, res) => {
  const { postId: id } = req.params;
  Post.deleteOne({_id: id}).exec().then(() => {
    res.status(200).json({
      message: 'Post deleted successfully'
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

module.exports = router;
