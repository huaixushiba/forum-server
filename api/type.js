var Type = require('../model/type.js')

exports.save = function (data, callback) {
    let newType = new Type(data)
    newType.save(err => {
        if (err) {
            callback(err)
        } else {
            callback()
        }
    })
}

exports.change = function (id, newData, callback) {
    Type.updateOne(id, newData, (err, result) => {
        if (err) {
            callback(err)
        } else {
            callback(result)
        }
    })
}
exports.findByAccount = function ( callback) {
    Type.find({}, (err, doc) => {
      if (err) {
        callback(err)
      } else {
        callback(doc)
      }
    })
  }