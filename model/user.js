//用户数据结构
const mongoose = require('./db.js')
//操作集合 需要定义Schema
var UserSchema = mongoose.Schema({
  userName: String,    //用户昵称
  password: String,    //密码
  briefing:String,     //个人简介
  account: String,     //帐号
  userImg: String,     //头像
  createTime: String,  //注册时间
  userStatus: Boolean, //用户状态（true正常   false 封禁）
  permissions: Number, //权限（1.管理员  2.普通用户）
  follows: Array,      //关注
  beFollows:Array,     // 被关注
  collections:Array,    //收藏文章
  modifyTime:Number     //修改时间
})
//创建数据模型，操作数据库
//model里面的第一个参数，要注意:1首字母大写，2.要和数据库表(集合)名称对应
//这个模型会和模型名称相同的复数的数据库建立链接
var User = mongoose.model('User', UserSchema)
module.exports = User