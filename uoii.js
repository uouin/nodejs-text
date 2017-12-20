var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('someEvent', function (arg1, arg2) {
    console.log('listener1', arg1, arg2);
    buf = new Buffer(6);
    for (var i = 0; i < 6; i++) {
        buf[i] = i + 97;
    }
    //解码缓冲区数据并使用指定的编码返回字符串。
    console.log(buf.toString('ascii')); // 输出: abcdefghijklmnopqrstuvwxyz
    console.log(buf.toString('ascii', 0, 5)); // 输出: abcde
    console.log(buf.toString('utf8', 0, 5)); // 输出: abcde
    console.log(buf.toString(undefined, 0, 5)); // 使用 'utf8' 编码, 并输出: abcde
    console.log(buf.toJSON(buf));// 转为json
});
emitter.on('someEvent', function (arg1, arg2) {
    console.log('listener2', arg1, arg2);
    var fs = require("fs");
    
    // 创建一个可读流
    var readerStream = fs.createReadStream('input.txt');
    
    // 创建一个可写流
    var writerStream = fs.createWriteStream('output.txt');
    
    // 管道读写操作
    // 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
    readerStream.pipe(writerStream);
});
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数');

function Hello() { 
    var name; 
    this.setName = function(thyName) { 
        name = thyName; 
    }; 
    this.sayHello = function() { 
        console.log('Hello ' + name); 
    }; 
}; 
module.exports = Hello;