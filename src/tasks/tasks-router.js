const express = require('express')
const path = require('path')
const tasksService = require('./tasks-service')

const tasksRouter = express.Router()
const jsonParser = express.json()

tasksRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const { name, difficulty, reward, current_status } = req.body
    const newTask = {name, difficulty, reward, current_status}
    for (const [key, value] of Object.entries(newTask))
      if(value == null)
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

module.exports = tasksRouter