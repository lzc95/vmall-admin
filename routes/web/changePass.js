const express=require('express');
const mysqlConn=require('../../libs/mysql_conn.js');
const md5=require('../../libs/md5.js');
var router = express.Router();

module.exports=function(){
	var db=mysqlConn();
	

	router.get('/',(req,res)=>{
		if(req.session['user_id']){
            res.render('web/changePass.ejs',{username:req.session['username']});
	    }
	    else{
	    	res.redirect('/');
	      
	    }
		
	})


	router.post('/',(req,res)=>{ 
       
         var user_id=req.session['user_id']
         switch(req.body.act){
         	// 查询原密码是否正确
         	case 'query':{
         		 db.query(`SELECT * FROM user_table WHERE user_id='${user_id}'`,(err,data)=>{
	         	  if(err){
	         	  	console.error(err);
	         	  }
	         	  else{
	         	  	 if(data.length==0){
	         	  	 	 res.status(500).send({
	         	  	 	 	code:-1,
	         	  	 	 	msg:'数据库查询失败！'
	         	  	 	 }).end();
	         	  	 }
	         	  	 else{
	         	  	 	 if(md5(req.body.password)==data[0].password){
	         	  	 	 	 res.send({
	         	  	 	 	 	code:1,
	         	  	 	 	 	msg:''
	         	  	 	 	 })
	         	  	 	 }
	         	  	 	 else{
	         	  	 	 	 res.send({
	         	  	 	 	 	code:0,
	         	  	 	 	 	msg:'原密码不正确！'
	         	  	 	 	 })
	         	  	 	 }

	         	  	 }
	         	  }
	            })
         		};break;
         		// 修改密码
         	case 'change':{
         		 var password=md5(req.body.password); 
         		 var user_id=req.session['user_id'];
         		 db.query(`UPDATE user_table SET password='${password}' WHERE user_id='${user_id}'`,(err,data)=>{
         		 	  if(err){
         		 	  	console.error(err);
         		 	  }
         		 	  else{
                          res.send({
                          	code:1,
                          	msg:'修改密码成功'
                          })
         		 	  }
         		 })
         	};break;

         }
        
	 })

	return router;
}