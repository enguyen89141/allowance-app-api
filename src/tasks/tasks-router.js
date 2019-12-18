const express = require('express')
const tasksService = require('./tasks-service')

const tasksRouter = express.Router()
const jsonParser = express.json()

tasksRouter
  .route('/')
  .get((req, res, next) => {
    tasksService.getAllTasks(
      req.app.get('db')
    )
    .then(tasks => {
      res.json(tasks)
    })
    .catch(next)
  })

module.exports = tasksRouter