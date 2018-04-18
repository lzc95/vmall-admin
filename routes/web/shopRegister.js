var express = require('express');
const mysqlConn=require('../../libs/mysql_conn');
const fs=require('fs');
const pathLib=require('path');
const  md5=require('../../libs/md5.js');

module.exports=function(){
   var router = express.Router();

     // 商家注册信息
     router.post('/',(req,res)=>{

          var db=mysqlConn();
          var oldPath=req.files[0].path;
          
          var newPath=req.files[0].path+pathLib.parse(req.files[0].originalname).ext;

          var newFileName=req.files[0].filename+pathLib.parse(req.files[0].originalname).ext;
          fs.rename(oldPath,newPath,(err)=>{
              if(err){
                  console.error(err);  
              }
              else{
                    var shop_name=req.body.shop_name;
                    var shop_password=md5(req.body.shop_password);
                    db.query(`SELECT * FROM shop_table WHERE shop_name='${shop_name}'`,(err,data)=>{
                         if(err){
                          console.error(err);
                         }
                         else{
                             if(data.length==0){
                                  db.query(`INSERT INTO shop_table (shop_name,shop_password,shop_cardImg,flag) VALUES('${shop_name}','${shop_password}','${newFileName}','0')`,(err,data)=>{
                                      if(err){
                                        console.error(err);
                                      }
                                      else{
                                         res.send('注册成功！等待管理员审核！');
                                      }
                                  })  
                             }
                             else{
                                res.send('该商家已注册！')
                             }
                         }
                    })
                    
              }
          })
     })
  
     return router;

}
