var express = require('express');
const mysqlConn=require('../../libs/mysql_conn');

module.exports=function(){
   var router = express.Router();
     router.get('/',(req,res)=>{
         // 连接数据库
          var db=mysqlConn();
          db.query(`SELECT * FROM category`,(err,data)=>{
          	  if(err){
          	  	console.error(err);
          	  	res.send({
          	  		code:0,
          	  		msg:'数据库连接异常！'
          	  	})
          	  }
          	  else{
          	  	res.render('admin/seeAllType.ejs',{adminname:req.session['adminname'],data:data})
          	  }  
          })
     	  
     })
     router.post('/',(req,res)=>{
         // 连接数据库
         var db=mysqlConn();
         switch(req.body.act){

            // 删除书籍类别
            case 'del':{
                  db.query(`DELETE  FROM category WHERE cId='${req.body.cId}'`,(err,data)=>{
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
            };break;
            case 'change':{
                db.query(`SELECT * FROM category WHERE cId ='${req.body.cId}'`,(err,data)=>{
                     if(err){
                      console.error(err);
                     }
                     else{
                        var cName=data[0].cName;
                        db.query(`UPDATE book_table SET sort='${req.body.cName}' WHERE sort='${cName}'`,(err,data)=>{
                             if(err){
                              console.error(err);
                             }
                             else{
                              
                             }
                        })
                     }
                })

                db.query(`UPDATE category SET cName='${req.body.cName}' WHERE cId='${req.body.cId}'`,
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
