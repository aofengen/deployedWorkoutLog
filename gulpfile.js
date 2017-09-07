const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');

const javascriptFiles = [
	'./app.js',
	'./workouts/define.js',
	'./workouts/log.js',
	'./user/auth.js'
];

gulp.task('bundle', function() {
	return gulp.src(javascriptFiles)
	.pipe(sourcemaps.init())
	.pipe(concat('bundle.js')) //squish files together into one file
	.pipe(uglify())
	.pipe(sourcemaps.write('./maps/'))
	.pipe(gulp.dest("./dist")); //save bundle.js  								 	  
});

gulp.task('watch', function(){
	gulp.watch(javascriptFiles, ['bundle']);
})
//default task when 'gulp' runs: bundle, starts web server, then watches for changes
gulp.task('default', ['bundle', 'watch']);