const express=require('express');
const mysqlConn=require('../../libs/mysql_conn');
const md5=require('../../libs/md5');
const fs=require('fs');
const pathLib=require('path');

module.exports=function(){
	var router = express.Router();

	router.get('/',(req,res)=>{
       var db=mysqlConn();
       db.query(`select * from order_table,order_goods,goods,address where 
       order_table.order_number=order_goods.order_number and order_table.aId=address.aId 
       and order_goods.goods_id=goods.gId order by order_table.order_id desc`,(err,data)=>{
             if(err){
               console.log(err)
             }
             else{
                  var arr=data;
                  var order_number=[];
                  var orderArr=[];
                  for(var i=0;i<arr.length;i++){
                      if(order_number.indexOf(arr[i].order_number)==-1){
                        order_number.push(arr[i].order_number)
                      }
                  }
                  console.log(order_number)
                  for(var i=0;i<order_number.length;i++){
                      var obj={
                          name:'',
                          content:[],
                          price:'',
                          is_receipt:'',
                          is_ship:'',
                          ship_number:'',
                          address:'',
                          addressName:'',
                          phone:''
                      };
                      for(var j=0;j<arr.length;j++){
                          if(order_number[i]==arr[j].order_number){
                              obj['name']=order_number[i];
                              obj['content'].push(arr[j]);
                              obj['price']=arr[j].pay_price; 
                              obj['is_receipt']=arr[j].is_receipt; //是否已经发货
                              obj['is_ship']=arr[j].is_ship;  //是否已经收货
                              obj['ship_number']=arr[j].ship_number;  //订单号
                              obj['address']=arr[j].address; 
                              obj['addressName']=arr[j].name; 
                              obj['phone']=arr[j].phone; 
                          }
                      }
                      orderArr.push(obj);
                  }
                //待收货
                  var noReceipt=[];
                //待收货
                  var noShip=[]; 
                  //待评价
                  var evaluate=[]
                  for(var i=0;i<orderArr.length;i++){
                      if(orderArr[i].is_receipt==0){
                        noReceipt.push(orderArr[i])
                      }
      
                      if(orderArr[i].is_receipt==1 && orderArr[i].is_ship==0){
                          noShip.push(orderArr[i])
                      }
      
                      if(orderArr[i].is_ship==1){
                        evaluate.push(orderArr[i])
                      }
      
                  }
                  res.render('admin/order.ejs',{adminname:req.session['adminname'],order:orderArr})
             }
       })
		
	});

    
	
	return router;
}