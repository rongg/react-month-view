var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('scss-compile', function(){
    return gulp.src(['./src/sass/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./src/css'))
});