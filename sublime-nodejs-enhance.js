/*
  sublime-nodejs.js增强
  用法：
    将此文件放到与package.json同级目录
    按键 alt+r 直接执行 npm start
    按键 ctrl + alt + r 时会执行相应的命令
    只输入一个单词并且不在toolArr中存在时 执行 npm run xxx
    只输入一个单词在toolArr存在时，直接工具命令 
      如输入webpack时，执行webpack命令
    输入多个单词时 直接执行 输入的命令
  注意：
    使用前请先安装sublime3-nodejs
    本文件依赖package.json,请配置
  原理： 就相当于在cmd窗口执行命令
  兼容：
    兼容 window 和 liunx； 
    ios 没有用过，请自行测试
  配图情况readme.md
*/

let argv = process.argv.slice(2),
	child_process = require('child_process'),
  str = '',
  toolArr = ['webpack','gulp'];
if(!argv.length){
  str = 'npm start'
}else if(argv.length ==1){
  if(toolArr.indexOf(argv[0]) != -1){
    str = argv[0];
  }else{
    str = 'npm run ' + argv[0];
  }
}else {
  str = argv.join(' ');
}
child_process.exec(str, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

