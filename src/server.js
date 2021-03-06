const knex = require('knex')
const app = require('./app')

const { PORT, DATABASE_URL } = require('./config')
/** MAKE SURE TO CHANGE TEST_DB BACK TO DB_URL or DATABASE URL and IN POSTGRATOR/ENV/CONFIG FILE BEFORE DEPLOYMENT*/

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
