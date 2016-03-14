/* global __dirname */

// we can use sync safely here because it's just the gulp file
// gulp tasks prefer unregulated arrow-body-style
/* eslint-disable no-sync,arrow-body-style */

import clean from 'gulp-rimraf';
import eslint from 'gulp-eslint';
import fs from 'fs'; // eslint-disable-line id-length
import gulp from 'gulp';
import minimist from 'minimist';
import mocha from 'gulp-mocha';
import open from 'gulp-open';
import path from 'path';
import runSequence from 'run-sequence';
import through from 'through';
import tsc from 'gulp-tsc';
import tsconfigGlob from 'tsconfig-glob';
import tslint from 'gulp-tslint';
// import typings from 'gulp-typings';
import util from 'gulp-util';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

const args = minimist(process.argv);

const config = {
  verbose: args.verbose || false,
  quiet: args.quiet || false,
  profile: args.profile || false,
  builds: {
    debug: 'debug',
    release: 'release',
    test: 'test',
    typings: 'typings',
    watch: 'watch',
  },
  files: {
    typings: 'typings.json',
    webpack: 'webpack.config.js',
    stats: 'stats.json',
  },
  dirs: {
    typings: path.join(__dirname, 'typings'),
    src: path.join(__dirname, 'src'),
    test: path.join(__dirname, 'test'),
    build: path.join(__dirname, 'build'),
    lib: args.lib || path.join(__dirname, 'lib'),
    dist: args.dist || path.join(__dirname, 'dist'),
  },
  test: {
    reporter: args.reporter || 'spec',
  },
};

function log(...items) {
  if (config.quiet === false) {
    // Reflect is not available in the gulp file
    // eslint-disable-next-line prefer-reflect
    util.log.apply(null, items);
  }
}

if (config.verbose) {
  log('Gulp Config:', JSON.stringify(config, null, 2));
}

// Default build task
gulp.task('default', [ 'webpack' ]);
// Default test task
gulp.task('test', [ 'mocha' ]);

gulp.task('config', () => {
  util.log('Gulp Config:', JSON.stringify(config, null, 2));
});

gulp.task('help', () => {
  /* eslint-disable max-len */
  util.log(`*** Gulp Help ***

Command Line Overrides:
  ${ util.colors.cyan('--verbose') }          : print webpack module details and stats after bundling (${ util.colors.magenta(config.verbose) })
  ${ util.colors.cyan('--quiet') }            : do not print any extra build details (${ util.colors.magenta(config.quiet) })
  ${ util.colors.cyan('--profile') }          : provides webpack build profiling in ${ util.colors.magenta(config.files.stats) } (${ util.colors.magenta(config.profile) })
  ${ util.colors.cyan('--lib') }       ${ util.colors.yellow('<path>') } : override lib directory (${ util.colors.magenta(config.dirs.lib) })
  ${ util.colors.cyan('--dist') }      ${ util.colors.yellow('<path>') } : override dist directory (${ util.colors.magenta(config.dirs.dist) })
  ${ util.colors.cyan('--reporter') }  ${ util.colors.yellow('<name>') } : mocha test reporter (${ util.colors.magenta(config.test.reporter) })
    reporter options : ${ [ 'spec', 'list', 'progress', 'dot', 'min' ].map((x) => util.colors.magenta(x)).join(', ') }

Tasks:
  ${ util.colors.cyan('gulp') } will build a ${ util.colors.yellow('debug') } bundle, start a webpack development server, and open a browser window
  ${ util.colors.cyan('gulp test') } will build a ${ util.colors.yellow('test') } bundle and run mocha against the tests (alias for ${ util.colors.cyan('gulp mocha') })

  ${ util.colors.cyan('gulp help') } will print this help text
  ${ util.colors.cyan('gulp config') } will print the gulp build configuration

  ${ util.colors.cyan('gulp clean') } will delete all files in ${ util.colors.magenta(config.dirs.typings) }, ${ util.colors.magenta(config.dirs.build) }, ${ util.colors.magenta(config.dirs.dist) }
       ${ [ 'typings', 'build', 'lib', 'dist', 'tsc', 'all' ].map((x) => util.colors.cyan(`clean:${ x }`)).join(', ') }

  ${ util.colors.cyan('gulp typings') } will install typescript definition files via the typings utility (alias for ${ util.colors.cyan('gulp typings:install') })
  ${ util.colors.cyan('gulp typings:ensure') } will run ${ util.colors.cyan('typings:install') } if ${ util.colors.magenta(config.dirs.typings) } is missing

  ${ util.colors.cyan('gulp tsconfig:glob') } will expand ${ util.colors.yellow('filesGlob') } in ${ util.colors.magenta('tsconfig.json') }

  ${ util.colors.cyan('gulp webpack') } will build the ${ util.colors.yellow('debug') } bundle using webpack (alias for ${ util.colors.cyan('gulp webpack:debug') })
       ${ [ 'debug', 'release', 'release:min', 'test', 'all' ].map((x) => util.colors.cyan(`webpack:${ x }`)).join(', ') }

  ${ util.colors.cyan('gulp mocha') } will build the ${ util.colors.yellow('test') } bundle and run mocha against the tests
  ${ util.colors.cyan('gulp mocha:run') } will run mocha against the current ${ util.colors.yellow('test') } bundle

  ${ util.colors.cyan('gulp watch:mocha') } will start webpack in ${ util.colors.magenta('watch') } mode, and run all tests after any detected change

  ${ util.colors.cyan('gulp browser:stats') } will open a browser window to ${ util.colors.underline.blue('http://webpack.github.io/analyse/') }

  ${ util.colors.cyan('gulp dist') } will deploy release bundles to ${ util.colors.magenta(config.dirs.dist) } and deploy ${ util.colors.yellow('ES5') } and ${ util.colors.yellow('ES6') } modules to ${ util.colors.magenta(config.dirs.lib) }
       ${ [ 'typings', 'lib', 'lib:ES5', 'lib:ES6', 'bundle', 'all' ].map((x) => util.colors.cyan(`dist:${ x }`)).join(', ') }
`);
  /* eslint-enable max-len */
});

// Clean Tasks

gulp.task('clean', [ 'clean:all' ]);
gulp.task('clean:all', [ 'clean:typings', 'clean:build', 'clean:lib', 'clean:dist', 'clean:tsc' ]);

gulp.task('clean:typings', () => {
  log('Cleaning', util.colors.magenta(config.dirs.typings));

  return gulp
    .src(config.dirs.typings, { read: false })
    .pipe(clean());
});

gulp.task('clean:build', () => {
  log('Cleaning', util.colors.magenta(config.dirs.build));

  return gulp
    .src(config.dirs.build, { read: false })
    .pipe(clean());
});

gulp.task('clean:lib', [ 'clean:lib:ES5', 'clean:lib:ES6' ]);

gulp.task('clean:lib:ES5', () => {
  const target = path.join(config.dirs.lib, 'ES5');

  log('Cleaning', util.colors.magenta(target));

  let force = false;

  if (args.lib) {
    force = true;
  }

  return gulp
    .src(target, { read: false })
    .pipe(clean({ force }));
});

gulp.task('clean:lib:ES6', () => {
  const target = path.join(config.dirs.lib, 'ES6');

  log('Cleaning', util.colors.magenta(target));

  let force = false;

  if (args.lib) {
    force = true;
  }

  return gulp
    .src(target, { read: false })
    .pipe(clean({ force }));
});

gulp.task('clean:dist', () => {
  log('Cleaning', util.colors.magenta(config.dirs.dist));

  let force = false;

  if (args.dist) {
    force = true;
  }

  return gulp
    .src(config.dirs.dist, { read: false })
    .pipe(clean({ force }));
});

gulp.task('clean:tsc', () => {
  return gulp
    .src([
      path.join(__dirname, 'gulp-tsc-tmp-*'),
      path.join(__dirname, '.gulp-tsc-tmp-*.ts'),
    ], { read: false })
    .pipe(clean());
});

// typings Tasks

gulp.task('typings', [ 'typings:install' ]);

gulp.task('typings:install', (done) => {
  gulp
    .src(path.join(__dirname, config.files.typings))
    // .pipe(typings());
    // gulp-typings is currently broken so we have to do things manually
    .pipe(through((file) => {
      // we need to require typings here until gulp-typings is fixed
      // eslint-disable-next-line global-require
      require('typings').install({
        production: false,
        cwd: path.dirname(file.path),
      }).then(() => {
        done(null, file);
      }, (err) => {
        util.PluginError('typings Error', err);
        done(err, file);
      });
    }));
});

gulp.task('typings:ensure', (done) => {
  let count = 0;

  return gulp
    .src(path.join(config.dirs.typings, '**', '*.d.ts'), { read: false })
    .pipe(through(() => {
      ++count;
    }, () => {
      if (count === 0) {
        runSequence('typings:install', done);

        return;
      }

      log('Found', util.colors.magenta(count), 'typescript definitions');

      done();
    }));
});

// tsconfig Tasks

gulp.task('tsconfig:glob', [ 'typings:ensure' ], () => {
  log('Globbing', util.colors.magenta(path.join(__dirname, 'tsconfig.json')));

  return tsconfigGlob({ indent: 2 });
});

// lint Tasks

gulp.task('lint', [ 'lint:all' ]);

gulp.task('lint:all', [ 'lint:ts', 'lint:es' ]);

gulp.task('lint:es', () => {
  gulp
    .src([
      path.join(config.dirs.src, '**', '*.js'),
      path.join(config.dirs.test, '**', '*.js'),
      path.join(__dirname, '*.js'),
    ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:ts', () => {
  gulp
    .src([
      path.join(config.dirs.src, '**', '*.ts'),
      path.join(config.dirs.test, '**', '*.ts'),
    ])
    .pipe(tslint())
    .pipe(tslint.report('verbose', { emitError: false, summarizeFailureOutput: true }));
});

// webpack Functions

function getWebpackConfig(build, uglify) {
  // dynamic loading of the webpack config
  // eslint-disable-next-line global-require
  const webpackConfig = require(path.join(__dirname, build === config.builds.test ? build : '', config.files.webpack));

  if (build === config.builds.debug) {
    webpackConfig.plugins[0].definitions.DEBUG = true;
    webpackConfig.debug = true;
  } else if (build === config.builds.release) {
    if (uglify === true) {
      webpackConfig.output.filename = util.replaceExtension(webpackConfig.output.filename, '.min.js');
    }
    webpackConfig.plugins[0].definitions.RELEASE = true;
    webpackConfig.plugins[0].definitions['process.env'] = {
      'NODE_ENV': JSON.stringify('production'),
    };
    webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());

    if (uglify) {
      webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          comments: false,
          compress: {
            warnings: false,
          },
        })
      );
    }
  }

  return webpackConfig;
}

function printAssets(jsonStats, build) {
  const outputPath = path.join(config.dirs.build, build);
  const assets = jsonStats.assetsByChunkName;

  for (const chunk in assets) {
    const asset = assets[chunk];

    if (Array.isArray(asset)) {
      for (const i in asset) {
        log(util.colors.magenta(path.join(outputPath, asset[i])));
      }
    } else {
      log(util.colors.magenta(path.join(outputPath, asset)));
    }
  }
}

function onWebpackComplete(build, err, stats) {
  if (err) {
    throw new util.PluginError(`webpack: ${ build }`, err);
  }

  if (stats) {
    const jsonStats = stats.toJson() || {};

    if (config.quiet === false) {
      if (config.verbose) {
        log(stats.toString({
          colors: util.colors.supportsColor,
        }));
      } else {
        const errors = jsonStats.errors || [];

        if (errors.length) {
          // var errorMessage = errors.reduce(function(resultMessage, nextError) {
          //   util.log(nextError.toString().trim());
          // }, '');
          // log(util.colors.red('Error'), errorMessage.trim());
        }

        printAssets(jsonStats, build);
      }
    }

    if (config.profile) {
      const statsPath = path.join(config.dirs.build, build, config.files.stats);

      if (fs.existsSync(path.dirname(statsPath)) === false) {
        fs.mkdirSync(path.dirname(statsPath));
      }

      fs.writeFileSync(statsPath, JSON.stringify(jsonStats, null, 2));
    }
  }
}

function webpackBuild(build, webpackConfig, callback) {
  const target = path.join(config.dirs.build, build);

  webpackConfig.output.path = target;
  webpackConfig.output.publicPath = config.publicPath;
  webpackConfig.profile = config.profile;

  log('Bundling', util.colors.yellow(build), 'Build:', util.colors.magenta(target));

  return webpackStream(webpackConfig, null, (err, stats) => {
    if (callback) {
      callback(err, stats);

      return;
    }

    onWebpackComplete(build, err, stats);
  }).on('error', () => null)
  .pipe(gulp.dest(webpackConfig.output.path));
}

// webpack Tasks

gulp.task('webpack', [ 'webpack:debug' ]);

gulp.task('webpack:all', (done) => {
  runSequence('webpack:debug', 'webpack:release', 'webpack:test', done);
});

gulp.task('webpack:debug', [ 'tsconfig:glob' ], () => {
  return webpackBuild(config.builds.debug, getWebpackConfig(config.builds.debug));
});

gulp.task('webpack:release', [ 'tsconfig:glob' ], () => {
  return webpackBuild(config.builds.release, getWebpackConfig(config.builds.release));
});

gulp.task('webpack:release:min', [ 'tsconfig:glob' ], () => {
  return webpackBuild(config.builds.release, getWebpackConfig(config.builds.release, true));
});

gulp.task('webpack:test', [ 'tsconfig:glob' ], () => {
  return webpackBuild(config.builds.test, getWebpackConfig(config.builds.test));
});

// mocha Tasks

gulp.task('mocha', (done) => {
  runSequence('webpack:test', 'mocha:run', done);
});

gulp.task('mocha:run', () => {
  const webpackConfig = getWebpackConfig(config.builds.test);
  const target = path.join(config.dirs.build, config.builds.test, webpackConfig.output.filename);

  log('Testing with Mocha:', util.colors.magenta(target));

  return gulp
    .src(target)
    .pipe(mocha({ reporter: args.reporter || (config.quiet ? 'dot' : config.test.reporter) }));
});

/*
gulp.task('watch:mocha', ['clean:watch'], function(cb) {
  var webpackConfig = getWebpackConfig(config.builds.test);

  webpackConfig.devtool = 'eval';
  webpackConfig.watch = true;
  webpackConfig.failOnError = false;
  webpackConfig.debug = true;

  var reporter = args.reporter || 'dot';

  return webpackBuild(config.builds.watch, webpackConfig, function() {})
    .pipe(filter(function(file) { return file.path === path.join(webpackConfig.output.path, webpackConfig.output.filename); }))
    .pipe(through(function(file) {
      var target = path.join(webpackConfig.output.path, webpackConfig.output.filename);
      if (file.path === target) {
        gulp
          .src(target)
          .pipe(mocha({ reporter }))
          .on('error', function() {});
      }
    }));
});

gulp.task('watch:dist', ['watch:dist:debug']);

gulp.task('watch:dist:debug', [], function() {
  var webpackConfig = getWebpackConfig(config.builds.debug);

  webpackConfig.watch = true;
  webpackConfig.failOnError = false;

  return webpackBuild(config.builds.debug, webpackConfig, function() {})
    .pipe(gulp.dest(path.join(config.dirs.dist, config.builds.debug)))
    .on('error', function() {});
});

gulp.task('watch:dist:release', [], function() {
  var webpackConfig = getWebpackConfig(config.builds.release);

  webpackConfig.watch = true;
  webpackConfig.failOnError = false;

  return webpackBuild(config.builds.release, webpackConfig, function() {})
    .pipe(gulp.dest(path.join(config.dirs.dist, config.builds.release)))
    .on('error', function() {});
});
*/

// browser Tasks

gulp.task('browser:stats', () => {
  return gulp
    .src('')
    .pipe(open({ uri: 'http://webpack.github.io/analyse/' }));
});

// dist Tasks

gulp.task('dist', [ 'dist:all' ]);
gulp.task('dist:all', [ 'dist:lib', 'dist:bundle' ]);
gulp.task('dist:lib', [ 'dist:lib:ES5', 'dist:lib:ES6' ]);

gulp.task('dist:typings', [ 'clean:build', 'tsconfig:glob' ], () => {
  return gulp
    .src([
      path.join(config.dirs.typings, 'main', 'ambient', 'es6-shim', 'index.d.ts'),
      path.join(config.dirs.typings, 'main', 'ambient', 'webpack-defines', 'index.d.ts'),
      path.join(config.dirs.typings, 'main', 'definitions', 'rxjs', 'index.d.ts'),
      path.join(config.dirs.src, '**', '*.ts'),
    ])
    .pipe(tsc({
      target: 'ES5',
      sourceMap: true,
      module: 'system',
      declaration: true,
      out: 'rx.obj.js',
    }))
    .pipe(gulp.dest(path.join(config.dirs.build, config.builds.typings)));
});

gulp.task('dist:lib:ES5', [ 'clean:lib:ES5', 'tsconfig:glob' ], () => {
  return gulp
    .src([
      path.join(config.dirs.typings, 'main', 'ambient', 'es6-shim', 'index.d.ts'),
      path.join(config.dirs.typings, 'main', 'ambient', 'webpack-defines', 'index.d.ts'),
      path.join(config.dirs.typings, 'main', 'definitions', 'rxjs', 'index.d.ts'),
      path.join(config.dirs.src, '**', '*.ts'),
    ])
    .pipe(tsc({
      target: 'ES5',
      sourceMap: true,
      module: 'commonjs',
      declaration: true,
    }))
    .pipe(gulp.dest(path.join(config.dirs.lib, 'ES5')));
});

gulp.task('dist:lib:ES6', [ 'clean:lib:ES6', 'tsconfig:glob' ], () => {
  return gulp
    .src([
      path.join(config.dirs.typings, 'main', 'ambient', 'webpack-defines', 'index.d.ts'),
      path.join(config.dirs.typings, 'main', 'definitions', 'rxjs', 'index.d.ts'),
      path.join(config.dirs.src, '**', '*.ts'),
    ])
    .pipe(tsc({
      target: 'ES6',
      sourceMap: true,
      module: 'es2015',
      declaration: true,
    }))
    .pipe(gulp.dest(path.join(config.dirs.lib, 'ES6')));
});

gulp.task('dist:bundle', [ 'clean:dist' ], (done) => {
  runSequence('dist:typings', 'webpack:release', 'webpack:release:min', () => {
    gulp
      .src([
        path.join(config.dirs.build, config.builds.release, '**', '*'),
        path.join(config.dirs.build, config.builds.typings, '*.d.ts'),
      ])
      .pipe(gulp.dest(config.dirs.dist));

    done();
  });
});
