const express=require('express');

module.exports=function(){
	 var router=express.Router();

	 router.get('/',(req,res)=>{
	 	  req.session.adminname=null;
	 	  res.redirect('/admin')
	 })

	 return router;
}