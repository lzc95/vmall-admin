
// 商家账户管理
const express=require('express');
const mysqlConn=require('../../libs/mysql_conn');
const md5=require('../../libs/md5');

// 判断数组是否存在某值
const contains=require('../../libs/contains');


module.exports=function(){
	 var router=express.Router();
     db=mysqlConn();

	 router.get('/',(req,res)=>{
	 	res.render('shop/accountManage.ejs',{shopname:req.session['shopname']})
	 })
     
     // 用户名修改
      router.post('/changeName',(req,res)=>{
      	   var newUsername=req.body.username;
      	   var shop_id=req.session['shop_id'];
      	   var flag=true;

      	   db.query(`SELECT shop_name FROM shop_table`,(err,data1)=>{
      	   	  if(err){
      	   	  	console.error(err);
      	   	  }
      	   	  else{
      	   	  	var arr=[];
      	   	  	   for(var i=0;i<data1.length;i++){
      	   	  	   	 arr.push(data1[i].shop_name);
      	   	  	   }
      	   	  	   if(contains(arr,newUsername)){
      	   	  	 	  res.send({
      	   	  	 	  	code:0,
      	   	  	 	  	msg:'修改失败,该邮箱已被使用'
      	   	  	 	  }).end();
      	   	  	    }
      	   	  	    else{
      	   	  	 	 db.query(`UPDATE shop_table SET shop_name='${newUsername}' WHERE shop_id='${shop_id}'`,(err,data2)=>{
      	   	  	 	 	  if(err){
      	   	  	 	 	  	console.error(err);
      	   	  	 	 	  }
      	   	  	 	 	  else{
      	   	  	 	 	  	 req.session.shopname=newUsername;
      	   	  	 	 	  	 res.send({
      	   	  	 	 	  	 	code:1,
      	   	  	 	 	  	 	msg:'用户名修改成功'
      	   	  	 	 	  	 })
      	   	  	 	 	  }
      	   	  	 	 })
      	   	  	 }
      	   	  }
      	   })

      })

     // 密码处理
	 router.post('/changePass',(req,res)=>{ 
       
         var shop_id=req.session['shop_id']
         switch(req.body.act){
         	// 查询原密码是否正确
         	case 'query':{
         		 db.query(`SELECT * FROM shop_table WHERE shop_id='${shop_id}'`,(err,data)=>{
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
	         	  	 	 if(md5(req.body.password)==data[0].shop_password){
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
         		 var shop_id=req.session['shop_id'];
         		 db.query(`UPDATE shop_table SET shop_password='${password}' WHERE shop_id='${shop_id}'`,(err,data)=>{
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