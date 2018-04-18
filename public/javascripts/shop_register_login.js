 function login(url,data,fn){
          $.ajax({
               url:url,
               type:"POST",
               data:data,
               success:fn,
               error:function(){

               }
          })
   }
  $(function(){
       // <!-- 商家注册 -->
       $("#shopRegister").click(function(){
           $.ajaxFileUpload({
                url:"/shopRegister",   //用于文件上传的服务器端请求地址
                type:'POST',
                secureuri:false,//一般设置为false
                data:{
                   shop_name:$('#shopRegisterEmail').val(),
                   shop_password:$("#shopRegisterPass").val(),
                },
                fileElementId:'shopCardImg',//文件上传控件的id属性 
                dataType: 'JSON', //返回值类型 一般设置为json
                success: function (data)  //服务器成功响应处理函数
                {
                     alert(data)

                },
                error: function (data, status, e)//服务器响应失败处理函数
                {     
                    alert(e);
                }
            });
       })


       // 用户注册
        $('#userRegister').click(function(){
            $.ajax({
               url:'/userRegister',
               type:'POST',
               data:{
                    username:$('#userRegisterEmail').val(),
                    password:$('#userRegisterPass').val(),
               },
               success:function(data){
                  alert(data);
               }
            })
        })
       
       $("#Submit").click(function(){
                 // <!-- 商家登录 -->
            if($("input[type='radio']:checked").val()=='shop'){
                 login('/login',{
                  act:'shop',
                  username:$('#loginEmail').val(),
                  password:$("#loginPass").val()
                 },function(data){
                    alert(data.msg);
                    window.location.href='/shop';
                 })
            }   
            if($("input[type='radio']:checked").val()=='user'){
                // 用户登录
                login('/login',{
                  act:'user',
                  username:$('#loginEmail').val(),
                  password:$("#loginPass").val()
                 },function(data){
                    alert(data.msg);
                  
                    window.location.href= window.location.href;

                 })
            }  
       })

      
       // $('#collect_logout').css('dispaly','none');
      // 鼠标经过用户名
      $('#log_username').mouseover(function(){
        // alert('1')
          $('#collect_logout').css('dispaly','block');
      })

      $('#log_username').mouseout(function(){
          $('#collect_logout').css('dispaly','none');
      })

  })