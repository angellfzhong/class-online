var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var dateFormat = require('dateformat');
var db = require('../models/db.js');

var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.username != undefined) {
    var username = req.session.username
    var login = true;
    res.cookie('username', username, { expires: new Date(Date.now() + 86400000) })
  } else {
    var username = ''
    var login = false
  }
  res.render('index', {
    title: '在线交流系统',
    page: '首页',
    login: login,
    username: username
  });
});
//验证登录
router.get('/checklogin', function (req, res, next) {
  if (req.session.username == undefined) {
    res.send('-1')
  } else {
    res.send('1')
  }
})
//用户登出
router.get('/logout', function (req, res, next) {
  //清除session及cookie
  delete req.session.username;
  res.clearCookie('username', { path: '/' });
  res.send('1');
})
//用户注册
router.post('/regist', function (req, res, next) {
  //formidable得到用户填写的东西
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    var username = fields.username
    var password = fields.password

    //判断上传的头像图片大小
    if (files.userimg.size > 100 * 1024) {
      res.send("-4"); //图片太大
      return
    }
    //将用户头像重命名并保存到服务器
    var time = dateFormat(new Date(), "yyyymmddHHMMss")
    var extName = path.extname(files.userimg.name)
    var newName = time + '_' + Math.floor(Math.random() * 9999) + extName
    var oldPath = files.userimg.path
    var newPath = path.join(__dirname, '../public/', 'uploadimg', newName)
    fs.renameSync(oldPath, newPath)

    //查找数据库
    db.find('users', { "username": username }, function (err, result) {
      if (err) {
        res.send('-3')  //服务器错误
        return
      }
      if (result.length != 0) {
        res.send('-1')  //用户名被占用 
        return
      }
      //用户名没被占用 向数据库插入用户名
      db.insertOne("users", {
        "username": username,
        "password": password,
        "userimg": newName
      }, function (err, result) {
        if (err) {
          res.send("-3"); //服务器错误
          return;
        }
        req.session.username = username
        res.cookie('username', username, { expires: new Date(Date.now() + 86400000) })
        res.send("1"); //注册成功，用户信息写入session及cookie
      })
    })
  })

});

router.post('/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  db.find('users', { 'username': username }, function (err, result) {
    if (err) {
      res.send('-3')  //服务器错误
      return
    }
    if (result.length == 0) {
      res.send('-1')  //用户名不存在
      return
    }
    //用户名存在时验证用户名密码
    if (password == result[0].password) {
      //在session cookie中保存用户名
      req.session.username = username;
      //设置cookie保存用户名 只能在服务器端使用
      res.cookie('username', username, { expires: new Date(Date.now() + 86400000) })
      res.send('1');  //登陆成功
      return;
    } else {
      res.send('-2');  //密码错误
      return;
    }
  })
})
router.param('uname', function (req, res, next) {
  next();
})
//获取用户信息
router.get('/getuserimg/:uname', function (req, res, next) {
  db.find('users', { 'username': req.params.uname }, function (err, result) {
    if (err || result.length == 0) {
      res.json('');
      return;
    }
    var userimg = result[0].userimg
    res.send(userimg);
  });
})
//用户详情页面
router.get('/user/:uname', function (req, res, next) {
  if (req.session.username != undefined) {
    var username = req.session.username
    var login = true
  } else {
    var username = ''
    var login = false
  }

  db.find('users', { 'username': req.params.uname }, function (err, result) {
    if (err || result.length == 0) {
      res.json("");
      return;
    }
    console.log(result)
    res.render('user', {
      title: '在线交流系统-用户详情',
      page: '用户详情',
      login: login,
      username: username,
      username2: result[0].username,
      userimg: result[0].userimg
    });
  });
})


//获取用户页面笔记列表
router.get('/usernote/:uname', function (req, res, next) {
  db.find('notes', { 'username': req.params.uname }, function (err, result) {
    if (err || result.length == 0) {
      res.send("-1");
      return;
    }
    res.send(result)
  })
})

router.get('/userfiles/:uname', function (req, res, next) {
  db.find('files', { 'username': req.params.uname }, function (err, result) {
    if (err || result.length == 0) {
      res.send("-1");
      return;
    }
    res.send(result)
  })
})

router.get('/usersays/:uname', function (req, res, next) {
  db.find('says', { 'username': req.params.uname }, function (err, result) {
    if (err || result.length == 0) {
      res.send("-1");
      return;
    }
    res.send(result)
  })
})
//删除纪录 
router.post('/delete', function (req, res, next) {
  var info = req.body
  db.deleteById(info.collectionName, info.id, function (err, result) {
    if (err || result.length == 0) {
      res.send("-1");
      return;
    }
    console.log(result)
    res.send(result)
  })
})

module.exports = router;
