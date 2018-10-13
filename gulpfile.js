var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var replace = require('gulp-html-replace');
var htmlminify = require("gulp-html-minify");
var includer = require('gulp-htmlincluder');
var livereload = require('gulp-livereload');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var spritesmith = require("gulp-spritesmith");
var gulpif = require("gulp-if");

gulp.task('html', function() {
    gulp.src('dev/**/*.html')
    	.pipe(plumber())
    	.pipe(includer())
    	.pipe(replace({
            js: 'js/core.min.js'
    	}))
        .pipe(htmlminify())
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
});

gulp.task('less', function () {
	gulp.src('dev/less/general.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(plumber.stop())
		.pipe(gulp.dest('dev/css/imports'));
});
gulp.task('lessTop', function () {
    gulp.src('dev/less/headStyle.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(plumber.stop())
        .pipe(gulp.dest('dev/css/'));
});

gulp.task('css', function () {
	gulp.src('dev/css/imports/*.css')
		.pipe(plumber())
    	.pipe(concatCss("style.css"))
    	.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
    	.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('style.min.css'))
        .pipe(plumber.stop())
    	.pipe(gulp.dest('build/css/'))
    	.pipe(browserSync.stream());
});

gulp.task('cssTop', function () {
	gulp.src('dev/css/headStyle.css')
		.pipe(plumber())
    	.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
    	.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('-headStyle.html'))
        .pipe(plumber.stop())
    	.pipe(gulp.dest('dev'));
    	// .pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src('dev/js/concat/*.js')
      	.pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});
gulp.task('jsCore', function() {
    gulp.src('dev/js/core.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename('core.min.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('img', () =>
    gulp.src('dev/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream())
);

gulp.task('sprite', function () {
    gulp.src('dev/sprites/*.png')
        .pipe(spritesmith({
                    imgName: 'sprite.png',
                    styleName: 'sprite.css',
                    imgPath: '../img/sprite.png'
                }))
        .pipe(gulpif('*.png', gulp.dest('dev/img')))
        .pipe(gulpif('*.css', gulp.dest('dev/css/imports')));
});

gulp.task('lib', function() {
    gulp.src('dev/lib/**/*')
        .pipe(gulp.dest('build/lib/'))
        .pipe(browserSync.stream());
});

gulp.task('font', function() {
    gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('build/fonts/'))
        .pipe(browserSync.stream());
});

gulp.task('php', function() {
    gulp.src('dev/php/**/*')
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
});

gulp.task('default', function() {
	gulp.start('html', 'css', 'cssTop', 'less', 'lessTop', 'js', 'jsCore', 'img', 'sprite', 'lib', 'font', 'php', 'browser-sync');

	gulp.watch(['dev/**/*.html'], function(event) {
		gulp.start('html');
	});
    gulp.watch(['dev/less/**/*.less'], function(event) {
        gulp.start('less');
        gulp.start('lessTop');
    });
	gulp.watch(['dev/css/imports/*.css'], function(event) {
		gulp.start('css');
	});
    gulp.watch(['dev/css/headStyle.css'], function(event) {
        gulp.start('cssTop');
    });
	gulp.watch(['dev/js/concat/*.js'], function(event) {
		gulp.start('js');
	});
    gulp.watch(['dev/js/core.js'], function(event) {
        gulp.start('jsCore');
    });
	gulp.watch(['dev/img/**/*'], function(event) {
		gulp.start('img');
	});
	gulp.watch(['dev/sprites/*'], function(event) {
		gulp.start('sprite');
	});
    gulp.watch(['dev/lib/**/*'], function(event) {
        gulp.start('lib');
    });
    gulp.watch(['dev/fonts/**/*'], function(event) {
        gulp.start('font');
    });
    gulp.watch(['dev/php/**/*'], function(event) {
        gulp.start('php');
    });
});