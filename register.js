//http 模块
//文件读写模块
const http = require('http');
const fs =  require('fs');
const querystring = require('querystring');
const urllib = require("url");
var users = []; // {'blue':'12345','zhangshan':'11111','yui':'22222'}

var server = http.createServer(function (req,res) {
    // request客户端向浏览器请求  response 服务端返回给客户端的数据

    //获取GET参数
    var GET = {};
    var POST = {};
    var url = {};

    // 用querystring模块获取get参数
    if(req.url.indexOf("?")>0){
        var arr= req.url.split("?");
        // console.log(arr);//[ '/user', 'act=login&user=uu&pass=uu' ]
        GET = querystring.parse(arr[1]);
        // console.log("querystring模块",GET);
    }else{
        // console.log("没有?",req.url);
    }
    // 用url模块获取get参数   功能更强大
    var obj = urllib.parse(req.url,true);//带上参数true  才会将query的"a+12&b=2"解析成{a:12,b:2}
    url = obj.pathname;
    GET = obj.query;
    GET.length?console.log("url模块",url,GET):""; ///index { a: '12', b: '2' }

    //获取POST参数
    var str = '',i=0;
    //data分多次传输  每接受一次执行一次函数
    req.on('data',function (data) {
        // console.log(`第${i++}次收到数据`);
        // console.log('第'+(i++)+'次收到数据');
        str+=data;
    });
    //data数据全部到达时执行
    req.on('end',function () {
        // console.log("end:",str);
        POST = querystring.parse(str);
        POST.length?console.log("解析后:",POST):"";
    });

    console.log("--------用户--------");
    //区分接口还是文件
    if(url == '/user'){
        switch (GET.act){
            case 'reg':
                //1.检查用户是否存在
                if (users[GET.user]){
                    res.write('{"ok":false,"msg":"此用户已注册"}');
                }else{
                    //插入数据
                    users[GET.user]=GET.pass;
                    res.write('{"ok":true,"msg":"注册成功"}');
                }
                break;
            case 'login':
                // 用户是否存在
                if(users[GET.user] == null){
                    res.write('{"ok":false,"msg":"此用户不存在"}');
                    // 用户密码校验
                }else if(users[GET.user]!=GET.pass){
                    res.write('{"ok":false,"msg":"密码错误"}');
                }else{
                    res.write('{"ok":true,"msg":"登陆成功"}');
                }
                break;
            case 'all':
                console.log(users);
                res.write('{'+  +'}');
                break;
            default:
                res.write('{"ok":false,"msg":"未知接口"}');
                break;
        }
        res.end();
    }else{
        var fileName = "./www"+url;
        //文件读取模块
        //读取文件必要参数：文件名+回调函数
        fs.readFile(fileName,function (err,data) {
            if(err){
                console.log(err);
                res.write('404');
            }else {
                // console.log(data.toString());
                res.write(data);
            }
            res.end();
        });
    }

    //res.end();   异步先执行到这里  write after end
});


// 监听
server.listen(8080);

return

//写入文件  文件名+数据+回调函数
fs.writeFile("aaa.txt","i水电费说的发生的地方刚发的",function (err) {
    console.log(err);
});