var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var db = require("../models/db.js");
var path = require("path")
var fs = require("fs")


router.get('/', function(req, res, next) {
    var username = req.session.username
    if (username == undefined){
        res.redirect('/');
    }
    else{
        db.find('files',{},function(err, result){
            res.render('share', {
                title: '在线交流系统-资料分享',
                page:'资料上传',
                login: true,
                username: username,
                filelist:result
            });
        })
    }
});

router.post('/uploadfile',function(req,res,next){
    var username = req.session.username
    if (username == undefined){
        res.redirect('/');
    }else {
        var form = new formidable.IncomingForm()
        form.parse(req, function( err, fields, files ){

            var fileinfo = fields.fileinfo

            if(files.userfile.size > 20*1000*1024) {
                res.send('-1') //文件太大
                return
            }else{               
                
                var filename = files.userfile.name
                var oldPath = files.userfile.path 
                var newPath = path.join(__dirname,'../public/','uploadfile',filename)
                fs.renameSync(oldPath,newPath)

                db.insertOne("files", {
                "username": username,
                "userfile" : filename,
                "fileinfo" : fileinfo,
                "uploaddate" : new Date().toLocaleString()
                }, function (err, result) {
                    if (err) {
                    res.send("-3"); //服务器错误
                    return;
                    }
                    res.send("1"); //上传成功
                })
            }
        })    
    }
})

module.exports = router;