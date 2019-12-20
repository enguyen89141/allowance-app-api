const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Tasks endpoints', function () {
  let db


  const testLogins = helpers.makeLoginsArray()
  const testParents = helpers.makeParentsArray()
  const testChildren = helpers.makeChildrenArray()
  const testTasks = helpers.makeTasksArray()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/tasks`, () => {
    beforeEach('insert logins', () =>
      helpers.seedLogins(
        db,
        testLogins
      ))
    beforeEach('insert parents', () =>
      helpers.seedParents(
        db,
        testParents
      ))
    beforeEach('insert children', () =>
      helpers.seedChildren(
        db,
        testChildren
      ))
    beforeEach('insert tasks', () =>
      helpers.seedTasks(
        db,
        testTasks
      ))

    it(`creates a task, responding with 201 and the new task`, function () {
      this.retries(3)
      const testChild = testChildren[0]
      const newTask = {
        name: 'Test new task name',
        difficulty: 3,
        reward: 6,
        current_status: 'pending',
        child_id: testChild.id
      }
      return supertest(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.name).to.eql(newTask.name)
          expect(res.body.difficulty).to.eql(newTask.difficulty)
          expect(res.body.reward).to.eql(newTask.reward)
          expect(res.body.current_status).to.eql(newTask.current_status)
          expect(res.body.child_id).to.eql(newTask.child_id)
          expect(res.headers.location).to.eql(`/api/tasks/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('tasks')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.name).to.eql(newTask.name)
              expect(row.difficulty).to.eql(newTask.difficulty)
              expect(row.reward).to.eql(newTask.reward)
              expect(row.current_status).to.eql(newTask.current_status)
              expect(row.child_id).to.eql(newTask.child_id)
            })
        )
  })
  const requiredFields = ['name', 'difficulty', 'reward', 'current_status']

    requiredFields.forEach(field => {
      const testChild = testChildren[0]
      const newTask = {
        name: 'Test new task name',
        difficulty: '3',
        reward: '6',
        current_status: 'pending',
        child_id: testChild.id
      }

      it(`responds with 400 and error message when the '${field}' is missing`, () => {
        delete newTask[field]

        return supertest(app)
          .post('/api/tasks')
          .send(newTask)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})