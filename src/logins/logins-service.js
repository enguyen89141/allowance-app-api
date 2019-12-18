const bcrypt = require('bcryptjs')
const xss = require('xss')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/


const LoginsService = {
  hasLoginWithUsername(db, username) {
    return db('logins')
    .where({ username })
    .first()
    .then(user => !!user)
  },
  insertLogin(db, newLogin) {
    return db
      .insert(newLogin)
      .into('logins')
      .returning('*')
      .then(([login]) => login)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeLogin(login) {
    return {
      id: login.id,
      username: xss(login.username),
    }
  }
}

module.exports = LoginsService