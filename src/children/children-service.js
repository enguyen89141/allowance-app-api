const xss = require('xss')
const ChildrenService = {
  getById(db, id) {
    return db
      .from('children')
      .where('children.id', id)
      .first()
  },
  insertChild(db, newChild) {
    return db
      .insert(newChild)
      .into('children')
      .returning('*')
      .then(([child]) => child)
      .then(child =>
        ChildrenService.getById(db, child.id)
      )
  },
  serializeChild(child) {
    return {
      id: child.id,
      first_name: xss(child.first_name),
      last_name: xss(child.last_name),
      email: xss(child.email),
      parent_id: child.parent_id,
      login_id: child.login_id,
    }
  }
}

module.exports = ChildrenService