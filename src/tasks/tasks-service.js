const xss = require('xss')
const TasksService = {
  getById(db, id) {
    return db
      .from('tasks')
      .where('tasks.id', id)
      .first()
  },
  insertTask(db, newTask) {
    return db
      .insert(newTask)
      .into('tasks')
      .returning('*')
      .then(([task]) => task)
      .then(task =>
        TasksService.getById(db, task.id)
      )
  },
  serializeTask(task) {
    return {
      id: task.id,
      name: xss(task.name),
      difficulty: task.difficulty,
      reward: task.reward,
      current_status: task.current_status,
      child_id: task.child_id
    }
  },
}

module.exports = TasksService