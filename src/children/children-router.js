const express = require('express')
const path = require('path')
const childrenService = require('./children-service')

const {requireAuth} = require('../middleware/jwt-auth')

const childrenRouter = express.Router()
const jsonParser = express.json()

childrenRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const { first_name, last_name, email } = req.body
    const newChild = { first_name, last_name, email }
    for (const [key, value] of Object.entries(newChild))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    newChild.login_id = req.body.login_id
    newChild.parent_id = req.body.parent_id

    childrenService.insertChild(
      req.app.get('db'),
      newChild
    )
      .then(child => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${child.id}`))
          .json(childrenService.serializeChild(child))
      })
      .catch(next)
  })

  childrenRouter
    .route('/:login_id')
    .get((req, res, next) => {
      childrenService.getById(
        req.app.get('db'),
        req.params.login_id
      )
      .then(child => {
        res.json(child)
      })
      .catch(next)
    })

childrenRouter
  .route('/:child_id/tasks')
  .all(requireAuth)
  .get((req, res, next) => {
    childrenService.getTasksForChild(
      req.app.get('db'),
      req.params.child_id
    )
    .then(tasks => {
      res.json(tasks)
    })
    .catch(next)
  })
  
module.exports = childrenRouter