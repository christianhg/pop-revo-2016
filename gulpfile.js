(function() {
    'use strict';

    var angularFilesort = require('gulp-angular-filesort');
    var autoprefixer = require('gulp-autoprefixer');
    var browserSync = require('browser-sync');
    var concat = require('gulp-concat');
    var flatten = require('gulp-flatten');
    var gulp = require('gulp');
    var inject = require('gulp-inject');
    var jshint = require('gulp-jshint');
    var minifyCSS = require('gulp-minify-css');
    var ngAnnotate = require('gulp-ng-annotate');
    var plumber = require('gulp-plumber');
    var sass = require('gulp-ruby-sass');
    var sourcemaps = require('gulp-sourcemaps');
    var stripDebug = require('gulp-strip-debug');
    var stylish = require('jshint-stylish');
    var templateCache = require('gulp-angular-templatecache');
    var uglify = require('gulp-uglify');
    var using = require('gulp-using');

    var vendor = {
        css: [

        ],
        fonts: [

        ],
        js: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        ],
    };

    gulp.task('assets', function() {
      gulp.src(['./src/assets/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('./build/assets'));
    });

    gulp.task('fonts', function() {
        gulp.src(vendor.fonts)
            .pipe(plumber())
            .pipe(gulp.dest('./build/fonts'));
    });

    gulp.task('views', function() {
        gulp.src(['./src/app/**/*.html'])
            .pipe(plumber())
            .pipe(templateCache('templates.js', {
              module: 'poprevo.templates',
              standalone: true
            }))
            .pipe(gulp.dest('./build/js/templates'));
    });

    gulp.task('css-app', function() {
        return sass('./src/scss/app.scss', { sourcemap: true})
            .pipe(plumber())
            .pipe(sourcemaps.write())
            .pipe(autoprefixer('last 2 versions'))
            .pipe(gulp.dest('./build/css'))
    });

    gulp.task('css-vendor', function() {
        return gulp.src(vendor.css)
            .pipe(plumber())
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest('./build/css'));
    });

    gulp.task('css', ['css-app', 'css-vendor'], function() {

    });

    gulp.task('index', function() {
        return gulp.src('./src/index.html')
            .pipe(plumber())
            .pipe(gulp.dest('./build'));
    });

    gulp.task('js-app', function() {
        return gulp.src(['./src/app/**/*.js'])
            .pipe(plumber())
            .pipe(flatten())
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(ngAnnotate({add: true, single_quotes: true}))
            .pipe(angularFilesort())
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./build/js/app'));
    });

    gulp.task('js-vendor', function() {
        return gulp.src(vendor.js)
            .pipe(plumber())
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest('./build/js/vendor'));
    });

    gulp.task('js', ['js-app', 'js-vendor'], function() {

    });

    gulp.task('inject', ['css', 'index', 'js', 'views'], function() {
        return gulp.src('./build/index.html')
            .pipe(plumber())
            .pipe(inject(
                gulp.src(['./build/css/app.css']),
                {relative: true, name: 'app'}
            ))
            .pipe(inject(
                gulp.src(['./build/css/vendor.css']),
                {relative: true, name: 'vendor'}
            ))
            .pipe(inject(
                gulp.src(['./build/js/app/**/*']),
                {relative: true, name: 'app'}
            ))
            .pipe(inject(
                gulp.src(['./build/js/templates/**/*']),
                {relative: true, name: 'templates'}
            ))
            .pipe(inject(
                gulp.src(['./build/js/vendor/**/*']),
                {relative: true, name: 'vendor'}
            ))
            .pipe(gulp.dest('./build'));
    });

    gulp.task('serve', ['build'], function() {
        browserSync.init({
            server: './build',
            notify: false,
            open: false,
            ghostMode: false
        });
    });

    gulp.task('build', ['assets', 'fonts', 'inject'], browserSync.reload);

    gulp.task('dev', ['serve'], function() {
        gulp.watch('./src/**/*', ['build']);
    });
})();
