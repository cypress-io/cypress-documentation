const gulp = require('gulp')
const RevAll = require('gulp-rev-all')
const clean = require('gulp-clean')
const runSequence = require('run-sequence')

const revisionOpts = {
  dontGlobal: ['.ico', 'sitemap.xml', 'sitemap.xsl', 'logo.png'],
  dontRenameFile: ['.html', 'CNAME'],
  dontUpdateReference: ['.html'],
  dontSearchFile: ['.js'],
  debug: process.env.NODE_ENV === 'production',
}

function remove (folder) {
  return gulp
  .src(folder)
  .pipe(clean())
}

function moveJSNodeModule (path) {
  return gulp
  .src(`./node_modules/${path}`)
  .pipe(gulp.dest('./themes/cypress/source/js/vendor'))
}

function moveCSSNodeModule (path) {
  return gulp
  .src(`./node_modules/${path}`)
  .pipe(gulp.dest('./themes/cypress/source/css/vendor'))
}

gulp.task('move:menu:spy:js', function () {
  return moveJSNodeModule('menuspy/dist/menuspy.js')
})

gulp.task('move:doc:yall:js', function () {
  return moveJSNodeModule('yall/dist/yall-2.0.1.min.js')
})

gulp.task('move:scrolling:element:js', function () {
  return moveJSNodeModule('scrollingelement/scrollingelement.js')
})

gulp.task('move:doc:search:js', function () {
  return moveJSNodeModule('docsearch.js/dist/cdn/docsearch.js')
})

gulp.task('move:doc:search:css', function () {
  return moveCSSNodeModule('docsearch.js/dist/cdn/docsearch.css')
})

// move font files
gulp.task('move:fira:fonts', function () {
  return gulp
  .src('./node_modules/fira/**')
  .pipe(gulp.dest('./themes/cypress/source/fonts/vendor/fira'))
})

gulp.task('move:font:awesome:fonts', (cb) => {
  runSequence('move:font:awesome:css', 'move:font:awesome:fonts:folder', cb)
})

gulp.task('move:font:awesome:css', function () {
  return gulp
  .src('./node_modules/font-awesome/css/font-awesome.css')
  .pipe(gulp.dest('./themes/cypress/source/fonts/vendor/font-awesome/css'))
})

gulp.task('move:font:awesome:fonts:folder', function () {
  return gulp
  .src('./node_modules/font-awesome/fonts/*')
  .pipe(gulp.dest('./themes/cypress/source/fonts/vendor/font-awesome/fonts'))
})

gulp.task('revision', () => {
  return gulp
  .src('public/**')
  .pipe(RevAll.revision(revisionOpts))
  .pipe(gulp.dest('tmp'))
})

gulp.task('copy:tmp:to:public', () => {
  return gulp
  .src('tmp/**')
  .pipe(gulp.dest('public'))
})

gulp.task('clean:js', ['clean:js:folders', 'clean:non:application:js'])

gulp.task('clean:non:application:js', () => {
  return remove('public/js/!(application).js')
})

gulp.task('clean:js:folders', () => {
  return remove('public/js/vendor')
})

gulp.task('clean:css', () => {
  return remove('public/css/!(style|prism-coy).css')
})

gulp.task('clean:tmp', () => {
  return remove('tmp')
})

gulp.task('clean:public', () => {
  return remove('public')
})

gulp.task('pre:build', ['copy:static:assets'])

gulp.task('post:build', (cb) => {
  runSequence('clean:js', 'clean:css', 'revision', 'clean:public', 'copy:tmp:to:public', 'clean:tmp', cb)
})

gulp.task('copy:static:assets', ['move:menu:spy:js', 'move:scrolling:element:js', 'move:doc:search:js', 'move:doc:yall:js', 'move:doc:search:css', 'move:fira:fonts', 'move:font:awesome:fonts'])
