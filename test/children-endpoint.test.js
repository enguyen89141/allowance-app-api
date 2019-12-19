const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Children endpoints', function () {
  let db

  const testLogins = helpers.makeLoginsArray()
  const testParents = helpers.makeParentsArray()
  const testChildren = helpers.makeChildrenArray()

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

  describe(`POST /api/children`, () => {
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

    it(`creates a child, responding with 201 and the new child`, function () {
      this.retries(3)
      const testLogin = testLogins[5]
      const testParent = testParents[0]
      const newChild = {
        first_name: 'Test new child',
        last_name: 'Test new child last name',
        email: 'Test new child email',
        parent_id: testParent.id,
        login_id: testLogin.id,
      }
      return supertest(app)
        .post('/api/children')
        .send(newChild)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.first_name).to.eql(newChild.first_name)
          expect(res.body.last_name).to.eql(newChild.last_name)
          expect(res.body.email).to.eql(newChild.email)
          expect(res.body.parent_id).to.eql(newChild.parent_id)
          expect(res.body.login_id).to.eql(newChild.login_id)
          expect(res.headers.location).to.eql(`/api/children/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('children')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.first_name).to.eql(newChild.first_name)
              expect(row.last_name).to.eql(newChild.last_name)
              expect(row.email).to.eql(newChild.email)
              expect(row.parent_id).to.eql(newChild.parent_id)
              expect(row.login_id).to.eql(newChild.login_id)
            })
        )
    })

    const requiredFields = ['first_name', 'last_name', 'email']

    requiredFields.forEach(field => {
      const testLogin = testLogins[5]
      const testParent = testParents[0]
      const newChild = {
        first_name: 'Test new child',
        last_name: 'Test new child last name',
        email: 'Test new child email',
        parent_id: testParent.id,
        login_id: testLogin.id,
      }

      it(`responds with 400 and error message when the '${field}' is missing`, () => {
        delete newChild[field]

        return supertest(app)
          .post('/api/children')
          .send(newChild)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})