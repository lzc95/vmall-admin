var express = require('express');
const mysqlConn=require('../../libs/mysql_conn');

const  md5=require('../../libs/md5.js');

module.exports=function(){
   var router = express.Router();

     // 用户注册信息
     router.post('/',(req,res)=>{
          var db=mysqlConn();
         
              var username=req.body.username;
              var password=md5(req.body.password);
              db.query(`SELECT * FROM user_table WHERE username='${username}'`,(err,data)=>{
                   if(err){
                    console.error(err);
                   }
                   else{
                       if(data.length==0){
                            db.query(`INSERT INTO user_table (username,password,user_type) VALUES('${username}','${password}','user')`,(err,data)=>{
                                if(err){
                                  console.error(err);
                                }
                                else{
                                   res.send('注册成功');
                                }
                            })  
                       }
                       else{
                          res.send('该用户已注册！')
                       }
                   }
              })         
    })
    
  
     return router;

}
