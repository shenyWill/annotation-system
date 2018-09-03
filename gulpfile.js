const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');

gulp.task('sass', () => {
    gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(autoprefixer({
		browers:['last 2 versions', 'Android >= 4.0','safari >=5','ie 8','ie 9','opera >=12.1','ios >=6'],
		cascade: true,
        remove:false
    }))
    .pipe(livereload());
})

gulp.task('js', () => {
    gulp.src('js/*.js')
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
})

gulp.task('watch',() => {
    livereload.listen();
    gulp.watch('scss/*.scss',['sass'])
    gulp.watch('js/*.js',['js'])
})