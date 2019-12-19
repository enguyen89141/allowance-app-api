const express = require('express')
const path = require('path')
const loginsService = require('./logins-service')

const loginsRouter = express.Router()
const jsonParser = express.json()

loginsRouter
  .post('/', jsonParser, (req, res, next) => {
    const { username, password, account } = req.body
    for (const field of ['username', 'password', 'account'])
      if(!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      })

      const passwordError = loginsService.validatePassword(password)

      if(passwordError)
        return res.status(400).json({ error: passwordError})

      loginsService.hasLoginWithUsername(
        req.app.get('db'),
        username
      )
        .then(hasLoginWithUsername => {
          if(hasLoginWithUsername)
            return res.status(400).json({ error: `Username already taken`})

          return loginsService.hashPassword(password)
            .then(hashedPassword => {
              const newLogin ={
                username,
                password: hashedPassword,
                account
              }
              return loginsService.insertLogin(
                req.app.get('db'),
                newLogin
              )
                .then(login => {
                  res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${login.id}`))
                    .json(loginsService.serializeLogin(login))
                })
            })
        })
        .catch(next)
  })

module.exports = loginsRouter