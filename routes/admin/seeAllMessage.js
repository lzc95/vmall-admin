const express=require('express');
const mysqlConn=require('../../libs/mysql_conn');

module.exports=function(){
	 var router = express.Router();
	 var db=mysqlConn();
	 router.get('/',(req,res)=>{
	 	 db.query(`SELECT * FROM news_table ORDER BY date DESC`,(err,data)=>{
             if(err){
             	console.error(err);
             }
             else{
             	res.render('admin/seeAllMessage.ejs',{adminname:req.session['adminname'],messageData:data})
             }
	    })
	 })

	 return router;
	 
}