const express = require('express');
// 加载path中间件处理路径
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser = require('body-parser');
// 调用multer中间件上传文件
const multer=require('multer');
const multerObj=multer({dest:'./public/upload'});
 

// 加载管理员路由
var adminRoutes = require('./routes/admin/index');
// 加载用户路由
var routes = require('./routes/web/index');
// 加载商铺路由
var shopRoutes=require('./routes/shop/index');
//跨域
var cors = require('cors');

var app = express();
app.use(cors({
  origin: 'http://localhost:9099',
  credentials: true  // 携带cookie
}));

app.use(multerObj.any());




// 模板引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('猜不到'));

// cookie session设置
(function (){
  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  app.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 60*60*1000  //60min
  }));
})();

// 使用静态中间件加载静态'/public'文件
app.use(express.static(path.join(__dirname, 'public')));

//路由
// 管理员路由
app.use('/admin', adminRoutes);
// 用户路由
app.use('/',routes);
// 商铺路由
app.use('/shop',shopRoutes);

// 404 NOT FOUND Page
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('admin/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('admin/error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
