const express = require('express')
const path = require('path')
const tasksService = require('./tasks-service')

const { requireAuth } = require('../middleware/jwt-auth')

const tasksRouter = express.Router()
const jsonParser = express.json()

tasksRouter
  .route('/')
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { name, difficulty, reward, current_status } = req.body
    const newTask = { name, difficulty, reward, current_status }
    for (const [key, value] of Object.entries(newTask))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    newTask.child_id = req.body.child_id

    tasksService.insertTask(
      req.app.get('db'),
      newTask
    )
      .then(task => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${task.id}`))
          .json(tasksService.serializeTask(task))
      })
      .catch(next)
  })

tasksRouter
  .route('/:task_id')
  .all(requireAuth, (req, res, next) => {
    tasksService.getById(
        req.app.get('db'),
        req.params.task_id
    )
      .then(task => {
        if(!task) {
          return res.status(404).json({
              error: { message: `Task doesn't exist`}
          })
        }
        res.task = task
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(tasksService.serializeTask(res.task))
  })
  .delete((req, res, next) => {
    tasksService.deleteTask(
        req.app.get('db'),
        req.params.task_id
    )
      .then(() => {
        res.status(204).end()
      }) 
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const current_status = req.body
    const taskToUpdate = current_status
    const numberOfValues = Object.values(current_status).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                
                error: { message: `${req.body} Request body must contain 'current_status'`}
            })
        }

        tasksService.updateTask(
          req.app.get('db'),
          req.params.task_id,
          taskToUpdate
        ) 
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)

  })

module.exports = tasksRouter