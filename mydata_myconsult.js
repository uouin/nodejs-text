//页面初始化时，获取用户咨询列表
$(function() {
    var init ={
        page : 1,
        totalPage : 1,
        rows :8,
        year:"",
        isloding : false
    }
    getinfo();
    $('.font').delegate(".seemore","click",function() {
        location.href = "askagain.html?id="+$(this).data("id")+"&doctor_id="+$(this).data("doc");
    });
    $(window).on("scroll", function () {
        log("1")
        if (init.page <= init.totalPage) {
            pageScroll($(".font"), function () {
                getinfo();
            });
        }
    });

   function getinfo(){
       if(init.isloding){return}
       init.isloding = true;
       log(
               "page-->"+init.page
       )
       ajaxFun("/user/record/getadvice", "GET", {
           user_id:localStorage.uid,
           rows:init.rows,
           page:init.page
       },function(result) {
           init.isloding = false;
           log((result))
           if("1"==result.sign){
               //列表获取成功后填充
               if(null !=result.d && undefined !=result.d  ) {
                   var htmlStr = '';

                   init.totalPage = Math.ceil(Number(result.d.total) / init.rows);
                   for(var num in result.d) {
                       var data = result.d[num];
                       for(var index in data)
                       {
                           if(init.year == null || init.year != data[index].time) {
                               init.year = data[index].time;
                               htmlStr += '<div class="yeartag">' + init.year + '</div>';
                           }
                           htmlStr += '<div class="tidingspanel"><div class="datetag">';
                           htmlStr += '<span class="dateicon"></span><span class="dateinfo">' + format(data[index].date)  + '</span></div>';
                           htmlStr += '<div class="timeaxis"><div class="tidingsdiv">';
                           htmlStr += '<img class="headimg" src="' + data[index].portrait + '" onerror=this.src='+'"../image/head.png"'+'>';
                           htmlStr += '<div><span class="infotitle">' + format(data[index].name) + '</span></div>';
                           htmlStr += '<div class="tidings"><span class="infodescrip">';
                           htmlStr += "我的病情描述 : "+format(data[index].description) +'</span></div>';
                           htmlStr += '<p class="seemore" data-doc='+ data[index].doctor_id+' data-id='+ data[index].consult_id+'>查看对话</p></div></div></div>';
                       }

                   }
                   if(init.page==1){
                       $(".font").html(htmlStr);
                   }else{
                       $(".font").append(htmlStr);
                   }
                   ++init.page;

               }
               else{
                   log("未携带参数")
               }
           } else {
               console.log("错误:"+result.msg);
               return result.msg;
           }
       });
   }
	

    function datetostr(date){
        var datearray = date.split("-");
        return datearray[0]+"月"+datearray[1]+"日";
    }
});
