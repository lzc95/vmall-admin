const express=require('express');
const mysqlConn=require('../../libs/mysql_conn');
const md5=require('../../libs/md5');
const fs=require('fs');
const pathLib=require('path');

module.exports=function(){
	var router = express.Router();

	router.get('/',(req,res)=>{
       var db=mysqlConn();
       db.query(`SELECT * FROM shop_table WHERE flag =1`,(err,data)=>{
            if(err){
               console.error(err);
            }
            else{            
               res.render('admin/manageShop.ejs',{adminname:req.session['adminname'],shopData:data});
            }
       })
		
	});

    
	router.post('/',(req,res)=>{        
         // 连接数据库
         var db=mysqlConn();
         switch(req.body.act){
            case 'del':{
               var id=req.body.id;
               db.query(`SELECT shop_cardImg FROM shop_table WHERE shop_id='${id}'`,(err,data)=>{
                  if(err){
                    console.error(err);
                  }
                  else{
                       var pathname=pathLib.resolve(__dirname,'../../','public','upload');
                       fs.unlink(pathLib.join(pathname,data[0].shop_cardImg),(err)=>{
                        if(err){
                          console.error(err);
                        }
                        else{
                           db.query(`DELETE FROM shop_table WHERE shop_id='${id}'`,(err,data)=>{
                               if(err){
                                  console.error(err);
                               }
                               else{
                                   res.send({
                                     code:1,
                                     msg:'账户删除成功！'
                                   })
                               }
                            })
                         }
                      })
                  }
               })
            };break;
         }
        
	})
	return router;
}