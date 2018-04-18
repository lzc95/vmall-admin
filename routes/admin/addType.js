const express = require('express');
const mysqlConn=require('../../libs/mysql_conn');

module.exports=function(){
   var router = express.Router();
     router.get('/',(req,res)=>{
     	  res.render('admin/index.ejs',{adminname:req.session['adminname']})
     });

     // 添加书籍类别
     router.post('/',(req,res)=>{
     	 var cName=req.body.cName;
         
          // 连接数据库
         var db=mysqlConn();
         db.query(`INSERT INTO category (cName) VALUES('${cName}')`,(err,data)=>{
             if(err){
             	console.error(err);
             	res.send({
             		code:'0',
             		msg:'添加类别失败！'
             	})
             }
             else{
             	res.send({
             		code:'1',
             		msg:'添加类别成功！'
             	});
             }
         })
     })
   return router;

}
