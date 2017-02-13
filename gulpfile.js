var gulp = require('gulp'),
		rename = require('gulp-rename'),
		uglify = require('gulp-uglify'),
		minifyCss = require('gulp-minify-css'),
		del = require('del'),
		gzip = require('gulp-gzip'),
		tar = require('gulp-tar');
//压缩css
gulp.task('minifyCss',['del'], function(cb){
	return gulp.src('gateWay-app/public/stylesheets/**/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('dist/css'));

});
//压缩js
gulp.task('uglify',['del'], function(cb){
	return gulp.src('gateWay-app/public/javascripts/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));

});
//删除文件夹
gulp.task('del', function(cb){
	del(['dist/*']).then(path =>{
		console.log(path);
		cb();
	});
});
//minifyCss, uglify 两个任务都完成后执行,压缩文件
gulp.task('tar',['minifyCss', 'uglify'],function(cb){
	gulp.src('dist/**/*')
		.pipe(tar('dist/dist.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('.'));
});
gulp.task('default',['del', 'minifyCss', 'uglify' ,'tar']);