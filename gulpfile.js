const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');




// compile scss into css

function style() {
    // 1. whre is my scss file
    return gulp.src('app/scss/**/*.scss')

        .pipe(sourcemaps.init())
        // 2. pass that file throught sass compiler
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/susy/sass']
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        // 3. where do I save the compiled CSS? 
        .pipe(sourcemaps.write('.'))        
        .pipe(gulp.dest('./dist/css'))

        .pipe(browserSync.stream());
}


// compile js 

function jsTask() {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js')
        );
}

// Cachebusting task 

const cbString = new Date().getTime();
function cacheBustTask() {
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(set('.')
    );
}


function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('app/scss/**/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js').on('change', jsTask);
}



exports.watch = watch;