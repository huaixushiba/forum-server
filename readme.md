## 数据结构

#### User(用户)

- userName (用户名) :String
- password(密码) :String
- briefing(个人简介):String
- account(帐号) :String
- userImg(头像) :String
- createTime(注册时间) :String
- userStatus(用户状态) : boolean ( true 正常 ； false 封禁)
- permissions(权限) : Number (1：管理员   2：普通用户)
- follows(关注xx) : Array 
- beFollows(被xx关注) : Array
- collections(收藏文章) : Array

#### Content(文章)

- title(标题) : String
- data(内容) : String
- addTime(发表时间) : String
- addUser(发表人) : String
- contentId(文章ID): Number
- comments(评论) : Array
- collectionUsers(收藏对象) : Array
- likes(点赞对象) : Array
- contentType(文章类型): Number 



## 接口
- /allContents   (query,data)  query:page(number)  size(number)     data: { contentType: "", frzzy: "" }
- /getPreferContents
- /signleContent (query)  query: contentId(number)
- /login (data)   data:{ account: , password: }
- /register(data)  data:{account: null,userName: "",password: null,createTime:null}
- /validate(data)  data:{}
- /addContent(data)  data:{contentType,title,data,addTime,addUser}
- /addLikes(data)   data:{contentId}
- /addCollection(data)  data 整个文章
- /addFollows(data)    data:{myAccount,addAccount}
- /getData(data)     data:{account}
- /getOtherPer(query)    query:userName(String)
- /getPerImg(data)    data:{userName}
- /updatePerData(data)   data:修改后的用户数据
- /getPerContents(query,data) query:page   size     data:{userName}
- /getCollections(query,data) query:page   size     data:{account}
- /getFollows(data)        data:{account}
- /addComments(data)  略   

