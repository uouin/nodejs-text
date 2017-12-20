var globalUrl = "http://wx.yidhealth.com/api/1.0.0";
//var globalUrl = "http://10.10.40.8:8080/api/1.0.0";

//var globalUrl = "http://jkw.zoewin.com/api/1.0.0";
//var globalUrl = "http://www.xmekw.com/api/1.0.0";
//var globalUrl = "http://106.14.180.44/api/1.0.0";
//var globalUrl = "http://health.tunnel.qydev.com/api/1.0.0";
//localStorage.uid =138;
//localStorage.doctorid = 12;
//localStorage.childId = 62;
//localStorage.idCard = 510304200707025825;
//localStorage.birthDay = "2000-6-6";
//localStorage.illsType = [];//患儿疾病种类
//localStorage.pef
//localStorage.seekType
var headers = {};
    headers.uid = localStorage.uid;
    headers.token = localStorage.token;
/**
 * AJAX调用后端
 * @param apiMethod
 * @param type
 * @param callback
 * @param time
 * @param dataType
 * @param asyncBoolean
 */
function remoteService(apiMethod, type, callBack, time, dataType, asyncBoolean) {
    showWaiting();
	var url = '';
	if(apiMethod != null && apiMethod != undefined) {
		if(apiMethod.indexOf("http://") >= 0) {
			url = apiMethod;
		} else {
			url = globalUrl + apiMethod;
		}
	}
	if (type == null || type == undefined) {
		type = "GET";
	}
	if (time == null || time == undefined) {
		time = 10000;
	}
	if (dataType == null || dataType == undefined) {
		dataType = "json";
	}
	if (asyncBoolean == null || asyncBoolean == undefined) {
		asyncBoolean = true;
	}
	$.ajax({
        headers:headers,
		url : url,
		dataType : dataType,
		type : type,
		contentType : "application/json",
		async : asyncBoolean,
		timeout : time,
        statusCode:{
            404: function() {
                showDialog("服务器无响应,请稍后再试");
            },
            422: function() {
                showDialog("应用程序请求对象错误,请稍后再试");
            },
            403: function() {
                showDialog("无访问权限");
            },
            400: function() {
                showDialog("应用程序请求无效,请稍后再试");
            }
        },
		success : callBack,
        complete:completeToDo,
		error : errorFun
	});
    function completeToDo(){
//        if(undefined !=completeFun &&""!=completeFun){
//            completeFun();
//        }
        hideWaiting();
    }
	function errorFun(error) {
		console.log(error);
        showDialog("无法连接至服务器,请稍后再试");
    }
}
function getOptions(opt, data){
    var params = new Array();
    for(var str in data){
        params.push(str +'='+data[str]);
    }
    if(params.length>0){
        if(opt.url.indexOf("?")<0){
            opt.url+="?"
        }
        opt.url += params.join("&");
    }
    return opt;
};
function postOptions(opt, data){
    opt.data = JSON.stringify(data);
    return opt;
};

function ajaxFun(apiMethod, type, data, callback, completeFun ,dataType, asyncBoolean) {
    showWaiting();
	var url = '';
	if(apiMethod != null && apiMethod != undefined) {
		if(apiMethod.indexOf("http://") >= 0) {
			url = apiMethod;
		} else {
			url = globalUrl + apiMethod;
		}
	}
	if (type == null || type == undefined) {
		type = "POST";
	}
	if (dataType == null || dataType == undefined) {
		dataType = "json";
	}
	if (asyncBoolean == null || asyncBoolean == undefined) {
		asyncBoolean = true;
	}
    var opt = {
        headers:headers,
        url : url,
        dataType : dataType,
        type : type,
        contentType : "application/json",
        async : asyncBoolean,
        timeout : 10000,
        //data: JSON.stringify(data),
        statusCode:{
            404: function() {
                showDialog("服务器无响应,请稍后再试");
            },
            422: function() {
                showDialog("应用程序请求对象错误,请稍后再试");
            },
            403: function() {
                showDialog("无访问权限");
            },
            400: function() {
                showDialog("应用程序请求无效,请稍后再试");
            }
        },
        success : callback,
        complete:completeToDo,
        error : errorFun
    };
    if(type.toLowerCase() == "get"){opt = getOptions(opt, data);}
    else{opt = postOptions(opt, data);}
	$.ajax(opt);

    function completeToDo(){
        if(undefined !=completeFun &&""!=completeFun && typeof (completeFun)=='function'){
            completeFun();
        }
        hideWaiting();
    }
	function errorFun(error) {
		console.log(error);
        showDialog("无法连接至服务器,请稍后再试");
    }
}

/**
 * Form表单提交
 * @param form
 * @param apiMethod
 * @param callback
 * @param time
 * @param dataType
 * @param asyncBoolean
 */
function remoteServiceForm(form, apiMethod, callback, time, dataType,
		asyncBoolean) {
    showWaiting();
	console.info(arrayToJson(form.serializeArray()));
	if (time == null || time == undefined) {
		time = 10000;
	}
	if (dataType == null || dataType == undefined) {
		dataType = "json";
	}
	if (asyncBoolean == null || asyncBoolean == undefined) {
		asyncBoolean = true;
	}
	$.ajax({
		dataType : dataType,
		type : "POST",
		url : globalUrl + apiMethod,
		contentType : "application/json",
		data : arrayToJson(form.serializeArray()),
        statusCode:{
            404: function() {
                showDialog("服务器无响应,请稍后再试");
            },
            422: function() {
                showDialog("应用程序请求对象错误,请稍后再试");

            },
            403: function() {
                showDialog("无访问权限");
            },
            400: function() {
                showDialog("应用程序请求无效,请稍后再试");
            }
        },
		async : asyncBoolean,
		success : callback,
        complete:completeToDo,
		error : function(request) {
            showDialog("无法连接至服务器,请稍后再试");
            console.info(request.status);
		}
	});

    function completeToDo(){
        hideWaiting();
    }
}

/**
 * 数组转JSON字符串
 * @param formArray
 * @returns
 */
function arrayToJson(formArray) {
	var dataArray = {};
	$.each(formArray, function() {
		if (dataArray[this.name]) {
			if (!dataArray[this.name].push) {
				dataArray[this.name] = [ dataArray[this.name] ];
			}
			dataArray[this.name].push(this.value || '');
		} else {
			dataArray[this.name] = this.value || '';
		}
	});
	return JSON.stringify(dataArray);
//    var dataArray = {};
//    $.each(formArray, function(index,value) {
//        dataArray[value.name] = value.value;
//    });
//    return JSON.stringify(dataArray);
}
/**
 * 数组转JSON
 * @param formArray
 * @returns
 */
function arrayToJsonObj(formArray){
        var dataArray = {};
        $.each(formArray, function(index,value) {
            dataArray[value.name] = value.value;
        });
        return dataArray;
}
/**
 * 校验是否填写孩子
 * @param mobile
 * @returns {Boolean}
 */
function vertifyChild(){
    if(localStorage.childId == null || localStorage.childId == undefined || localStorage.childId == ''){
        ajaxFun("/user/my/getchildbyuser", "GET",
            {
                "user_id": localStorage.uid
            },
            function(result) {
//                alert(JSON.stringify(result))
                if("1"==result.sign) {
                    if("" !=result.d && null !=result.d && undefined !=result.d  ) {
                        localStorage.childId = result.d;

                        return true;
                    }else{
                        showDialog("您还未填写孩子的信息,请先填写",function(){
                            location.href = "../user/modifyinfo.html"
                            return false;
                        },1500);
                    }
                }else{
                    showDialog(result.msg)
                }
            });
//        showDialog("您还未填写孩子的信息,请先填写",function(){
//            location.href = "../user/modifyinfo.html"
//            return false;
//        },1500);
    }
    else{return true;}
}
/**
 * 校验身高体重是否为空
 * @param mobile
 * @returns {Boolean}
 */
function vertifyhw(){
    if(localStorage.childWight == null || localStorage.childWight == undefined || localStorage.childWight == ''
      ||localStorage.childHeight == null || localStorage.childHeight == undefined || localStorage.childHeight == ''){
        showDialog("您还未填写孩子的身高体重,请先填写",function(){
            location.href = "../user/modifyinfo.html"
            return false;
        },1500);
    }
    else{return true;}
}
/**
 * 计算孩子几岁
 */
function getAge(){
    var birth = localStorage.birthDay;
    var birthunix = dateToUnix(birth);
    var nownuix = parseInt(new Date().getTime()/1000);
    var agedate = (nownuix-birthunix)/31536000;
    if(agedate<0){
        showDialog("出生日期填写错误,请重新填写!");
        location.href = "../user/modifyinfo.html"
        return false;
    }else{
        return Math.floor(agedate);
    }

}
/**
 * 通过身份证计算孩子几岁
 */
function getIdcardAge(idCard){
    var birthday = "";
    if(idCard != null && idCard != ""){
        if(idCard.length == 15){
            birthday = "19"+idCard.substr(6,6);
        } else if(idCard.length == 18){
            birthday = idCard.substr(6,8);
        }
        birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
    }

    return birthday;
}

/**
 * 校验是否为空
 * @param mobile
 * @returns {Boolean}
 */
function notEmp(data,conn,$that){
    if(data == null || data == undefined || data == ''){
        showDialog(conn);
        if($that&&typeof ($that)=='object'){
            letFocus($that);
        }
        return false;
    }
    else{return true;}
}
/**
 * 校验身高是否合理
 * @param mobile
 * @returns {Boolean}
 */
function checkHeight(height){
    if(height>45 && height<190){
        return false;
    }
    else{
        showDialog("身高不合理,请重新填写");
        return true;
    }
}
/**
 * 校验体重是否合理
 * @param mobile
 * @returns {Boolean}
 */
function checkWeight(weight){
    if(weight>2 && weight<101){
        return false;
    }
    else{
        showDialog("体重不合理,请重新填写");
        return true;
    }
}
/**
 * 校验峰流值是否合理
 * @param mobile
 * @returns {Boolean}
 */
function checkPef(pef){
    if(pef>0 && pef<500){
        return false;
    }
    else{
        showDialog("峰流值不合理,请重新填写");
        return true;
    }
}
/**
 * 校验手机号码
 * @param mobile
 * @returns {Boolean}
 */
function validateMobile(mobile) {
    if(mobile.length==0)
    {
        showDialog('请输入手机号码！');
        return false;
    }
    if(mobile.length!=11)
    {
        showDialog('请输入有效的手机号码！');
        return false;
    }

    var telReg = !!mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    if(!telReg)
    {
        showDialog('请输入有效的手机号码！');
        return false;
    }
    else{
        return true;
    }
}
/**
 * 校验身份证号
 * @param mobile
 * @returns {Boolean}
 */
function checkIdCard(str) {
    var num = (str==""&&str==null) ? "" : String(str);
    num = num.toUpperCase();           //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        showDialog('身份证号长度不正确！');
        return false;
    }
    //验证前2位，城市符合
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    if(aCity[parseInt(num.substr(0,2))]==null){
        showDialog('身份证号不符合规定');
        return false;
    }

    //下面分别分析出生日期和校验位
    var len, re; len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);  //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay; bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
//                alert('身份证号的出生日期不对！');
            showDialog('身份证号的出生日期不对');
            return false;
        } else { //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for(i = 0; i < 17; i ++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);  //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay; bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            //alert(dtmBirth.getYear());
            //alert(arrSplit[2]);
//                alert('身份证号的出生日期不对！');
            showDialog('身份证号的出生日期不对');
            return false;
        }
        else { //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for(i = 0; i < 17; i ++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                //alert('18位身份证的校验码不正确！应该为：' + valnum);
//                    alert('18位身份证号的校验码不正确！');
                showDialog('身份证号校验不通过');
                return false;
            }
            return true;
        }
    } return false;
}
//显示吐司
function showDialog(conn,callBack,second) {
    if(second==null||second==""){
        second = 1500;
    }
    if($("#toast").length>0)return;
    if(conn==null || conn==undefined ||conn=="")return;
    var toast = '<div id="toast">'
//        +'<div class="weui-mask_transparent"></div>'
        +'<div class="toast">'
        +'<p>'+conn+'</p>'
        +'</div></div>';

    $("body").append(toast);
    setTimeout(function () {
        $("#toast").remove();
    }, second);
    if(typeof(callBack)=="function"){
        setTimeout(callBack,second);
    };
}
//加载等待
function showWaiting() {
    if($("#loadingToast").length>0)return;
    var toast = '<div id="loadingToast">';
    toast +='<div class="weui-mask_transparent"></div>';
    toast +='<div class="weui-toast">';
    toast +='<i class="weui-loading weui-icon_toast"></i>';
    toast +='<p class="weui-toast__content">数据加载中</p>';
    toast +='</div>';
    toast +='</div>';

    $("body").append(toast);
//    setTimeout(function () {
//        $("#toast").remove();
//    }, 1500);
}
//关闭等待
function hideWaiting() {
    if($("#loadingToast").length>0){
        $("#loadingToast").remove();
    }else{
        return
    }
}
//加载等待
function showConfirm(title,conn,successCallback) {
    if($("#iosDialog").length>0)return;
    var toast = '<div class="js_dialog" id="iosDialog" style="opacity: 1;">';
    toast +='<div class="weui-mask"></div>';
    toast +='<div class="weui-dialog">';
    toast +='<div class="weui-dialog__hd"><strong class="weui-dialog__title">'+title+'</strong></div>';
    toast +='<div class="weui-dialog__bd">'+conn+'</div>';
    toast +='<div class="weui-dialog__ft">';
    toast +='<a id="showConfirmCancel" class="weui-dialog__btn weui-dialog__btn_default">取消</a>';
    toast +='<a id="showConfirmSure" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>';
    toast +='</div>';
    toast +='</div>';
    toast +='</div>';

    $("body").append(toast);
    $("#showConfirmCancel").click(function(){
        $("#iosDialog").remove();
    });
    $("#showConfirmSure").click(function(){
        $("#iosDialog").remove();
        successCallback();
    });
}
function letFocus($that){
    $that.pulsate({
        color: "#FFD700",                      //$(this).css("background-color","#fc849f"), // set the color of the pulse
        reach: 5,                              // how far the pulse goes in px
        speed: 1000,                            // how long one pulse takes in ms
        pause: 0,                               // how long the pause between pulses is in ms
        glow: true,                             // if the glow should be shown too
        repeat: 3,                           // will repeat forever if true, if given a number will repeat for that many times
        onHover: false                          // if true only pulsate if user hovers over the element
    });
    $that.focus();
}
//取地址的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//替换空值
function format(conn) {
    return conn?conn:" ";
}
//替换空值
function formatNoValue(conn) {
    return conn?conn:"未知";
}
//替换空值
function log(conn) {
    console.log(conn);
}
//按照数组的某个字段排序
//用法 gooddata.sort(sortBy('situation'),true);
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
function sortBy(attr,rev){
    //第二个参数没有传递 默认升序排列
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }

    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}
//假数据
function ydata(){
//    return xiaoxi = {"sign":"1","d":[{"memberId":3,"hospital":"厦门大学附属第一医院","doctorId":16,"location":"思明区","officeUserId":4,"doctorNameContent":"陈幼芬","administrativeName":"呼吸","recordDate":"2017-05-19 00:00:00","year":"2017年","monthDay":"05月19日","messageType":1},{"memberId":0,"hospital":"","doctorId":12,"location":"","officeUserId":3,"doctorNameContent":"张医生提醒你做问卷","administrativeName":"","recordDate":"2017-04-24 16:17:59","year":"2017年","monthDay":"05月19日","messageType":1},{"memberId":0,"hospital":"","doctorId":14,"location":"疾病描述内容3","officeUserId":3,"doctorNameContent":"咨询回复内容","administrativeName":"","recordDate":"2017-04-19 10:00:35","year":"2017年","monthDay":"04月19日","messageType":2}],"msg":"操作成功"};
//    return yuyue ={"sign":"1","d":{"doctor_name":"郭天兴","price":30,"best_domain":"行为障碍，发育障考虑考虑","postion":"儿科医生","doctor_id":12,"memberId":3,"dept_name":"儿童保健","visitTime":[{"visit_location":"这是预约地点1","visitTime":[{"timezone":"09:00~09:10","isLeisure":true},{"timezone":"09:10~09:20","isLeisure":false},{"timezone":"09:20~09:30","isLeisure":false},{"timezone":"09:30~09:40","isLeisure":false},{"timezone":"09:40~09:50","isLeisure":false},{"timezone":"09:50~10:00","isLeisure":true}],"date":"2017-05-16","week":"星期一"},{"visit_location":"这是预约地点2","visitTime":[{"timezone":"09:00~09:10","isLeisure":false},{"timezone":"09:10~09:20","isLeisure":false},{"timezone":"09:20~09:30","isLeisure":true},{"timezone":"09:30~09:40","isLeisure":false},{"timezone":"09:40~09:50","isLeisure":false},{"timezone":"09:50~10:00","isLeisure":true}],"date":"2017-05-17","week":"星期一"},{"visit_location":"这是预约地点3","visitTime":[{"timezone":"09:00~09:10","isLeisure":true},{"timezone":"09:10~09:20","isLeisure":false},{"timezone":"09:20~09:30","isLeisure":false},{"timezone":"09:30~09:40","isLeisure":false},{"timezone":"09:40~09:50","isLeisure":false},{"timezone":"09:50~10:00","isLeisure":false}],"date":"2017-05-15","week":"星期一"}],"hospital":"社区医院2"},"msg":"操作成功"};
//      return zixun = {"sign":"1","d":[{"minute":null,"time":"2017-05-16 14:31:57.0","hours":"14","description":"用户问1","name":"陈皮","month":"05-16","year":"2017","type":0,"portrait":null},{"minute":null,"time":"2017-05-16 14:33:51.0","hours":"14","description":"医生回复1","name":"陈明智","month":"05-16","year":"2017","type":1,"portrait":null},{"minute":null,"time":"2017-05-17 14:32:17.0","hours":"14","description":"用户问2","name":"陈皮","month":"05-17","year":"2017","type":0,"portrait":null},{"minute":null,"time":"2017-05-17 16:47:11.0","hours":"16","description":"用户问6","name":"陈皮","month":"05-17","year":"2017","type":0,"portrait":null},{"minute":null,"time":"2017-05-17 16:52:22.0","hours":"16","description":"医生回复6","name":"陈明智","month":"05-17","year":"2017","type":1,"portrait":null},{"minute":null,"time":"2017-05-17 20:10:33.0","hours":"20","description":"新咨询","name":"陈皮","month":"05-17","year":"2017","type":0,"portrait":null},{"minute":null,"time":"2017-05-18 14:34:04.0","hours":"14","description":"医生回复2","name":"陈明智","month":"05-18","year":"2017","type":1,"portrait":null}],"msg":"操作成功"};
//      return yongyao = {"sign":"1","d":[{"id":13,"standard":["80/4.5μg ","160/4.5μg"],"name":"布地奈德福莫特罗","dosage":["吸/次","次/日","日(疗程)"]},{"id":1,"standard":["80/4.5μg ","160/4.5μg"],"name":"布地奈德福莫特罗","dosage":["吸/次","次/日","月(疗程)"]},{"id":2,"standard":["25/50μg","25/100μg","50/250μg"],"name":"沙美特罗替卡松","dosage":["吸/次","次/日","月(疗程)"]},{"id":3,"standard":["50μg","125μg"],"name":"丙酸氯替卡松","dosage":["吸/次","次/日","月(疗程)"]},{"id":4,"standard":["100μg"],"name":"布地奈德吸入剂","dosage":["吸/次","次/日","月(疗程)"]},{"id":14,"standard":["0.5mg/2ml ","1mg/2ml"],"name":"布地奈德混悬液","dosage":["ml/ 次","次/日","日(疗程)"]},{"id":5,"standard":["0.5mg/2ml ","1mg/2ml"],"name":"布地奈德混悬液","dosage":["ml/次","次/日","月(疗程)"]},{"id":6,"standard":["4mg","5mg","10mg"],"name":"孟鲁司特","dosage":["片/次，睡前服用","月(疗程)"]},{"id":9,"standard":["100μg"],"name":"沙丁胺醇气雾剂","dosage":["吸/次","次/日","日(疗程)"]},{"id":10,"standard":["5mg/2.5ml"],"name":"沙丁胺醇溶液","dosage":["ml/ 次","次/日","日(疗程)"]},{"id":11,"standard":["5mg/2ml"],"name":"特布他林溶液","dosage":["ml/ 次","次/日","日(疗程)"]},{"id":12,"standard":["250μg/2ml","500μg/2ml"],"name":"异丙托溴铵溶液","dosage":["ml/ 次","次/日","日(疗程)"]}],"msg":"操作成功"};
//      return zixunxiangqing = {"sign":"1","d":[{"description":"213","hours":"00","minute":null,"month":"05-18","name":"陈","portrait":null,"time":"2017-05-18 00:24:35.0","type":1,"year":"2017"},{"description":"213","hours":"00","minute":null,"month":"05-18","name":"陈","portrait":null,"time":"2017-05-18 00:24:35.0","type":0,"year":"2017"},{"description":"213","hours":"00","minute":null,"month":"05-18","name":"陈","portrait":null,"time":"2017-05-18 00:24:35.0","type":1,"year":"2017"},{"description":"213","hours":"00","minute":null,"month":"05-18","name":"陈","portrait":null,"time":"2017-05-18 00:24:35.0","type":0,"year":"2017"},{"description":"213","hours":"00","minute":null,"month":"05-18","name":"陈","portrait":null,"time":"2017-05-18 00:24:35.0","type":1,"year":"2017"},{"description":"213","hours":"00","minute":null,"month":"05-18","name":"陈","portrait":null,"time":"2017-05-18 00:24:35.0","type":0,"year":"2017"}],"msg":"操作成功"};
}

/**
 * 日期对象转换为指定格式的字符串
 * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
 * @param date Date日期对象, 如果缺省，则为当前时间
 *
 * YYYY/yyyy/YY/yy 表示年份
 * MM/M 月份
 * W/w 星期
 * dd/DD/d/D 日期
 * hh/HH/h/H 时间
 * mm/m 分钟
 * ss/SS/s/S 秒
 * @return string 指定格式的时间字符串
 */
function dateToStr(formatStr, date){
    formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
    date = arguments[1] || new Date();
    var str = formatStr;
    var Week = ['日','一','二','三','四','五','六'];
    str=str.replace(/yyyy|YYYY/,date.getFullYear());
    str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
    str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));
    str=str.replace(/M/g,date.getMonth());
    str=str.replace(/w|W/g,Week[date.getDay()]);

    str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
    str=str.replace(/d|D/g,date.getDate());

    str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
    str=str.replace(/h|H/g,date.getHours());
    str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
    str=str.replace(/m/g,date.getMinutes());

    str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
    str=str.replace(/s|S/g,date.getSeconds());

    return str;
}
/**
 * 日期对象转换为时间戳
 * 用法:dateToUnix("2017-04-03 14:02:26");
 * 时间戳转日期字符串:dateToStr("yyyy-MM-dd HH:mm:ss",new Date(unix*1000));
 */
function dateToUnix(strTime){
//    var unix = Date.parse(new Date(strTime));
    var unix = new Date(strTime).getTime();
    return unix/1000;
}
//上划分页加载
function pageScroll(el, callback) {
    var windowPageYOffset = window.pageYOffset;
    var windowPageYOffsetAddHeight = windowPageYOffset + window.innerHeight;
    var sensitivity = 10;

    var offsetTop = el.offset().top + el.height();

    if (offsetTop >= windowPageYOffset && offsetTop < windowPageYOffsetAddHeight + sensitivity) {
        callback();
    }
};
/**
 * 下拉刷新
 * 使用方法:
 * 1.引入mydata.css
 * 2.将需要下拉刷新的内容用<div class="scoll"></div>包起来
 * 3.js文件调用scrollNew();
 */
function scrollNew(){
//    showDialog("开始刷新","",100);
    if(getUserAgent("android"))return;//安卓用户不需要刷新
    var scroll = document.querySelector('.scroll');//滑动的区域
    var touchStart = 0;
    scroll.addEventListener('touchstart', function(event) {
        var touch = event.targetTouches[0];//手指按压的点
        touchStart = touch.pageY;
    }, false);
    scroll.addEventListener('touchmove', function(event) {
        var touch = event.targetTouches[0];
        scroll.style.top = scroll.offsetTop + touch.pageY-touchStart + 'px';
        touchStart = touch.pageY;
    }, false);
    scroll.addEventListener('touchend', function(event) {
        touchStart = 0;
        var top = scroll.offsetTop;//放手时候scroll的高度
        var overtop = window.screen.height  - scroll.clientHeight;
        if(top>70)location.reload();
        if(top>0){
            var uptime = setInterval(function(){
                scroll.style.top = scroll.offsetTop -2+'px';//缓慢上升
                if(scroll.offsetTop<=0)clearInterval(uptime);
            },1)
        }
        if(top < overtop){
            var downtime = setInterval(function(){
                scroll.style.top = scroll.offsetTop +2+'px';//缓慢下降
                if(scroll.offsetTop>=overtop)clearInterval(downtime);
            },1)
        }
    }, false);
}
//判断设备终端
function getUserAgent(setType){
    //判断访问终端
    var browser={
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        }
    var userAgent = {
        trident: browser.versions.trident,
        presto: browser.versions.presto,
        webKit: browser.versions.webKit,
        gecko: browser.versions.gecko,
        mobile: browser.versions.mobile,
        ios: browser.versions.ios,
        android: browser.versions.android,
        iPhone: browser.versions.iPhone,
        iPad: browser.versions.iPad,
        webApp: browser.versions.webApp,
        weixin: browser.versions.weixin,
        qq: browser.versions.qq
    }
    return userAgent[setType];
}
//过后删除
function ajaxFun1(a,b,c,d){}

ajaxFun1("/user/doctor/careuser", "POST",
    {
        "doctor_id": $(this).parent(".doctorcard").data("id"),
        "user_id": localStorage.uid,
        "iscare":'0'
    },
    function(result) {
        log(result);
        if("1"==result.sign) {
            if(null !=result.d && undefined !=result.d  ) {

            }else{
                log("未携带参数")
            }
        }else{
            showDialog(result.msg)
        }
});