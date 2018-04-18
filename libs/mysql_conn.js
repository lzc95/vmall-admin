const  mysql=require('mysql');
module.exports=function(){
   return mysql.createPool({
	     host:'localhost',
		 port:3306,
		 user:'root',
		 password:'luozc1995',
		 database:'mall',
		 multipleStatements: true 
    })
}
