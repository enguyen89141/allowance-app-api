const knex = require('knex')
const app = require('../src/app')
const { makeLoginsArray, makeParentsArray } = require('./test-helpers')

describe('Parents endpoints', function() {
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE parents RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE parents RESTART IDENTITY CASCADE'))

  describe(`GET /api/parents`, () => {

    context(`Given no parents`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
            .get('/api/parents')
            .expect(200, [])
      })
    })

    context(`Given there are parents in the database`, () => {
      const testLogins = makeLoginsArray()
      const testParents = makeParentsArray()
      beforeEach('insert logins', () => {
        return db
          .into('logins')
          .insert(testLogins)
      })
      beforeEach('insert parents', () => {
        return db
          .into('parents')
          .insert(testParents)
      })

      it('responds with 200 and all of the parents', () => {
        return supertest(app)
          .get('/api/parents')
          .expect(200, testParents)
      })
    })
  })
  
})