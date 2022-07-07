//文章类型数据结构
const mongoose = require('./db.js')
var TypeSchema = mongoose.Schema({
    typeList:Object, //类型列表
    typeListId:Number //标识id
})
var Type = mongoose.model('Type',TypeSchema)
module.exports = Type