/* jshint node: true, strict: true */
'use strict';

/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
    dest: 'www',

    server: {
        host: '0.0.0.0',
        port: '8000'
    },
    less: {
        src: [
            // './src/less/app.less', './src/less/responsive.less'
            './src/less/app.less'
        ],
        paths: [
            './src/less', './bower_components'
        ]
    },
    vendor: {
        js: [
            // './bower_components/jquery/dist/jquery.js',
            // './bower_components/angular/angular.js',
            // './bower_components/angular-route/angular-route.js',
            // './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js'
        ],

        css: {
            prepend: [],
            append: [],
        },

        fonts: [
            // './bower_components/font-awesome/fonts/fontawesome-webfont.*'
        ]
    },
};

if (require('fs').existsSync('./config.js')) {
    var configFn = require('./config');
    configFn(config);
}

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp = require('gulp'),
    seq = require('run-sequence'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    order = require('gulp-order'),
    concat = require('gulp-concat'),
    ignore = require('gulp-ignore'),
    rimraf = require('gulp-rimraf'),
    templateCache = require('gulp-angular-templatecache'),
    mobilizer = require('gulp-mobilizer'),
    ngAnnotate = require('gulp-ng-annotate'),
    replace = require('gulp-replace'),
    ngFilesort = require('gulp-angular-filesort'),
    streamqueue = require('streamqueue'),
    rename = require('gulp-rename'),
    path = require('path');


/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
    throw (e);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function(cb) {
    return gulp.src([
            path.join(config.dest, 'index.html'),
            path.join(config.dest, 'images'),
            path.join(config.dest, 'css'),
            path.join(config.dest, 'js'),
            path.join(config.dest, 'fonts')
        ], {
            read: false
        })
        .pipe(rimraf());
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
    if (typeof config.server === 'object') {
        connect.server({
            root: config.dest,
            host: config.server.host,
            port: config.server.port,
            livereload: true
        });
    } else {
        throw new Error('Connect is not configured');
    }
});


/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function() {
    gulp.src(path.join(config.dest, '*.html'))
        .pipe(connect.reload());
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest(path.join(config.dest, 'images')));
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(path.join(config.dest, 'fonts')));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
    var inject = [];
    gulp.src(['src/html/**/*.html'])
        .pipe(gulp.dest(config.dest));
});

gulp.task('templates', function() {
    var inject = [];
    gulp.src(['src/templates/**/*.html'])
        .pipe(gulp.dest(config.dest + "/templates"));
});
gulp.task('lib', function() {
    var inject = [];
    gulp.src(['src/lib/**/*'])
        .pipe(gulp.dest(config.dest + "/lib"));
});
/*======================================================================
=            Compile, minify, mobilize less                            =
======================================================================*/

gulp.task('less', function() {

    return streamqueue({
                objectMode: true
            },
            gulp.src(config.vendor.css.prepend),
            gulp.src(config.less.src),
            gulp.src(config.vendor.css.append)
        )
        .pipe(less({
            paths: config.less.paths.map(function(p) {
                return path.resolve(__dirname, p);
            })
        }))
        .pipe(mobilizer('app.css', {
            'app.css': {
                // hover: 'exclude',
                screens: ['0px']
            },
            // 'hover.css': {
            //     hover: 'only',
            //     screens: ['0px']
            // }
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.join(config.dest, 'css')));
});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
    streamqueue({
                objectMode: true
            },
            gulp.src(config.vendor.js),
            gulp.src('./src/js/**/*.js').pipe(ngFilesort())
            // gulp.src(['src/templates/**/*.html']).pipe(templateCache({
            //     module: 'Nearby'
            // }))
        )
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, 'js')));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function() {
    if (typeof config.server === 'object') {
        gulp.watch([config.dest + '/**/*'], ['livereload']);
    }
    gulp.watch(['./src/html/**/*'], ['html']);
    gulp.watch(['./src/less/**/*'], ['less']);
    gulp.watch(['./src/js/**/*'], ['js']);
    gulp.watch(['./src/templates/**/*'], ['templates']);
    gulp.watch(['./src/lib/**/*'], ['lib']);
    gulp.watch(['./src/images/**/*'], ['images']);
});


/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build', function(done) {
    var tasks = ['html', 'templates', 'lib', 'fonts', 'images', 'less', 'js'];
    seq('clean', tasks, done);
});


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done) {
    var tasks = [];

    if (typeof config.weinre === 'object') {
        tasks.push('weinre');
    }

    if (typeof config.server === 'object') {
        tasks.push('connect');
    }

    tasks.push('watch');

    seq('build', tasks, done);
});