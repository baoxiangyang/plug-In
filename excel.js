var excelPort = require('excel-export');
var fs = require('fs')
var conf = {};
conf.cols = [
   {caption:'名称', type:'string', width:20},
   {caption:'简介', type:'string', width:40},
   {caption:'报酬', type:'string', width:20}
];
conf.rows = [
	['aaa','bbb','ccc'],['sdf','sdf','33fsf3']
]
var result = excelPort.execute(conf);
console.log(result)
var filePath = './test.xlsx';
fs.writeFile(filePath, result, 'binary',function(err){
    if(err){
        console.log(err);
    }else{
    	console.log('success');
    }
});
