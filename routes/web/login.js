var express = require('express');
var router = express.Router();
const  mysqlConn=require('../../libs/mysql_conn.js');
const  md5=require('../../libs/md5.js');

module.exports=function(){
	 var db=mysqlConn();

	 router.post('/',(req,res)=>{
		var userName=req.body.userName;
		var password=md5(req.body.password);
		db.query(`SELECT * FROM customer WHERE userName='${userName}'`,(err,data)=>{
		  if(err){
			 console.error(err);
		  }
		  else{
			  if(data.length>0){
				  if(password==data[0].password){ 
					 req.session.nickName=data[0].nickName; 
					 req.session.uId=data[0].uId;
					 res.send({
						code:1,
						msg:'登录成功！'
					 }); 
				  }
				  else{
					 res.send({msg:'密码不正确！'});
				  }
			  }
			  else{
					res.send({msg:'该账户不存在，请先去注册！'})
			  }		            
		  }
		})
	  })
	 
	 	
	
     
     return router;

}