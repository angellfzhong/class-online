var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
var shareRouter = require('./routes/share');
var sayRouter = require('./routes/say');
var noteRouter = require('./routes/note');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//express-session在服务端保存数据的中间件
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat', //对session cookie签名防止篡改
  resave: false,//强制保存session
  saveUninitialized: true,//强制将未初始化的session存储
  cookie: { path: '/', httpOnly: true, secure: false, maxAge:  1000*60*60*24},
}));

app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/share', shareRouter);
app.use('/say', sayRouter);
app.use('/note', noteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
