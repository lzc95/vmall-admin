var express = require('express');
const mysqlConn=require('../../libs/mysql_conn');
const fs=require('fs');
const pathLib=require('path');

module.exports=function(){
   var router = express.Router();
     router.get('/',(req,res)=>{
         // 查询所有二级分类
          var db=mysqlConn();
          db.query(`SELECT scId,cName,scName,subCategoryImg FROM category,subCategory WHERE category.cId=subCategory.cId`,(err,data)=>{
          	  if(err){
          	  	console.error(err);
          	  	res.send({
          	  		code:0,
          	  		msg:'数据库连接异常！'
          	  	})
          	  }
          	  else{
          	  	res.render('admin/seeAllSubType.ejs',{adminname:req.session['adminname'],data:data})
          	  }  
          })
     	  
     })
     router.post('/',(req,res)=>{
         // 连接数据库
         var db=mysqlConn();
         switch(req.body.act){

            // 删除二级类别
            case 'del':{
                  var subCategoryImg = req.body.subCategoryImg;
                  db.query(`DELETE  FROM subCategory WHERE scId='${req.body.scId}'`,(err,data)=>{
                       if(err){
                        console.error(err);
                       }
                       else{
                            var pathname=pathLib.resolve(__dirname,'../../','public');
                            fs.unlink(pathLib.join(pathname,subCategoryImg),(err)=>{
                            if(err){
                              console.error(err);
                            }
                            else{
                                res.send({
                                    code:1,
                                    msg:'删除成功！'
                                })
                            }
                        })
                       }
                  })
            };break;
            case 'change':{
                
                db.query(`UPDATE subCategory SET scName='${req.body.scName}' WHERE scId='${req.body.scId}'`,
                  (err,data)=>{
                       if(err){
                        console.error(err);
                       }
                       else{   
                          res.send({
                            code:1,
                            msg:'修改成功！'
                          })
                       }
                  })
            }
         }
     })
   return router;

}
