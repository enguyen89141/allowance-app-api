const ChildrenService = {
  getAllChildren(knex) {
    return knex.select('*').from('children')
  },
}

module.exports = ChildrenService