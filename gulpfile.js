var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

/**
 * Compile scss files to css
 */
gulp.task('styles', function () {
  gulp.src('./scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(reload({ stream: true }));
});

/**
 * Create a server from the base directory
 */
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    notify: {
      styles: ['opacity: 0', 'position: absolute']
    }
  });

  /**
   *Watch for any changes in the scss files an reload the browser
   */
  gulp.watch('./scss/*.scss', ['styles']);
   /**
   *Watch for any changes in the js file an reload the browser
   */
  gulp.watch('./**/*.js').on('change', reload);
  gulp.watch('./**/*.html').on('change', reload);
});

gulp.task('default', ['styles', 'serve']);