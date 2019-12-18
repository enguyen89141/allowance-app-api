const express = require('express')
const parentsService = require('./parents-service')

const parentsRouter = express.Router()
const jsonParser = express.json()

parentsRouter
  .route('/')
  .get((req, res, next) => {
    parentsService.getAllParents(
      req.app.get('db')
    )
    .then(parents => {
      res.json(parents)
    })
    .catch(next)
  })

module.exports = parentsRouter