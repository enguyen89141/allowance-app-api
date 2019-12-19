const express = require('express')
const path = require('path')
const parentsService = require('./parents-service')

const parentsRouter = express.Router()
const jsonParser = express.json()

parentsRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const { first_name, last_name, email } = req.body
    const newParent = { first_name, last_name, email }
    for (const [key, value] of Object.entries(newParent))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    newParent.login_id = req.body.login_id
      

    parentsService.insertParent(
      req.app.get('db'),
      newParent
    )
      .then(parent => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${parent.id}`))
          .json(parentsService.serializeParent(parent))
      })
      .catch(next)
  })

module.exports = parentsRouter