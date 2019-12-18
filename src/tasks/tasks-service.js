const TasksService = {
  getAllTasks(knex) {
    return knex.select('*').from('tasks')
  },
}

module.exports = TasksService