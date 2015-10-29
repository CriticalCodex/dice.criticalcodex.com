// grab our packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint');
    sass = require('gulp-sass');
    sourcemaps = require('gulp-sourcemaps');
    concat = require('gulp-concat');
    autoprefixer = require('gulp-autoprefixer');
    minifyCSS = require('gulp-minify-css');
    rename = require('gulp-rename'); // to rename any file
    uglify = require('gulp-uglify');
    del = require('del');
    stylish = require('jshint-stylish');
    runSequence = require('run-sequence');
    coffee = require('gulp-coffee');
    gutil = require('gulp-util');
    http = require('http');
    ecstatic = require('ecstatic');
    deploy = require('gulp-gh-pages');
    bower = require('gulp-bower');

// Cleans the web dist folder
gulp.task('clean', function (cb) {
    del([
        'dist/**/*',
        'dist/js/libs/**/*.js',
        '!dist/fonts',
        '!dist/fonts/*.*',
        '!dist/images',
        '!dist/images/*.*',
        '!dist/index.html',
        '!dist/favicon.ico',
        '!dist/json'
    ], cb);
});

// Copy fonts task
gulp.task('copy-fonts', function() {
   gulp.src('source/fonts/**/*.{ttf,woff,eof,svg,eot,woff2,otf}')
   .pipe(gulp.dest('dist/fonts'));
});

// Compile coffeescript to JS
gulp.task('brew-coffee', function() {
  gulp.src('source/coffee/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('source/js/app/'))
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
  return gulp.src('source/scss/site.scss')
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCSS())
    .pipe(rename('site.min.css'))
    .pipe(gulp.dest('dist/css'))
    .on('error', sass.logError)
});

gulp.task('concat-js', function() {
    return gulp.src([
        'source/bower_components/bootstrap/dist/js/bootstrap.min.js',
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('site.js'))
      .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/js'));
});

// Shrinks all the js
gulp.task('shrink-js', function() {
    return gulp.src('source/js/*.js')
    // .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// Copy JS libraries over
gulp.task('copy-js', function() {
   gulp.src('source/js/libs/**/*.js').pipe(gulp.dest('dist/js/libs/'));
   gulp.src('source/js/*.js').pipe(gulp.dest('dist/js/'));
});

// Default build task
gulp.task('build-js', function(callback) {
  runSequence('copy-js', ['concat-js'], callback);
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/coffee/**/*.js', ['brew-coffee']);
  gulp.watch('source/js/**/*.js', ['build-js']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
});

var options = {
    remoteUrl: "https://github.com/criticalcodex/dice.criticalcodex.com.git",
    branch: "gh-pages",
    push: true,
    force: true
};

gulp.task('bower', function() {
  return bower({ cmd: 'update'});
});

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(deploy(options));
});

gulp.task('http', function(){
  http.createServer(
    ecstatic({ root: __dirname + '/dist' })
  ).listen(8080);
  console.log('Listening on :8080');

  gulp.watch('source/coffee/**/*.js', ['brew-coffee']);
  gulp.watch('source/js/**/*.js', ['build-js']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);

});

// Default build task to build everything e
gulp.task('build', function(callback) {
  runSequence('copy-fonts', 'bower',
              ['build-css', 'build-js'],
              callback);
});
