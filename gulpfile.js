const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const javascriptFiles = [
	'./app.js',
	'./workouts/define.js',
	'./workouts/log.js',
	'./user/auth.js'
];

gulp.task('bundle', function() {
	return gulp.src(javascriptFiles).pipe(concat('bundle.js')).pipe(uglify()).pipe(gulp.dest("./dist"));
//   								squish files together into one file 	  save bundle.js
});

//default task when 'gulp' runs: bundle, starts web server, then watches for changes
gulp.task('default', ['bundle']);