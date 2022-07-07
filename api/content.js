var Content = require('../model/content.js')
var UUID = require('uuid')

exports.findAll = function( callback ){
    Content.find({},(err,doc)=>{
        if(err){
            callback(err)
        } else{
            callback(err,doc)
        }
    })
}
exports.findById = function(id, callback){
    Content.find(id,(err,doc)=>{
        if(err){
            callback(err,doc)
        }else{
            callback(err,doc)
        }
    })
}
exports.save = function (data,callback){
    Content.find({},(err,doc)=>{
        if(err){
            console.log('error')
        }else{
            data.contentId = UUID.v1()
            let newContent = new Content(data)
            newContent.save(err=>{
                if(err){
                    callback(err)
                }else{
                    callback()
                }
            })
        }
    })
}
exports.update = function(id,newData,callback){
    Content.updateOne(id,newData,(err,res)=>{
        if(err){
            callback(err)
        }else{
            callback(res)
        }
    })
} 
exports.delete = function(id, callback){
    Content.deleteOne(id,(err,res)=>{
        if(err){
            callback(err,res)
        }else{
            callback(err,res)
        }
    })
}