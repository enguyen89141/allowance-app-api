const express = require('express')
const childrenService = require('./children-service')

const childrenRouter = express.Router()
const jsonParser = express.json()

childrenRouter
  .route('/')
  .get((req, res, next) => {
    childrenService.getAllChildren(
      req.app.get('db')
    )
    .then(children => {
      res.json(children)
    })
    .catch(next)
  })
  
module.exports = childrenRouter