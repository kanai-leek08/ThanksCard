(function() {
  var autoprefixer, coffee, gulp, gulputil, plumber, sass;

  gulp = require("gulp");

  gulputil = require("gulp-util");

  sass = require("gulp-sass");

  autoprefixer = require("gulp-autoprefixer");

  coffee = require("gulp-coffee");

  plumber = require("gulp-plumber");

  gulp.task("sass", function() {
    return gulp.src("../sass/*.scss").pipe(plumber()).pipe(sass()).pipe(autoprefixer()).pipe(gulp.dest("../css/"));
  });

  gulp.task("coffee", function() {
    return gulp.src("./*.coffee").pipe(plumber()).pipe(coffee()).pipe(gulp.dest("./"));
  });

  gulp.task("default", function() {
    gulp.watch("../sass/*.scss", ["sass"]);
    return gulp.watch("./*.coffee", ["coffee"]);
  });

}).call(this);
