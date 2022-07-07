//路由模块(接口页)
const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('./api/user.js')
const Content = require('./api/content.js')
const Type = require('./api/type.js')
const md5 = require('blueimp-md5')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const e = require('express')
const upload = multer({ dest: 'image/' })
var router = express.Router()
function pagination(pageSize, currentPage, arr) {
  let skipNum = (currentPage - 1) * pageSize
  let newArr = (skipNum + pageSize >= arr.length) ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize)
  return newArr
}
/**
 * 图片处理方法
 */
function imgBase64(url) {
  let newExt = url.split('.')
  let imageData = fs.readFileSync(url)
  let imageBase64 = imageData.toString("base64");
  let imagePrefix = 'data:image/' + newExt[1] + ';base64,'
  userImg = imagePrefix + imageBase64
  return userImg
}
// router.use(cors)
router.get('/', (req, res) => {
  res.send('hollow')
})
/**
 * 获取所有文章
 * 传入页数和每页文章数
 */
router.post('/allContents', (req, res) => {
  let page = parseInt(req.query.page)
  let size = parseInt(req.query.size)
  let newData = []
  Content.findAll((err, result) => {
    if (err) {
      res.send('error')
    } else {
      if(req.body.contentType=='全部文章'){
        result.sort(function(a,b){
          return b.addTime - a.addTime
        })
        let data
        if(req.body.frzzy){
          data = result.filter(item=>{
            let flag = false
            for(let i in item){
              if( i == 'title' || i == 'addUser'){
                  item[i].includes(req.body.frzzy) ? flag=true : flag=flag
              }else{
                continue
              }    
            }
            if(flag) return item
          })
        }else{
          data = result
        }
        newData = pagination(size, page, data)
        newData.unshift({length:data.length})
        res.json(newData)
      }else{
        let data = []
        result.sort(function(a,b){
          return b.addTime - a.addTime
        })
        data = result.filter(item=>{
          return item.contentType==req.body.contentType
        })
        if(req.body.frzzy){
          data = data.filter(item=>{
            let flag = false
            for(let i in item){
              if( i == 'title' || i == 'addUser'){
                item[i].includes(req.body.frzzy) ? flag=true : flag=flag
              }else{
                continue
              }    
            }
            if(flag) return item
          })
        }else{
          data = data
        }
        newData = pagination(size, page, data)
        newData.unshift({length:data.length})
        res.send(newData)
      }
    }
  })
})
/**
 * 获取点赞最多的六个文章数据
 */
router.get('/getPreferContents',(req,res)=>{
  Content.findAll((err,result)=>{
    if(err){
      res.send('error')
    }else{
      result.sort(function(a,b){return b.likes-a.likes})
      let newContents = result.slice(0,5)
      res.json(newContents)
    }
  })
})
/**
 * 获取单个文章
 * 传入文章ID
 */
router.get('/signleContent', (req, res) => {
  const contentId = req.query.contentId
  let content = {}
  content.contentId = contentId
  Content.findById(content, (err, doc) => {
    if (err) {
      res.send('error')
    } else {
      res.json(doc)
    }
  })
})
/**
 * 登录接口
 * 传入账号和加密后的密码
 */
router.post('/login', (req, res) => {
  let userAccount = { account: req.body.account }
  if (req.body) {
    User.findByAccount(userAccount, result => {
      if (result.length) {
        if(result[0].userStatus){
          if (md5(result[0].password) === req.body.password) {
            let userName = result[0].userName
            let userStatus = result[0].userStatus
            let account = result[0].account
            let userImg = ''
            if (result[0].userImg) {
              userImg = imgBase64(result[0].userImg)
            }+
            res.json({
              //加密方法
              token: jwt.sign({ account: account }, 'lyy', { expiresIn: '30000s' }),
              userName: userName,
              userStatus: userStatus,
              userImg: userImg,
            })
          } else {
            res.send('密码错误')
          }
        }else{
          res.send('用户被封禁，请联系管理员')
        }
      } else {
        res.send('账号错误')
      }
    })
  }
})

/**
 * 注册接口
 * 传入初始信息
 */
router.post('/register', (req, res) => {
  let userAccount = {account: req.body.account}
  let userName = {userName: req.body.userName}
  User.findByAccount(userAccount, result => {
    if(result.length){
      res.send('账号重复')
    }else{
      User.findByAccount(userName,answer=>{
        if(answer.length){
          res.send('昵称重复')
        }else{
          req.body.briefing=''
          req.body.userImg=''
          req.body.userStatus=true
          req.body.permissions=2
          req.body.follows=[]
          req.body.beFollows=[]
          req.body.collections=[]
          req.body.modifyTime=req.body.createTime
          User.save(req.body, err => {
            if (err) {
              res.send(err)
            } else {
              res.send('success')
            }
          })
        }
      })
    }
  })
})
//登录持久化验证接口
router.post('/validate', (req, res) => {
  let token = req.headers.authorization
  jwt.verify(token, 'lyy', (err, decode) => {
    if (err) {
      res.json({
        msg: '当前用户未登录'
      })
    } else {
      let userAccount = { account: '' }
      userAccount.account = decode.account
      User.findByAccount(userAccount, result => {
        if (result.length) {
          let userName = result[0].userName
          let userStatus = result[0].userStatus
          let account = result[0].account
          let userImg = ''
          if (result[0].userImg) {
            userImg = imgBase64(result[0].userImg)
          }
          res.json({
            //加密方法
            token: jwt.sign({ account: account }, 'lyy', { expiresIn: '30000s' }),
            userName: userName,
            userStatus: userStatus,
            userImg: userImg,
            account:account
          })
        }
      })
    }
  })
})
/**
 * 添加新的文章
 * 传入文章内容
 */
router.post('/addContent', (req, res) => {
  let newContent = req.body
  newContent.comments=[]
  newContent.collectionUsers=[]
  newContent.likes=0
  Content.save(newContent, err => {
    if (err) {
      res.send('error')
    } else {
      res.send('success')
    }
  })
})
/**
 * 点赞
 * 传入文章内容数据
 */
router.post('/addLikes',(req,res)=>{
  req.body.likes=req.body.likes+1
  let oldId = {}
  oldId.contentId = req.body.contentId
  let newContent = {...req.body}
  Content.update(oldId,newContent,(doc)=>{
    if(doc.ok===1){
      res.send('success')
    }else{
      res.send('error')
    }
  })
})
/**
 * 收藏
 */
router.post('/addCollection',(req,res)=>{
  let oldId = {}
  oldId.contentId = req.body.contentId
  Content.update(oldId,req.body,(doc)=>{
    if(doc.ok===1){
      User.findByAccount(req.body.collectionUsers[0],result=>{
        if(result.length){
          result[0].collections.unshift({contentId:req.body.contentId})
          User.change({account:result[0].account},result[0],fina=>{
            if(fina.ok==1){
              res.send('success')
            }else{
              res.send('error')
            }
          })
        }
      })
    }else{
      res.send('error')
    }
  })
})
/**
 * 关注
 */
router.post('/addFollows',(req,res)=>{
  let userAccount = {
    account : req.body.myAccount
  }
  User.findByAccount(userAccount,result=>{
    if(result.length){
      result[0].follows.unshift({account:req.body.addAccount})
      User.change({account:result[0].account},result[0],fina=>{
        if(fina.ok==1){
          User.findByAccount({account:req.body.addAccount},doc=>{
            if(doc.length){
              doc[0].beFollows.unshift({account:req.body.myAccount})
              User.change({account:doc[0].account},doc[0],fin=>{
                if(fin.ok==1){
                  res.send('success')
                }else{
                  res.send('error')
                }
              })
            }else{
              res.send('error')
            }
          })
        }else{
          res.send('error')
        }
      })
    }else{
      res.send('error')
    }
  })
})
/**
 * 获取个人数据
*/
router.post('/getData', (req, res) => {
  let user = {}
  user.account = req.body.account
  User.findByAccount(user, doc => {
    if(doc.length){
    doc[0].userImg=doc[0].userImg ?imgBase64(doc[0].userImg):doc[0].userImg 
    res.json(doc[0])
    }else{
      res.send('error')
    }
  })
})
/**
 * 获取他人数据
 */
router.get('/getOtherPer',(req,res)=>{
  User.findByAccount(req.query,doc=>{
    if(doc[0]){
      let newUser={}
      newUser.userImg=doc[0].userImg ?imgBase64(doc[0].userImg):doc[0].userImg 
      newUser.beFollows=doc[0].beFollows
      newUser.userName = doc[0].userName
      newUser.account = doc[0].account
      newUser.briefing = doc[0].briefing
      res.json(newUser)
    }else{
      res.send('error')
    }
  })
})
/**
 * 获取个人头像
 */
router.post('/getPerImg',(req,res)=>{
  User.findByAccount(req.body,doc=>{
    if(doc.length){
      let userImg=doc[0].userImg ?imgBase64(doc[0].userImg):doc[0].userImg 
      res.json(userImg)
      }else{
        res.send('error')
      }
  })
})
/**
 * 更新个人数据
 */
router.post('/updatePerData',(req,res)=>{
  let user = {}
  let newContent={}
  user.account = req.body.account
  User.findByAccount(user,result=>{
    if(result.length){
      if(req.body.userName==result[0].userName){
        User.change(user,req.body,doc=>{
          if(doc.ok===1){
            res.send('success')
            return 
          }
        })
      }else{
        let nowTime = Date.now()
        let diffTime
        newContent.addUser=result[0].userName
        if(!result[0].modifyTime){
          diffTime = nowTime-Number(result[0].addTime)
        }else{
          diffTime = nowTime-Number(result[0].modifyTime)
        }
        if(diffTime>2592000000){
          req.body.modifyTime=Date.now()
          User.change(user,req.body,doc=>{
              if(doc.ok===1){
                Content.findById(newContent, (err, docx) => {
                  if (err) {
                    res.send('error')
                    return 
                  } else {
                    if(docx.length){
                      let flag = true
                      let newAddUser={}
                      newAddUser.addUser = req.body.userName
                      docx.forEach(item=>{
                        let newId = {}
                        newId.contentId = item.contentId
                        Content.update(newId, newAddUser, resu => {
                          if(resu.n!==0&&resu.ok==1){
                            return
                          }else{
                            flag = false
                            return 
                          }
                        })
                      })
                      if(flag){
                        res.send('success')
                      }else{
                        res.send('error')
                      }
                    }else{
                      res.send('success')
                      return 
                    }
                  }
                })
              }
          })
        }else{
          res.send('间隔时间不够')
          return 
        }
      }
    }else{
      res.send('error')
      return
    }
  })
  
})
//获取个人的文章
router.post('/getPerContents', (req, res) => {
  let page = parseInt(req.query.page)
  let size = parseInt(req.query.size)
  let newContent = {}
  newContent.addUser = req.body.userName
  Content.findById(newContent, (err, doc) => {
    if (err) {
      res.send('error')
    } else {
      doc.sort(function(a,b){
        return b.addTime - a.addTime
      })
      let newData = pagination(size, page, doc)
      res.json([newData,doc.length])
    }
  })
})
/**
 * 获取个人收藏的文章
 */
router.post('/getCollections',(req,res)=>{
  let page = parseInt(req.query.page)
  let size = parseInt(req.query.size)
  let collectContents = []
  Content.findAll((err,doc)=>{
    if(err){
      res.send('error')
    }else{
      User.findByAccount(req.body,result=>{
        if(result.length){
            for(let j=0;j<result[0].collections.length;j++){
              if(doc.filter(data=>{
                if(data.contentId===result[0].collections[j].contentId){
                  return data
                }
              })[0]){
                collectContents.unshift(doc.filter(data=>{
                  if(data.contentId===result[0].collections[j].contentId){
                    return data
                  }
                })[0])
              }
            }
            let newContent=pagination(size,page,collectContents)
            res.json([newContent,collectContents.length])
        }
      })
    }
  })
})
/**
 * 获取个人关注数据
 */
router.post('/getFollows',(req,res)=>{
  let followData = []
  User.findByAccount(req.body,result=>{
    if(result.length){
      User.findByAccount({},doc=>{
        if(doc.length){
          result[0].follows.map(item=>{
            let newData = {}
            let data = doc.filter(data=>data.account===item.account)[0]
            newData.beFollows = data.beFollows
            newData.userName = data.userName
            newData.createTime = data.createTime
            newData.userImg = data.userImg ?imgBase64(data.userImg):data.userImg 
            newData.briefing = data.briefing
            followData.unshift(newData)
          })
          res.json(followData)
        }else{
          res.send('error')
        }
      })
    }else{
      res.send('error')
    }
  })
})
//删除文章
router.post('/deleteContent', (req, res) => {
  Content.delete(req.body, (err, doc) => {
    if (err) {
      res.send('error')
    } else {
      res.send('success')
    }
  })
})
//添加评论
router.post('/addComments', (req, res) => {
  let newId = { contentId: req.body.addId }
  let addComment = {
    data: req.body.data,
    addTime: req.body.addTime,
    addUser: req.body.addUser
  }
  Content.findById(newId, (err, doc) => {
    if (err) {
      console.log(err)
    } else {
      let newComment = doc[0].comments
      newComment.push(addComment)
      let newComments = { comments: newComment }
      Content.update(newId, newComments, result => {
        if(result.n!==0&&result.ok==1){
          res.send('success')
        }else{
          res.send('error')
        }
      })
    }
  })
})
router.post('/photos/upload', upload.single('image'), async function (req, res, next) {
  // req.file是读取的图片数据，然后要进行处理才能存储
  User.findByAccount(req.body, result => {
    if (result.length) {
      if(result[0].userImg){
        fs.unlink(result[0].userImg,(err)=>{
          if(err){
            console.log(err)
          }
        })
      }
      var file = req.file
      const extname = path.extname(file.originalname)
      const filepath = file.path
      const filename = filepath + extname
      fs.renameSync(filepath, filename)
      result[0].userImg = filename
      User.change(req.body, result[0], doc => {
        if (doc.ok === 1) {
          res.send('success')
        } else {
          res.send('error')
        }
      })

    }
  })
  //处理完成，下面开始读取图片并转换成base64格式在下个接口中读取发送给前端
})



//后台管理系统
/**
 * 后台管理系统登录
 */
router.post('/back/login',(req,res)=>{
  if(req.body.account){
    User.findByAccount({account:req.body.account}, result => {
      if (result.length) {
        if(result[0].permissions==1){
          if(result[0].password === req.body.password){
            let userName = result[0].userName
            let account = result[0].account
            let userImg = ''
            if (result[0].userImg) {
              userImg = imgBase64(result[0].userImg)
            }
            res.json({
              //加密方法
              token: jwt.sign({ account: account }, 'lyy', { expiresIn: '30000s' }),
              userName: userName,
              userImg: userImg,
            })
          }else{
            res.send('passwordError')
          }
        }else{
          res.send('权限不够')
        }
      } else {
        res.send('accountError')
      }
    })
  }
})
/**
 * 后台管理系统——获取所有用户信息
 */
router.get('/back/getUsers',(req,res)=>{
  User.findByAccount({},result=>{
    if(result.length){
      let newData = result.filter(item=>{
        return item.permissions==2
      })
      newData = newData.map(item=>{
        let data = {}
        data.account = item.account
        data.userName= item.userName
        data.createTime = item.createTime
        data.userStatus = item.userStatus
        data.userImg = item.userImg?imgBase64(item.userImg):''
        return data
      })
      res.json(newData)
    }else{
      res.send('error')
    }
  })
})
/**
 * 后台管理系统——获取所有文章信息
 */
router.get('/back/getContents',(req,res)=>{
  Content.findAll((err, result) => {
    if (err) {
      res.send('error')
    } else {
      let newData = result.map(item=>{
        return {
          title:item.title,
          addTime:item.addTime,
          addUser:item.addUser,
          contentType:item.contentType,
          contentId:item.contentId,
        }
      })
      res.json(newData)
    }
  })
})
/**
 * 后台管理系统——封禁用户
 */
router.post('/back/banUser',(req,res)=>{
  User.findByAccount(req.body,result=>{
    if(result.length){
      data = result[0]
      data.userStatus = false
      User.change(req.body,data,doc=>{
        if(doc.ok===1){
          res.send('success')
        }else{
          res.send('error')
        }
      })
    }else{
      res.send('error')
    }
  })
})
/**
 * 后台管理系统——解禁用户
 */
router.post('/back/unsealUser',(req,res)=>{
    User.findByAccount(req.body,result=>{
      if(result.length){
        data = result[0]
        data.userStatus = true
        User.change(req.body,data,doc=>{
          if(doc.ok===1){
            res.send('success')
          }else{
            res.send('error')
          }
        })
      }else{
        res.send('error')
      }
    })
})
/**
 * 后台管理系统——删除文章
 */
router.post('/back/deleteContent',(req,res)=>{
  Content.delete(req.body,(err,doc)=>{
    if(err){
      res.send('error')
    }else{
      res.send('success')
    }
  })
})

/**
 * 类型列表创建，只用执行一次
 */
// router.get('/back/createTypeList',(req,res)=>{
//   let data = {
//     typeListId:1,
//     typeList:{
//     }
//   }
//   Type.save(data,err=>{
//     if(err){
//       res.send('error')
//     }else{
//       res.send('success')
//     }
//   })
// })
/**
 * 获取类型列表
 */
router.get('/back/typeList',(req,res)=>{
  Type.findByAccount(result=>{
    if(result.length){
      res.json(result[0].typeList)
    }else{
      res.send('error')
    }
  })
})

/**
 * 更新类型列表
 */
router.post('/back/addTypeList',(req,res)=>{
  Type.findByAccount(result=>{
    if(result.length){
      let newList = result[0].typeList
      newList[req.body.key] = req.body.label
      Type.change({typeListId:1},{typeList:newList},doc=>{
        if(doc.ok===1){
          res.send('success')
        }else{
          res.send('error')
        }
      })
    }else{
      res.send('error')
    }
  })
})

module.exports = router