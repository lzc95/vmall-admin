const express=require('express');
const mysqlConn=require('../../libs/mysql_conn.js');
const router=express.Router();

module.exports=function(){
	var db=mysqlConn();
	router.get('/',(req,res)=>{
		 db.query(`SELECT book_name,COUNT(book_id) FROM collect_table GROUP BY book_name
		 ORDER BY COUNT(book_id) DESC LIMIT 0,3 `,(err,data)=>{
		 	if(err){
		 		console.error(err);
		 	}
		 	else{
		 		res.send({
		 			hotsData:data
		 		})
		 	}
		 })
	})
	return router;
}