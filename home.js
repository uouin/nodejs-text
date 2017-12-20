/**
 * Created by Administrator on 2017/8/21.
 */

//如果有"./"则从当前目录找  如果没有"./" 先从系统模块找 再从node_module找
// const mode1 = require('./mode'); //为了区分于系统模块-加上"./"   ".js"后缀可删
const M = require('mode'); //如果不加上"./"就应该将js文件放到node_modules下
const yest233 = require('yest233');  //自定义的模块  在npm.com上
const express = require('express'); // express框架  有点类似脚手架
const expressStatic = require('express-static'); // express框架  有点类似脚手架
const Hello = require('./uoii'); 
const hello = new Hello(); 
hello.setName('BYVoid'); 
hello.sayHello(); 
// console.log(M.b,M.c);
// console.log(yest233.sum(1,2,10,60));
M.log(yest233.div(10,2));
M.log(__filename);// 文件所在位置的绝对路径
M.log(__dirname);// 当前执行脚本所在的目录
M.log('runing...');

var server = express();
server.listen(8080);

var  users = {
    'abc':'123',
    'bbc':'321',
    'cba':'987'
}
server.get("/login",function (req,res) {
    M.log(req.query);
    var name = req.query.name;
    var pass = req.query.pass;

    if(users[name]==null){
        res.send({ok:false,msg:'该用户不存在'})
    }else if(users[name]!=pass){
        res.send({ok:false,msg:'密码错误'});
    }else{
        res.send({ok:true,msg:'登陆成功'});
    }
}) 
//中间件的使用
// server.use(expressStatic('./www'));
server.use(express.static(__dirname+"/www"));  //换内置静态资源处理的方法

//不推荐写法
server.get("/study",function (req,res) {
    M.log("有get");
    res.send("get");
    res.end();
});
server.post("/",function (req,res) {
    M.log("有post");
    res.send("post");
    res.end("post");
});
// server.use('/',function (req,res) {
//    res.send({a:1,b:2});
//    res.end();
// });


//中间件


