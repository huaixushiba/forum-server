
const express = require('express')
var app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
var router = require('./router.js')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)


app.listen(3000, () => {
  console.log('port 3000 is running...')
})




































// const User = require('./model/user.js')
// //查找数据
// User.find({}, (err, result) => {
// })
// //添加数据
// //1.实例化Model
// var u = new User({
//   name: 'xxx',
//   password: 'xxx'
// })
// //2.实例.save()  执行增加操作
// u.save(err => { })

// //更新数据
// User.updateOne({ 'name': 'xxx' }, { 'password': '123' }, (err, result) => {
// })
// //删除数据
// User.deleteOne({ 'name': 'xxx' }, (err, result) => { })



