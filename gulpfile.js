var gulp         = require('gulp');
var browserify   = require('browserify');
var babelify     = require('babelify');
var source       = require('vinyl-source-stream');
var sourcemaps   = require('gulp-sourcemaps');

gulp.task('browserify', function () {
    return browserify({entries: 'app.jsx', extensions: ['.jsx'], debug: true})
        .transform(babelify, {presets: ['es2015', 'react', 'stage-2']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('jsx:watch', function () {
    gulp.watch('*.jsx', ['browserify']);
});

gulp.task('watch',   ['jsx:watch']);
gulp.task('default', ['browserify', 'watch']);
