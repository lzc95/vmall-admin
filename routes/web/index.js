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
  db.query(`INSERT INTO customer (nickName,userName,password,reg_time,payPass) VALUES ('${nickName}',
  '${userName}','${password}','${reg_time}','*') `,(err,data)=>{
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
  var checkAttr=req.body.attr;
  db.query(`SELECT * FROM cart WHERE uId='${uId}' AND gId='${gId}' AND checkAttr='${checkAttr}'`,(err,data)=>{
    if(err){
      console.error(err);
    }
    else{
        if(data.length==0){
          db.query(`INSERT INTO cart (uId,gId,num,checkAttr) VALUES('${uId}','${gId}',1,'${checkAttr}')`,(err,data)=>{
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
          db.query(`UPDATE cart SET num=num+1 WHERE uId='${uId}' AND gId='${gId}' AND checkAttr='${checkAttr}'`,(err,data)=>{
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
      temp.push(cart[i].checkAttr);  
      arr.push(temp);  
   }

   //插入订单商品表
   var sql = "INSERT INTO order_goods(`order_number`,`goods_id`,`goods_num`,`goods_price`,`goods_attr`) VALUES ?";
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
      db.query(`UPDATE goods SET sale=sale+'${cart[i].num}' WHERE gId='${cart[i].gId}'`)
    }
  

})


//获取用户当前支付密码状态(是否设置)
router.get('/payPassStatus',(req,res)=>{
    var uId=req.session['uId'];
    db.query(`select * from customer where uId='${uId}'`,(err,data)=>{
        if(err){
          console.log(err);
        }
        else{
           if(data[0].payPass=='*'){
               res.send({
                code:'no'
               })
           }
           else{
              res.send({
                code:'yes'
              })
           }
        }
    })
})

//添加支付密码
router.post('/addPayPass',(req,res)=>{
     var payPass=md5(req.body.payPass);
     var uId=req.session['uId'];
     db.query(`UPDATE customer SET payPass='${payPass}' WHERE uId='${uId}'`,(err,data)=>{
         if(err){
             console.log(err);
             res.send({
               code:0,
               msg:'设置失败'
             })
         }
         else{
             res.send({
                 code:1,
                 msg:'设置成功'
             })
         }
     })
})

//修改支付密码
router.post('/updatePayPass',(req,res)=>{
  var oldPayPass=md5(req.body.oldPayPass);
  var newPayPass=md5(req.body.newPayPass);
  var uId=req.session['uId'];
  db.query(`select * from customer where uId='${uId}'`,(err,data)=>{
      if(err){
          console.log(err);
      }
      else{
          if(data[0].payPass==oldPayPass){
             db.query(`UPDATE customer SET payPass='${newPayPass}' WHERE uId='${uId}'`,(err,data)=>{
                if(err){
                  console.log(err);
                }
                else{
                   res.send({
                     code:1,
                     msg:'修改成功'
                   })
                }
             })
          }
          else{
             res.send({
               code:0,
               msg:'原密码输入不正确'
             })
          }
      }
  })
})

//验证支付密码
router.post('/checkPayPassword',(req,res)=>{
    var uId=req.session['uId'];
    var payPass=md5(req.body.payPass.join(''));
    db.query(`select * from customer where uId='${uId}'`,(err,data)=>{
       if(err){
         console.log(err);
       }
       else{
          if(data[0].payPass==payPass){
               res.send({
                   code:1,
                   msg:'支付成功'
               })
          }
          else{
              res.send({
                code:0,
                msg:'支付失败'
              })
          }
       }
    })
})



//获取所有订单
router.post('/allOrder',(req,res)=>{
   var uId=req.session['uId'];
   db.query(`select * from order_table,order_goods,goods where 
   order_table.order_number=order_goods.order_number and order_goods.goods_id=goods.gId
   and order_table.uId='${uId}' order by order_table.order_id desc`,(err,data)=>{
         if(err){
           console.log(err)
         }
         else{
             res.send({
               code:1,
               order:data
             })
         }
   })
})


//获取订单详细信息
router.post('/orderDetail',(req,res)=>{
   var order_number=req.body.order_number;
   var uId= req.session['uId'];
   db.query(`select * from order_table,order_goods,goods,address where 
   order_table.order_number=order_goods.order_number and order_table.order_number='${order_number}'
   and order_table.aId=address.aId and order_goods.goods_id=goods.gId`,(err,data)=>{
       if(err){
           console.log(err)
           res.send({
              code:-1,
              msg:'数据库异常'
           })
       }
       else{
         res.send({
            orderDetail:data
         })
       }
   })
})

 // 修改账户密码
  router.use('/changePass',require('./changePass')());

 // 退出登录
router.get('/logout',(req,res)=>{
      req.session.nickName=null;
      req.session.uId=-1;
      res.send({
          code:1
      })
})

module.exports = router;
