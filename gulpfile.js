'use strict';

var coveralls = require('gulp-coveralls');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var nsp = require('gulp-nsp');
var path = require('path');
var plumber = require('gulp-plumber');

var paths = {
  all: '**/*.js',
  lib: 'lib/**/*.js',
  test: 'test/**/*.js'
};

// Task: static
gulp.task('static', function () {
  return gulp.src(paths.all)
  .pipe(excludeGitignore())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

// Task: nsp
gulp.task('nsp', function (cb) {
  nsp({package: __dirname + '/package.json'}, cb);
});

// Task: pre-test
gulp.task('pre-test', function () {
  return gulp.src(paths.lib)
  .pipe(istanbul({
    includeUntested: true
  }))
  .pipe(istanbul.hookRequire());
});

// Taks: test
gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src(paths.test)
  .pipe(plumber())
  .pipe(mocha({reporter: 'spec'}))
  .on('error', function (err) {
    mochaErr = err;
  })
  .pipe(istanbul.writeReports())
  .on('end', function () {
    cb(mochaErr);
  });
});

// Task: coveralls
gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
  .pipe(coveralls());
});

// Task: prepublish
gulp.task('prepublish', ['nsp']);

// Task: default
gulp.task('default', ['static', 'test', 'coveralls']);
