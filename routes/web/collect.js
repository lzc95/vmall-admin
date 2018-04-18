const express=require('express');
const mysqlConn=require('../../libs/mysql_conn.js');
var router = express.Router();
module.exports=function(){
	 var db=mysqlConn();

	 router.post('/',(req,res)=>{
	 	   var uId=req.body.uId;
		   var gId=req.body.gId;
	 	  switch(req.body.act){
	 	  	 case 'query':{
	 	  	 	db.query(`SELECT * FROM goods_collect WHERE uId='${uId}' AND gId='${gId}'`,(err,data)=>{
	 	  	 		if(err){
	 	  	 			console.error(err);
	 	  	 		}
	 	  	 		else{
	 	  	 			if(data.length>0){
	 	  	 				res.send({
	 	  	 					code:1,
	 	  	 					msg:'已收藏'
	 	  	 				})
	 	  	 			}
	 	  	 			else{
	 	  	 				res.send({
	 	  	 					code:0,
                                msg:'未收藏'
	 	  	 				})
	 	  	 			}
	 	  	 		}
	 	  	 	})
	 	  	 };break;
	 	  	 case 'join':{
                 db.query(`INSERT INTO goods_collect (uId,gId) VALUES('${uId}','${gId}')`,(err,data)=>{
                 	if(err){
                 		console.error(err);
                 	}
                 	else{
						res.send({
							code:1,
							msg:'加入收藏'
						})
                 	}
                 })
	 	  	 };break;
	 	  	 case 'cancel':{
	 	  	 	 db.query(`DELETE FROM goods_collect WHERE uId='${uId}' AND gId='${gId}'`,(err,data)=>{
	 	  	 	 	if(err){
	 	  	 	 		console.error(err);
	 	  	 	 	}
	 	  	 	 	else{
						res.send({
							code:1,
							msg:'取消收藏'
						})
	 	  	 	 	}
	 	  	 	 })
             
	 	  	 };break;

	 	  }
	 })

	 return router;

}