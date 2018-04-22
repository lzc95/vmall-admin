const express=require('express');
const mysqlConn=require('../../libs/mysql_conn.js');
const md5=require('../../libs/md5.js');
var router = express.Router();

module.exports=function(){
	var db=mysqlConn();
	
	router.post('/',(req,res)=>{
		var oldPassword=md5(req.body.oldPass);
		var newPassword=md5(req.body.newPass);
		var uId=req.session['uId']
		db.query(`select * from customer where uId='${uId}'`,(err,data)=>{
			if(err){
				console.log(err);
			}
			else{
				if(data[0].password==oldPassword){
				   db.query(`UPDATE customer SET password='${newPassword}' WHERE uId='${uId}'`,(err,data)=>{
					  if(err){
						console.log(err);
					  }
					  else{
						 res.send({
						   code:1,
						   msg:'修改成功'
						 })
					  }
				   })
				}
				else{
				   res.send({
					 code:0,
					 msg:'原密码输入不正确'
				   })
				}
			}
		})
	})
       
        

	return router;
}