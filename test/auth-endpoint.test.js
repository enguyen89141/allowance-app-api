const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth endpoints', function () {
  let db

  const testLogins = helpers.makeLoginsArray()
  const testLogin = testLogins[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/auth/login`, () => {
    beforeEach('insert logins', () =>
      helpers.seedLogins(
        db,
        testLogins
      ))

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testLogin.username,
        password: testLogin.password,
      }
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })

      it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
        const userInvalidUser = { username: 'user-not', password: 'existy' }
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidUser)
          .expect(400, { error: `Incorrect user_name or password` })
      })
  
      it(`responds 400 'invalid user_name or password' when bad password`, () => {
        const userInvalidPass = { username: testLogin.username, password: 'incorrect' }
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidPass)
          .expect(400, { error: `Incorrect user_name or password` })
      })
      it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
        
        const userValidCreds = {
          username: testLogin.username,
          password: testLogin.password,
        }
        const expectedToken = jwt.sign(
          { login_id: testLogin.id }, // payload
          process.env.JWT_SECRET,
          {
            subject: testLogin.username,
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: 'HS256',
          }
        )
        return supertest(app)
          .post('/api/auth/login')
          .send(userValidCreds)
          .expect(200, {
            authToken: expectedToken,
          })
      })
    })
  })
})