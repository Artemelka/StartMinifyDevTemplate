const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const htmlminify = require("gulp-html-minify");
const replace = require('gulp-html-replace');
const includer = require('gulp-htmlincluder');
const gulpif = require("gulp-if");
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const rename = require("gulp-rename");
const spritesmith = require("gulp-spritesmith");
const uglify = require('gulp-uglify');

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

gulp.task('criticalCss', function () {
    gulp.src('dev/less/headStyle.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('-headStyle.html'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dev'));
});

gulp.task('style', function() {
    gulp.src('dev/less/general.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('style.min.css'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('jsCore', function() {
    gulp.src('dev/js/core.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename('core.min.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src('dev/js/concat/*.js')
      	.pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('img', function() {
    gulp.src('dev/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream())
});

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
	gulp.start('criticalCss', 'html', 'style', 'js', 'jsCore', 'img', 'sprite', 'lib', 'font', 'php', 'browser-sync');

	gulp.watch(['dev/**/*.html'], function() {
		gulp.start('html');
	});
    gulp.watch(['dev/less/**/*.less'], function() {
        gulp.start('criticalCss');
        gulp.start('style');
    });
	gulp.watch(['dev/js/concat/*.js'], function() {
		gulp.start('js');
	});
    gulp.watch(['dev/js/core.js'], function() {
        gulp.start('jsCore');
    });
	gulp.watch(['dev/img/**/*'], function() {
		gulp.start('img');
	});
	gulp.watch(['dev/sprites/*'], function() {
		gulp.start('sprite');
	});
    gulp.watch(['dev/lib/**/*'], function() {
        gulp.start('lib');
    });
    gulp.watch(['dev/fonts/**/*'], function() {
        gulp.start('font');
    });
    gulp.watch(['dev/php/**/*'], function() {
        gulp.start('php');
    });
});
