const knex = require('knex')
const app = require('../src/app')
const { makeChildrenArray, makeParentsArray } = require('./test-helpers')

describe('Children endpoints', function() {
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE children RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE children RESTART IDENTITY CASCADE'))

  describe(`GET /api/children`, () => {

    context(`Given no children`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
            .get('/api/children')
            .expect(200, [])
      })
    })

    context(`Given there are children in the database`, () => {
      const testChildren = makeChildrenArray()
      const testParents = makeParentsArray()
      beforeEach('insert parents', () => {
        return db
          .into('parents')
          .insert(testParents)
      })
      beforeEach('insert children', () => {
        return db
          .into('children')
          .insert(testChildren)
      })

      it('responds with 200 and all of the children', () => {
        return supertest(app)
          .get('/api/children')
          .expect(200, testChildren)
      })
    })
  })
  
})