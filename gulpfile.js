const gulp = require('gulp')
const webpack = require('webpack-stream')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const cssnano = require('gulp-cssnano')

gulp.task('build:js', () => {
  return gulp.src('src/vizceral.jsx')
    .pipe(webpack({
      module: {
        rules: [{
          test: /\.jsx?/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react']
          }
        }]
      },
      output: {
        library: 'Vizceral',
        libraryTarget: 'umd'
      },
      externals: {
        react: 'React',
        'prop-types': 'PropTypes'
      }
    }))
    .pipe(rename({
      basename: 'vizceral'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('build:css', () => {
  return gulp.src('src/vizceral.css')
    .pipe(gulp.dest('dist/'))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['build:js', 'build:css'])

