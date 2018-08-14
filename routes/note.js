var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var db = require("../models/db.js");
var path = require("path")
var fs = require("fs")


router.get('/', function (req, res, next) {
    var username = req.session.username
    if (username == undefined) {
        res.redirect('/');
    }
    else {
        res.render('note', {
            title: '在线交流系统-学习笔记',
            page: '学习笔记',
            login: true,
            username: username
        });
    }
});

//显示最新10篇笔记标题
router.get('/notetitle', function (req, res, next) {
    db.find('notes', {}, { 'pageamount': 10 }, function (err, result) {
        res.json(result);
    }, { notetitle: 1 });
});
//显示最新5篇用户笔记标题
router.get('/mynotetitle', function (req, res, next) {
    var username = req.session.username
    db.find('notes', { 'username': username }, { 'pageamount': 5 }, function (err, result) {
        res.json(result);
    }, { notetitle: 1 });
});



//全部笔记列表
router.get('/notelist', function (req, res, next) {
    var username = req.session.username
    if (username != undefined) {
        var login = true
    }
    else {
        var login = false
    }

    db.find('notes', {}, { 'pageamount': 6 }, function (err, result) {
        if (err) {
            res.send(err)
        }
        //用正则过滤掉笔记内容中的html标签
        var note = result
        var reg = new RegExp('<.+?>', 'g')
        for (var i = 0; i < note.length; i++) {
            var text = note[i].notecontent
            note[i].notecontent = text.replace(reg, '')
            console.log(note[i].notecontent)
        }
        res.render('notelist', {
            title: '在线交流系统-全部笔记',
            page: '学习笔记',
            login: login,
            username: username,
            notelist: note
        });
    });
})
//加载更多
router.get('/morenote', function (req, res, next) {
    var amount = parseInt(req.query.amount)
    db.find('notes', {}, { 'pageamount': 5, 'skips': amount }, function (err, result) {
        if (err) {
            res.send(err)
        }
        //用正则过滤掉笔记内容中的html标签
        var note = result
        var reg = new RegExp('<.+?>', 'g')
        for (var i = 0; i < note.length; i++) {
            var text = note[i].notecontent
            note[i].notecontent = text.replace(reg, '')
            console.log(note[i].notecontent)
        }
        res.render('morenote', {
            notelist: note
        });
    });
})


router.param('id', function (req, res, next, id) {
    next();
})

//查看笔记详情
router.get('/readnote/:id', function (req, res, next) {
    var username = req.session.username
    if (username != undefined) {
        var login = true
    } else {
        var login = false
    }
    db.findbyId('notes', req.params.id, function (err, result) {
        res.render('readnote', {
            title: result[0].notetitle,
            page: '学习笔记',
            login: login,
            username: username,
            note: result[0]
        });
    })
})


router.post('/postnote', function (req, res, next) {
    var username = req.session.username
    if (username == undefined) {
        res.redirect('/');
    } else {
        var notecontent = req.body.notecontent
        var notetitle = req.body.notetitle
        var notetime = new Date().toLocaleString()

        db.insertOne("notes", {
            "username": username,
            "notetitle": notetitle,
            "notecontent": notecontent,
            "notetime": notetime
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