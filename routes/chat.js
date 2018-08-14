var express = require('express');
var router = express.Router();
var db = require('../models/db.js');


router.get('/', function(req, res, next) {
    var username = req.session.username
    if (username == undefined){
        res.redirect('/');
    }
    else{
        db.find('users',{"username":username},function(err, result){
            console.log(result)
            var userimg = result[0].userimg
            res.render('chat', {
                title: '在线交流系统-聊天室',
                page:'聊天室',
                login: true,
                username: username,
                userimg : userimg
            });
        })
    }
});

module.exports = router;