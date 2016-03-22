gulp = require "gulp"
gulputil = require "gulp-util" 
sass = require "gulp-sass" 
autoprefixer = require "gulp-autoprefixer" 
coffee = require "gulp-coffee" 
plumber = require "gulp-plumber"

# Sass SCSS ビルドタスク
gulp.task "sass",  ->
	gulp.src "../public/sass/*.scss"
	.pipe plumber()
	.pipe sass()
	.pipe autoprefixer()
	.pipe gulp.dest "../public/css/"

# Coffe compile タスク
gulp.task "coffee", ->
	gulp.src "./*.coffee" 
	.pipe plumber()
	.pipe coffee()
	.pipe gulp.dest "./"  

# watchタスク
gulp.task "default", ->
	gulp.watch "../public/sass/*.scss",["sass"] 
	gulp.watch "./*.coffee",["coffee"] 
