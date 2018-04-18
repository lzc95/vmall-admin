$(function(){
	$.ajax({
		url:'/hots',
		type:"GET",
		data:{
            
		},
		success:function(data){

            $('.hots').eq(0).html(data.hotsData[0].book_name);
            $('.hots').eq(0).attr('href','book_search?bookName='+data.hotsData[0].book_name)
            $('.hots').eq(1).html(data.hotsData[1].book_name);
            $('.hots').eq(1).attr('href','book_search?bookName='+data.hotsData[1].book_name)
            $('.hots').eq(2).html(data.hotsData[2].book_name);
            $('.hots').eq(2).attr('href','book_search?bookName='+data.hotsData[2].book_name)

		}
	})
})