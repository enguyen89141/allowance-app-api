const knex = require('knex')
const app = require('../src/app')
const { makeChildrenArray, makeParentsArray, makeTasksArray } = require('./test-helpers')

describe('Tasks endpoints', function() {
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE tasks RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE tasks RESTART IDENTITY CASCADE'))

  describe(`GET /api/tasks`, () => {

    context(`Given no tasks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
            .get('/api/tasks')
            .expect(200, [])
      })
    })

    context(`Given there are tasks in the database`, () => {
      const testChildren = makeChildrenArray()
      const testParents = makeParentsArray()
      const testTasks = makeTasksArray()
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
      beforeEach('insert tasks', () => {
        return db
          .into('tasks')
          .insert(testTasks)
      })

      it('responds with 200 and all of the children', () => {
        return supertest(app)
          .get('/api/tasks')
          .expect(200, testTasks)
      })
    })
  })
  
})