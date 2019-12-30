const express = require('express')
const path = require('path')
const parentsService = require('./parents-service')

const {requireAuth} = require('../middleware/jwt-auth')

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

  parentsRouter 
    .route('/:login_id')
    .get((req, res, next) => {
      parentsService.getByLoginId(
        req.app.get('db'),
        req.params.login_id
      )
        .then(parent => {
          res.json(parent)
        })
        .catch(next)
    })

parentsRouter
  .route('/:parent_id/children/')
  //.all(requireAuth)
  .get((req, res, next) => {
    parentsService.getChildrenForParent(
      req.app.get('db'),
      req.params.parent_id
    )
    .then(children => {
      res.json(children)
    })
    .catch(next)
  })

module.exports = parentsRouter