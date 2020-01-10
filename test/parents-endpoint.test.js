const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Parents endpoints', function () {
  let db

  const testLogins = helpers.makeLoginsArray()
  const testParents = helpers.makeParentsArray()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))


  describe(`POST /api/parents`, () => {
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

    it(`creates a parent, responding with 201 and the new parent`, function () {
      this.retries(3)
      const testLogin = testLogins[4]
      const newParent = {
        first_name: 'Test new parent',
        last_name: 'Test new last name',
        email: 'Test new email',
        login_id: testLogin.id,
      }
      return supertest(app)
        .post('/api/parents')
        .send(newParent)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.first_name).to.eql(newParent.first_name)
          expect(res.body.last_name).to.eql(newParent.last_name)
          expect(res.body.email).to.eql(newParent.email)
          expect(res.body.login_id).to.eql(newParent.login_id)
          expect(res.headers.location).to.eql(`/api/parents/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('parents')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.first_name).to.eql(newParent.first_name)
              expect(row.last_name).to.eql(newParent.last_name)
              expect(row.email).to.eql(newParent.email)
              expect(row.login_id).to.eql(newParent.login_id)
            })
        )
    })

    const requiredFields = ['first_name', 'last_name', 'email']

    requiredFields.forEach(field => {
      const testLogin = testLogins[5]
      const newParent = {
        first_name: 'Test new child',
        last_name: 'Test new child last name',
        email: 'Test new child email',
        login_id: testLogin.id,
      }

      it(`responds with 400 and error message when the '${field}' is missing`, () => {
        delete newParent[field]

        return supertest(app)
          .post('/api/children')
          .send(newParent)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})