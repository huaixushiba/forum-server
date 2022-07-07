var User = require('../model/user.js')
exports.findByAccount = function (account, callback) {
  User.find(account, (err, doc) => {
    if (err) {
      callback(err)
    } else {
      callback(doc)
    }
  })
}
exports.save = function (data, callback) {
  let newUser = new User(data)
  newUser.save(err => {
    if (err) {
      callback(err)
    } else {
      callback()
    }
  })
}
exports.change = function (account, newData, callback) {
  User.updateOne(account, newData, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(result)
    }
  })
}
exports.delete = function (account, callback) {
  User.deleteOne(account, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(result)
    }
  })
}