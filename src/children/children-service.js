const xss = require('xss')
const ChildrenService = {
  getById(db, login_id) {
    return db
      .from('children')
      .where('children.login_id', login_id)
      .first()
  },
  insertChild(db, newChild) {
    return db
      .insert(newChild)
      .into('children')
      .returning('*')
      .then(([child]) => child)
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
  },
  getTasksForChild(db, child_id) {
    return db
      .from('tasks')
      .select(
        'id',
        'name',
        'difficulty',
        'reward',
        'current_status'
      )
      .where('child_id', child_id)
  }
}

module.exports = ChildrenService