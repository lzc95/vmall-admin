var express = require('express');
const mysqlConn=require('../../libs/mysql_conn');
const date=require('../../libs/currentDate')
const fs=require('fs');
const pathLib=require('path');

module.exports=function(){
   var router = express.Router();
     router.get('/',(req,res)=>{

          var db=mysqlConn();
          db.query(`SELECT scId,scName FROM subCategory`,(err,data)=>{
               if(err){
               	console.error(err);
               }
               else{
                   
               	  res.render('admin/addGoods.ejs',{adminname:req.session['adminname'],subCategory:data})
               }
          }) 
     })

     // 添加商品信息
     router.post('/',(req,res)=>{
           // 连接数据库
          var db=mysqlConn();
          // 对上传文件的路径处理
          var oldPath=req.files[0].path;
          var newPath=req.files[0].path+pathLib.parse(req.files[0].originalname).ext;
          var newFileName=req.files[0].filename+pathLib.parse(req.files[0].originalname).ext;
          // 文件重命名
          fs.rename(oldPath,newPath,(err)=>{
              if(err){
                  console.error(err);  
              }
              else{
                    var gName=req.body.gName;
                    var gPrice=req.body.gPrice;
                    var gSum=req.body.gSum;
                    var scId=req.body.scId;
                    var gAttr=req.body.gAttr;
                    var gTime=new Date().getTime();
                    var scId=req.body.scId;
                  db.query(`INSERT INTO goods (scId,gName,gPrice,gSum,gPic,gTime,attr)VALUES('${scId}',
                    '${gName}','${gPrice}','${gSum}','${newFileName}','${gTime}','${gAttr}')`,(err,data)=>{
                        if(err){
                          console.error(err);
                        }
                        else{
                           res.send('添加商品成功！');
                        }
                    })  
              }
          })
     })
  
     return router;

}
