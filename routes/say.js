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
        db.find('users',{"username":username},function(err, result){
            var userimg = result[0].userimg
           db.find("says",{},{"sort":{"sendtime":-1}},function(err,list){
                res.render('say', {
                title: '在线交流系统-吐槽墙',
                page:'吐槽',
                login: true,
                username: username,
                userimg : userimg,
                sayinglist : list
             });
            });
            
        })
    }
});

//显示所有说说
// router.get('/allsaying', function(req, res, next) {
//     db.find("says",{},function(err,result){
//         res.json(result);
//     });
// });

router.post('/postsaying',function(req,res,next){
    var username = req.session.username
    if (username == undefined){
        res.redirect('/');
    }else {
        console.log(req.body)
        var saying = req.body.saying
        var sendtime = new Date().toLocaleString()

        db.insertOne("says", {
        "username": username,
        "saying" : saying,
        "sendtime" : sendtime
        }, function (err, result) {
            if (err) {
            res.send("-3"); //服务器错误
            return;
            }
            res.send("1"); //发布成功
        })  
    }
})

module.exports = router;