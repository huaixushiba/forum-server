//文章数据结构
const mongoose = require('./db.js')
var ContentSchema = mongoose.Schema({
    title: String,       //标题
    data: String,        //内容
    addTime: Number,     //发表时间
    addUser: String,     //发表人
    contentId: String,   // 文章id  
    comments:Array,      //评论
    collectionUsers:Array,//收藏对象
    likes:Number,          //点赞数量
    contentType:String    //文章类型
})
var Content = mongoose.model('Content',ContentSchema)
module.exports = Content