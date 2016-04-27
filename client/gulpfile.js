'use strict';

var gulp = require('gulp');
var refresh = require('gulp-livereload');
var livereload = require('tiny-lr');
var server = livereload();
var rjs = require('gulp-requirejs');

gulp.task('livereload-server', function () {
  server.listen(35729, function (err) {
    if (err) { return console.log(err); }
  });
});

gulp.task('css', function () {
  gulp.src('app/**/*.css').pipe(refresh(server));
});

gulp.task('js', function () {
  gulp.src('app/**/*.js').pipe(refresh(server));
});

gulp.task('default', function () {
  gulp.run('livereload-server');

  gulp.watch('app/**/*.css', function (event) {
    gulp.run('css');
  });

  gulp.watch('app/**/*.js', function (event) {
    gulp.run('js');
  });
});

gulp.task('build', function() {
  rjs({
    app: '../js',
    baseUrl: 'app/bower_components/',
    dir: '../deploy',
    paths: {
      'js': '../js'    
    },
    modules: [
      {
        name: 'js/common',
        include: [
          'jquery',
          'flight/lib/'
        ]
      },
      {
        name: 'js/tech-skills',
        include: ['js/page/tech-skills']
      }
    ]

  })
    .pipe(gulp.dest('../deploy/'))
});
