## express+ejs+mongodb构建在线学习交流平台

#### 简介

主要包括用户注册，在线聊天，上传/下载资料，发表/查看/删除文章，查看用户详情等功能。
使用express搭建项目框架，定义路由，res.render()渲染页面，mongoDB操作数据库实现数据的增删查改功能。

* app.js 入口页面 
* bin/www  socket.io
* routes/index.js  路由接口
* models/db.js  数据库操作方法



使用了bootstrap实现响应式页面。

![image](https://github.com/angellfzhong/class-online/blob/master/img/1.jpg)

聊天室使用了socket.io，实时推送聊天信息。可自定义聊天文字样式，实时显示在线人数。

![image](https://github.com/angellfzhong/class-online/blob/master/img/2.jpg)

文件上传使用formData，服务器接受上传数据并保存在服务器端。

![image](https://github.com/angellfzhong/class-online/blob/master/img/3.jpg)

新建文章页面使用了基于bootstrap和jquery的富文本编辑器

![image](https://github.com/angellfzhong/class-online/blob/master/img/5.jpg)


文章列表使用ajax下拉刷新，用户详情页面可自行删除已发布的信息。使用express.session判断登录状态，实现免登陆功能。

#### 运行
```
$ npm install
$ npm start
```

