const express = require('express');
const mysqlConn=require('../../libs/mysql_conn');
const fs=require('fs');
const pathLib=require('path');

module.exports=function(){
   var router = express.Router();
     router.get('/',(req,res)=>{
        var db=mysqlConn();
        db.query(`SELECT * FROM category`,(err,data)=>{
             if(err){
                 console.error(err);
             }
             else{
                   res.render('admin/addSubType.ejs',{adminname:req.session['adminname'],type:data})
             }
        }) 
     });

     // 添加二级类别
     router.post('/',(req,res)=>{

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
                 var cId=req.body.cId;
                 var scName=req.body.scName;
                  db.query(`INSERT INTO subCategory (cId,scName,subCategoryImg)VALUES('${cId}','${scName}','${newFileName}')`,(err,data)=>{
                        if(err){
                          console.error(err);
                        }
                        else{
                           res.send('添加二级类别成功！');
                        }
                    })  
              }
          })
     })
   return router;

}
