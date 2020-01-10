const knex = require('knex')
const app = require('../src/app')
const bcrypt = require('bcryptjs')
const helpers = require('./test-helpers')

describe('Logins endpoints', function () {
  let db

  const testLogins = helpers.makeLoginsArray()
  const testLogin = testLogins[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE logins RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE logins RESTART IDENTITY CASCADE'))

  describe(`POST /api/logins`, () => {

    context(`Login validation`, () => {
      beforeEach('insert logins', () =>
        helpers.seedLogins(
          db,
          testLogins
        )
      )

      const requiredFields = ['username', 'password', 'account']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username1',
          password: 'test password',
          account: '0',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {

          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/logins')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const loginShortPassword = {
          username: 'test username1',
          password: '1234567',
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(loginShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` })
      })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const loginLongPassword = {
          username: 'test username1',
          password: '*'.repeat(73),
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(loginLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` })
      })

      it(`responds 400 error when password starts with spaces`, () => {
        const loginPasswordStartsSpaces = {
          username: 'test username1',
          password: ' 1Aa!2Bb@',
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(loginPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password ends with spaces`, () => {
        const loginPasswordEndsSpaces = {
          username: 'test username1',
          password: '1Aa!2Bb@ ',
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(loginPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
        const loginPasswordNotComplex = {
          username: 'test username1',
          password: '11AAaabb',
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(loginPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
      })

      it(`responds 400 'Username already taken' when username isn't unique`, () => {
        const duplicateLogin = {
          username: testLogin.username,
          password: '11AAaa!!',
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(duplicateLogin)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newLogin = {
          username: 'test username2',
          password: '11AAaa!!',
          account: '0'
        }
        return supertest(app)
          .post('/api/logins')
          .send(newLogin)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newLogin.username)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/logins/${res.body.id}`)
          })
          .expect(res =>
            db
              .from('logins')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newLogin.username)
                return bcrypt.compare(newLogin.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
})
