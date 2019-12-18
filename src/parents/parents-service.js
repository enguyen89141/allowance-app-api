const ParentsService = {
  getAllParents(knex) {
    return knex.select('*').from('parents')
  },
}

module.exports = ParentsService