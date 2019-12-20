const bcrypt = require('bcryptjs')

function makeLoginsArray() {
  return [
    {
      id: 1,
      username: 'enguyen89141',
      password: '$2y$12$6WVz9TO/tw.ribgj4amS3OMZnWFo/W.m8KDhBVEDq9e0pphGBrvZ6',
      account: 0
    },
    {
      id: 2,
      username: 'chrisluong',
      password: '$2y$12$hppv4gsF4k99gypkHz8zL.2/lEQ30erhm5u9VLhF0S6tLWRSWegHW',
      account: 1
    },
    {
      id: 3,
      username: 'parenttwo',
      password: '$2y$12$6F267O9B5XQLIvS8TmP5ve5f0Qv5qUM08/I1K3D2dJurHlihc7u3K',
      account: 0
    },
    {
      id: 4,
      username: 'childtwo',
      password: '$2y$12$bBAGmTz/8k9XUvA/R/Hghu7nNe2HR94Az4a29EPDAacAQXpIaQw9y',
      account: 1
    },
    {
      id: 5,
      username: 'parentthree',
      password: '$2y$12$4uoSaG.RhCSxH/BwKRGdQuCPGRYmuQEzRaGBP9rohyKmrkxRT1Uzi',
      account: 0
    },
    {
      id: 6,
      username: 'childthree',
      password: '$2y$12$TmW4io1zlh63ox.RVoUrxuiUV8.Bq0AfuZ94ngWVwT5Cif6JTT322',
      account: 1
    }
  ]
}

function makeParentsArray() {
  return [
    {
      id: 1,
      first_name: 'Eric',
      last_name: 'Nguyen',
      email: 'enguyen89141@gmail.com',
      login_id: 1
    },
    {
      id: 2,
      first_name: 'Parent',
      last_name: 'two',
      email: 'parenttwo@gmail.com',
      login_id: 3
    }
  ]
}

function makeChildrenArray() {
  return [
    {
      id: 1,
      first_name: 'Christopher',
      last_name: 'Luong',
      email: 'chrisluong@gmail.com',
      parent_id: 1,
      login_id: 2
    },
    {
      id: 2,
      first_name: 'Child',
      last_name: 'two',
      email: 'childtwo@gmail.com',
      parent_id: 2,
      login_id: 4
    }
  ]
}

function makeTasksArray() {
  return [
    {
      id: 1,
      name: 'Clean room',
      difficulty: 2,
      reward: 4,
      current_status: 'open',
      child_id: 1
    },
    {
      id: 2,
      name: 'Finish homework',
      difficulty: 3,
      reward: 6,
      current_status: 'pending',
      child_id: 1
    },
    {
      id: 3,
      name: 'Finish developer module 4',
      difficulty: 5,
      reward: 10,
      current_status: 'completed',
      child_id: 1
    },
    {
      id: 4,
      name: 'Task 1',
      difficulty: 2,
      reward: 4,
      current_status: 'open',
      child_id: 2
    },
    {
      id: 5,
      name: 'Task 2',
      difficulty: 1,
      reward: 2,
      current_status: 'pending',
      child_id: 2
    },
    {
      id: 6,
      name: 'Task 3',
      difficulty: 4,
      reward: 8,
      current_status: 'completed',
      child_id: 2
    },
  ]
}

function seedLogins(db, logins) {
  const preppedLogins = logins.map(login => ({
    ...login,
    password: bcrypt.hashSync(login.password, 1),
  }))
  return db.into('logins').insert(preppedLogins)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('logins_id_seq', ?)`,
        [logins[logins.length - 1].id],
      ))
}

function seedParents(db, parents) {
  return db.into('parents').insert(parents)
    .then(() =>
      db.raw(
        `SELECT setval('parents_id_seq', ?)`,
        [parents[parents.length - 1].id],
      ))
}

function seedChildren(db, children) {
  return db.into('children').insert(children)
    .then(() =>
      db.raw(
        `SELECT setval('children_id_seq', ?)`,
        [children[children.length - 1].id],
      ))
}

function seedTasks(db, tasks) {
  return db.into('tasks').insert(tasks)
    .then(() =>
      db.raw(
        `SELECT setval('tasks_id_seq', ?)`,
        [tasks[tasks.length - 1].id],
      ))
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
            logins,
            parents,
            children,
            tasks
            `
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE logins_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE parents_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE children_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tasks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('logins_id_seq', 0)`),
          trx.raw(`SELECT setval('parents_id_seq', 0)`),
          trx.raw(`SELECT setval('children_id_seq', 0)`),
          trx.raw(`SELECT setval('tasks_id_seq', 0)`),
        ])))
}

module.exports = {
  makeLoginsArray,
  makeParentsArray,
  makeChildrenArray,
  makeTasksArray,
  seedLogins,
  seedParents,
  seedChildren,
  seedTasks,
  cleanTables
}