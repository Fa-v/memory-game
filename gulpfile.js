var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

/**
 * Compile scss files to css
 */
gulp.task('styles', function () {
  gulp.src('./scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({ stream: true }));
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
   *Watch for any changes in the files an reload the browser
   */
  gulp.watch('./scss/*.scss', ['styles']);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['styles', 'serve']);