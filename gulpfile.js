var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var bs = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var webpack = require('webpack-stream');

var webpackConf = { 
  output: { 
    path: __dirname, 
    filename: 'main.js' 
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      test: /\.js$/,
      query: {
        presets: 'es2015',
      },
      exclude: /node_modules/
    }]
  },
  devtool: 'source-map'
};

var AUTOPREFIXER_OPTIONS = {
  browsers: ['> 5%', 'ie 10'],
  cascade: false 
};


gulp.task('default', ['style', 'movePHPfiles','mainJs','moveExternCode','moveImages', 'moveCardImages', 'moveFiles'], function () {

  bs.init({
   proxy: "localhost/memory" 
 });
  
  gulp.watch('./prod/*.php', ['movePHPfiles', function() {bs.reload()}]);
  gulp.watch('./prod/layout/css/*.scss', ['style', function() {bs.reload('*.css')}]);
  gulp.watch('./prod/layout/js/game.js', ['moveExternCode', function() {bs.reload()}]);
  gulp.watch(['./prod/layout/js/main.js', './prod/layout/js/modules/*.js'], ['mainJs', function() {bs.reload()}]);

});

gulp.task('style', function () {
  return gulp.src('./prod/layout/css/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer(AUTOPREFIXER_OPTIONS))
   //.pipe(cssnano())
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory/layout/css'));
 });

gulp.task('movePHPfiles', function () {
  return gulp.src(['./prod/*.php'])
  .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory'));
});


gulp.task('moveExternCode', function () {
  return gulp.src(['./prod/layout/js/modernizr.js', './prod/layout/js/jquery.js', './prod/layout/js/game.js'])
  .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory/layout/js'));
});

gulp.task('moveImages', function () {
  return gulp.src(['./prod/layout/img/*.jpg', './prod/layout/img/*.png', './prod/layout/img/*.svg'])
  .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory/layout/img'));
});

gulp.task('moveCardImages', function () {
  return gulp.src(['./prod/layout/img/cards/*.jpg'])
  .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory/layout/img/cards'));
});

gulp.task('moveFiles', function () {
  return gulp.src(['./prod/layout/files/**.*'])
  .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory/layout/files'));
});

gulp.task('mainJs', function () {
  return gulp.src('./prod/layout/js/main.js')
  //.pipe(webpack(webpackConf))
  .pipe(gulp.dest('/Applications/XAMPP/xamppfiles/htdocs/memory/layout/js'));
});
