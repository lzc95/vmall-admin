var express = require('express');
var router = express.Router();
const  mysqlConn=require('../../libs/mysql_conn.js');
const  md5=require('../../libs/md5.js');

var db=mysqlConn();

// 返回一级分类目录
 router.get('/getCategory', function(req, res) {
    db.query(`SELECT * FROM category`,(err,data)=>{
        if(err){
          console.error(err);
        }
        else{
            res.send({
              sortData:data
            })
        }
    })
    
 }); 


  //返回二级目录  
 router.get('/getSubCategory', function(req, res) {
   console.log(req.query.cId)
  db.query(`SELECT * FROM subCategory WHERE cId='${req.query.cId}'`,(err,data)=>{
      if(err){
        console.error(err);
      }
      else{
          res.send({
            subCategory:data
          })
      }
  })
  
}); 
 
//检索二级目录下商品
router.get('/getSubCategoryGoods',(req,res)=>{
    db.query(`SELECT * FROM goods WHERE scId='${req.query.scId}' ORDER BY gTime DESC`,(err,data)=>{
      if(err){
        console.error(err);
      }
      else{
          res.send({
             goodsList:data
          })
      }
  }) 
})

//商品详情
router.get('/getGoodsDetail',(req,res)=>{
  db.query(`SELECT * FROM goods WHERE gId='${req.query.gId}' `,(err,data)=>{
    if(err){
      console.error(err);
    }
    else{
        res.send({
           goods:data
        })
    }
  }) 
})

//用户注册
router.post('/register',(req,res)=>{
  var nickName=req.body.nickName;
  var userName=req.body.userName;
  var password=md5(req.body.password);
  var reg_time=new Date().getTime();
  db.query(`INSERT INTO customer (nickName,userName,password,reg_time) VALUES ('${nickName}',
  '${userName}','${password}','${reg_time}') `,(err,data)=>{
      if(err){
        console.error(err);
      }
      else{
          res.send({
              msg:'注册成功,快去登录吧！'
          })
      }
   }) 
})

//用户登录
router.use('/login',require('./login')());

//获取用户状态
router.get('/getStatus',(req,res)=>{
   
    res.send({
      nickName:req.session['nickName'],
      uId:req.session['uId']
    })
})


//获取用户地址列表
router.get('/address',(req,res)=>{
  var uId=req.session.uId;
  db.query(`SELECT * FROM address WHERE uId='${uId}'`,(err,data)=>{
    if(err){
      console.error(err);
    }
    else{
        res.send({
           addressList:data,
           uId:req.session['uId']
        })
    }
  }) 
})

//添加用户地址
router.post('/address',(req,res)=>{
  var uId=req.session.uId;
  var name=req.body.name;
  var phone=req.body.phone;
  var address=req.body.address;
  db.query(`INSERT INTO address (uId,name,phone,address) 
  VALUES('${uId}','${name}','${phone}','${address}')`,(err,data)=>{
    if(err){
      console.error(err);
    }
    else{
        res.send({
           code:1,
           msg:'添加地址成功'
        })
    }
  }) 
})

//删除用户地址
router.post('/cancelAddress',(req,res)=>{
  var aId=req.body.aId;
  db.query(`DELETE FROM address WHERE aId='${aId}'`,(err,data)=>{
    if(err){
      console.error(err);
      res.send({
        code:0,
        msg:'删除地址失败'
      })
    }
    else{
        res.send({
           code:1,
           msg:'删除地址成功'
        })
    }
  }) 
})




// 收藏功能
 router.use('/collect',require('./collect')());

 // 获取用户收藏
router.get('/getCollectGoods',(req,res)=>{
    db.query(`SELECT goods.*,goods_collect.* FROM goods,goods_collect WHERE 
      goods_collect.uId='${req.session['uId']}' AND goods.gId=goods_collect.gId 
      ORDER BY goods_collect.collectId DESC`,(err,data)=>{
      if(err){
        console.error(err);
      }
      else{
        res.send({
            collectList:data,
            uId:req.session['uId']
        })
      }
    })
 });


 //添加购物车
 router.post('/addCart',(req,res)=>{
  var uId=req.body.uId;
  var gId=req.body.gId;
  db.query(`SELECT * FROM cart WHERE uId='${uId}' AND gId='${gId}'`,(err,data)=>{
    if(err){
      console.error(err);
    }
    else{
        if(data.length==0){
          db.query(`INSERT INTO cart (uId,gId,num) VALUES('${uId}','${gId}',1)`,(err,data)=>{
            if(err){
              console.error(err);
            }
            else{
                res.send({
                   code:1,
                   msg:'添加成功'
                })
            }
          }) 
        }
        else{
          db.query(`UPDATE cart SET num=num+1 WHERE uId='${uId}' AND gId='${gId}'`,(err,data)=>{
            if(err){
              console.error(err);
            }
            else{
                res.send({
                   code:1,
                   msg:'添加成功'
                })
            }
          }) 
        }
    }
  }) 
  
})

//获取购物车列表
router.get('/getCart',(req,res)=>{
  db.query(`SELECT goods.*,cart.* FROM goods,cart WHERE cart.uId='${req.session['uId']}'
  AND cart.gId=goods.gId ORDER BY cartId DESC`,(err,data)=>{
    if(err){
      console.error(err);
    }
    else{
      res.send({
          code:1,
          cartList:data,
      })
    }
  })
});

//删除购物车
router.post('/delCart',(req,res)=>{
  cartId=req.body.cartId;
  db.query(`DELETE FROM cart WHERE cartId='${cartId}'`,(err,data)=>{
     if(err){
       console.log(err);
     }
     else{
        res.send({
          code:1,
          msg:'删除购物车成功'
        })
     }
  })
})

//更新购物车商品数量
router.post('/updateCart',(req,res)=>{
  cartId=req.body.cartId;
  num=req.body.num;
  db.query(`UPDATE cart SET num='${num}' WHERE cartId='${cartId}'`,(err,data)=>{
     if(err){
       console.log(err);
     }
     else{
        res.send({
          code:1,
          msg:'更新购物车成功'
        })
     }
  })
})

//搜索商品
router.get('/searchGoods',(req,res)=>{
     var key=decodeURI(req.query.key);
     db.query(`SELECT * FROM goods,subCategory WHERE subCategory.scId=goods.scId
     AND (goods.gName LIKE '%${key}%' OR subCategory.scName LIKE '%${key}%') ORDER BY gTime DESC`,
     (err,data)=>{
      if(err){
        console.log(err);
      }
      else{
         res.send({
           code:1,
           goodsList:data
         })
      }
    })
})


  //获取最新上架12件商品商品
  router.get('/newGoods',(req,res)=>{
      db.query(`SELECT * FROM goods ORDER BY gTime DESC LIMIT 12`,(err,data)=>{
        if(err){
          console.log(err);
        }
        else{
            res.send({
              code:1,
              goodsList:data
            })
        }
      })
  })


  //确认订单
  router.post('/confirmOrder',(req,res)=>{
    var cartArr=req.body.cart
    console.log(cartArr);
    console.log(typeof cartArr);
    db.query(`SELECT goods.*,cart.* FROM goods,cart WHERE goods.gId=cart.gId AND 
    FIND_IN_SET(cartId,'${cartArr}')`,(err,data)=>{
      if(err){
        console.log(err);
      }
      else{
          res.send({
            code:1,
            cart:data
          })
      }
    })
})

//获取默认地址
router.get('/getDefaultAddress',(req,res)=>{
    db.query(`select * from address WHERE uId='${req.session['uId']}' limit 1`,(err,data)=>{
       if(err){
         console.log(err);
       }
       else{
         res.send({
            defaultAddress:data
         })
       }
    })
})

//提交订单
router.post('/submitOrder',(req,res)=>{
  var cart=req.body.cart;
  var pay_price=req.body.pay_price;
  var arr=req.body.aId;
  var aId=arr[0].aId;
  var order_number=new Date().getTime();
  var uId=req.session.uId;
 
  //插入订单
  db.query(`INSERT INTO order_table (order_number,uId,pay_price,aId,ship_number) 
       VALUES('${order_number}','${uId}','${pay_price}','${aId}','0')`,(err,data)=>{
         if(err){
           console.log(err)  
         }
         else{
        
         }
   })

   var arr=[];
   for(var i=0;i<cart.length;i++){
      var temp=[];
      temp.push(order_number);
      temp.push(cart[i].gId);
      temp.push(cart[i].num);
      temp.push(cart[i].gPrice);  
      arr.push(temp);  
   }

   //插入订单商品表
   var sql = "INSERT INTO order_goods(`order_number`,`goods_id`,`goods_num`,`goods_price`) VALUES ?";
   db.query(sql,[arr],function (err,rows,fields) {
    if(err){
       console.log('INSERT ERROR - ',err.message);
      }
      else{
        console.log("INSERT SUCCESS");
      }  
   });

  
  // 清除购物车已提交订单商品
   var cartArr=[];
   for(var i=0;i<cart.length;i++){
       cartArr.push(cart[i].cartId)
   }
   var cartStr=cartArr.join(',');
   db.query(`DELETE FROM cart WHERE FIND_IN_SET(cartId,'${cartStr}')`,(err,data)=>{
      if(err){
          console.log(err)
      }
      else{
          console.log("DELETE SUCCESS");
          res.send({
             code:1
          })
         }
    })

    //更新商品销售数量
    for(var i=0;i<cart.length;i++){
      db.query(`UPDATE goods SET sale='${cart[i].num}' WHERE gId='${cart[i].gId}'`)
    }
  

})
 // 修改密码
//  router.use('/changePass',require('./changePass')());

 // 退出登录
router.get('/logout',(req,res)=>{
      req.session.nickName=null;
      req.session.uId=-1;
      res.send({
          code:1
      })
})

module.exports = router;
