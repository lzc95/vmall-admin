var express = require('express');
var router = express.Router();

router.use((req, res, next)=>{
    if((!req.session['adminname'] || req.session['user_type']!='admin')
     && req.url!='/login'){ //没有登录
    	 console.log(req.url)
        res.redirect('/admin/login');
       
    }else{
      next();
    }
  });

 router.get('/', function(req, res, next) {
    res.render('admin/index.ejs',{adminname:req.session['adminname']});
 }); 
 //登录路由
 router.use('/login',require('./login')());
 // 添加一级类别
 router.use('/addType',require('./addType')());
 // 管理一级类别
 router.use('/seeAllType',require('./seeAllType')());
 
// 添加二级类别
router.use('/addSubType',require('./addSubType')());
// 管理二级类别
router.use('/seeAllSubType',require('./seeAllSubType')());

 // 添加商品
 router.use('/addGoods',require('./addGoods')());
 // 管理全部商品
 router.use('/seeAllGoods',require('./seeAllGoods')());
 // 订单管理
 router.use('/order',require('./order')());
 // 商铺审核
 router.use('/shopCheck',require('./shopCheck')());
  // 修改密码
  router.use('/changePass',require('./changePass')());
  // 广告位设置
  router.use('/ads',require('./ads')());
  // 消息发送
  router.use('/message',require('./message')());
  // 查看已发送的全部消息
  router.use('/seeAllMessage',require('./seeAllMessage')())
  // 退出登录
  router.use('/logout',require('./logout.js')())
module.exports = router;
