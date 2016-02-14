'use strict';

var path = require('path');
var tsconfigGlob = require('tsconfig-glob');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');

var config = {
  builds: {
    debug: 'debug',
    release: 'release',
    test: 'test'
  },
  files: {
    rxvm: 'rx.obj.ts',
    webpack: 'webpack.config.js'
  },
  dirs: {
    src: path.join(__dirname, 'src'),
    test: path.join(__dirname, 'test'),
    build: path.join(__dirname, 'build')
  },
  test: {
    reporter: 'spec'
  }
};

gulp.task('default', ['webpack:debug']);

gulp.task('clean', ['clean:all']);
gulp.task('clean:all', ['clean:debug', 'clean:release', 'clean:test']);

gulp.task('clean:debug', function() {
  var target = path.join(config.dirs.build, config.builds.debug, '*');
  gutil.log('Cleaning', gutil.colors.magenta(target));

  return gulp
    .src(target, { read: false })
    .pipe(clean());
});

gulp.task('clean:release', function() {
  var target = path.join(config.dirs.build, config.builds.release, '*');
  gutil.log('Cleaning', gutil.colors.magenta(target));

  return gulp
    .src(target, { read: false })
    .pipe(clean());
});

gulp.task('clean:test', function() {
  var target = path.join(config.dirs.build, config.builds.test, '*');
  gutil.log('Cleaning', gutil.colors.magenta(target));

  return gulp
    .src(target, { read: false })
    .pipe(clean());
});

gulp.task('tsconfig:glob', ['tsconfig:glob:all']);
gulp.task('tsconfig:glob:all', ['tsconfig:glob:src', 'tsconfig:glob:test']);

gulp.task('tsconfig:glob:src', function() {
  gutil.log('Globbing', gutil.colors.magenta(config.dirs.src));

  return tsconfigGlob({ configPath: config.dirs.src });
});

gulp.task('tsconfig:glob:test', function() {
  gutil.log('Globbing', gutil.colors.magenta(config.dirs.test));

  return tsconfigGlob({ configPath: config.dirs.test });
});

gulp.task('webpack', ['webpack:debug']);
gulp.task('webpack:all', ['webpack:debug', 'webpack:release', 'webpack:test']);

gulp.task('webpack:debug', ['tsconfig:glob:src'], function() {
  var webpackConfig = require(path.join(__dirname, config.files.webpack));
  webpackConfig.entry = path.join(config.dirs.src, config.files.rxvm);
  webpackConfig.output = { filename: gutil.replaceExtension(config.files.rxvm, '.js') };
  webpackConfig.plugins[0].definitions.DEBUG = true;
  webpackConfig.debug = true;

  var target = path.join(config.dirs.build, config.builds.debug);
  gutil.log('Bundling Debug Build: ', gutil.colors.magenta(target));

  return gulp
    .src(path.join(config.dirs.src, config.files.rxvm))
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(target));
});

gulp.task('webpack:release', ['tsconfig:glob:src'], function() {
  var webpackConfig = require(path.join(__dirname, config.files.webpack));
  webpackConfig.entry = path.join(config.dirs.src, config.files.rxvm);
  webpackConfig.output = { filename: gutil.replaceExtension(config.files.rxvm, '.min.js') };
  webpackConfig.plugins[0].definitions.RELEASE = true;
  webpackConfig.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      comments: false,
      compress: {
        warnings: false
      }
    })
  );

  var target = path.join(config.dirs.build, config.builds.release);
  gutil.log('Bundling Release Build: ', gutil.colors.magenta(target));

  return gulp
    .src(path.join(config.dirs.src, config.files.rxvm))
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(target));
});

gulp.task('webpack:test', ['tsconfig:glob:test'], function() {
  var webpackConfig = require(path.join(__dirname, config.files.webpack));
  webpackConfig.entry = null;
  webpackConfig.output = { filename: gutil.replaceExtension(config.files.rxvm, '.js') };
  webpackConfig.plugins[0].definitions.TEST = true;

  var target = path.join(config.dirs.build, config.builds.test);
  gutil.log('Bundling Test Build: ', gutil.colors.magenta(target));

  return gulp
    .src(path.join(config.dirs.test, config.files.rxvm))
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(target));
});

gulp.task('mocha', ['mocha:webpack']);

gulp.task('mocha:run', function() {
  var target = path.join(config.dirs.build, config.builds.test, gutil.replaceExtension(config.files.rxvm, '.js'));
  gutil.log('Testing with Mocha: ', gutil.colors.magenta(target));

  return gulp
    .src(target)
    .pipe(mocha({ reporter: config.test.reporter }));
});

gulp.task('mocha:webpack', function(cb) {
  return runSequence('webpack:test', 'mocha:run', cb);
});

gulp.task('watch:mocha', function() {
  var webpackConfig = require(path.join(__dirname, config.files.webpack));
  webpackConfig.entry = null;
  webpackConfig.output = { filename: gutil.replaceExtension(config.files.rxvm, '.js') };
  webpackConfig.watch = true;
  webpackConfig.plugins[0].definitions.TEST = true;

  config.test.reporter = 'dot';

  var target = path.join(config.dirs.build, config.builds.test, gutil.replaceExtension(config.files.rxvm, '.js'));
  gutil.log('Watching with Mocha: ', gutil.colors.magenta(target));

  gulp
    .src(path.join(config.dirs.test, config.files.rxvm))
    .pipe(webpackStream(webpackConfig, null, function() {
      // do nothing
    }))
    .pipe(gulp.dest(path.join(config.dirs.build, config.builds.test)));

  gulp
    .watch(target, ['mocha:run']);
});

gulp.task('test', ['mocha']);
gulp.task('test:watch', ['watch:mocha']);
