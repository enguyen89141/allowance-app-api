const xss = require('xss')
const ParentsService = {
  getById(db, id) {
    return db
      .from('parents')
      .where('parents.id', id)
      .first()
  },
  insertParent(db, newParent) {
    return db
      .insert(newParent)
      .into('parents')
      .returning('*')
      .then(([parent]) => parent)
      .then(parent =>
        ParentsService.getById(db, parent.id)
      )
  },
  serializeParent(parent) {
    return {
      id: parent.id,
      first_name: xss(parent.first_name),
      last_name: xss(parent.last_name),
      email: xss(parent.email),
      login_id: parent.login_id
    }
  }
}

module.exports = ParentsService