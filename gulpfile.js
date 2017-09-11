// const gulp = require('gulp');
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify-es').default;
// const plumber = require('gulp-plumber');
// const sourcemaps = require('gulp-sourcemaps');
// const watch = require('gulp-watch');
// const notify = require('gulp-notify');

// const javascriptFiles = [
// 	'./app.js',
// 	'./workouts/define.js',
// 	'./workouts/log.js',
// 	'./user/auth.js'
// ];

// gulp.task('bundle', function() {
// 	return gulp.src(javascriptFiles)
// 	.pipe(sourcemaps.init())
// 	.pipe(concat('bundle.js')) //squish files together into one file
// 	// .pipe(gulp.dest("./dist"))
// 	// .pipe(plumber({
// 	// 	errorHandler: notify.onError({
// 	// 		title: 'Gulp',
// 	// 		message: '<%= error.message %>',
// 	// 	})
// 	// }))
// 	.pipe(uglify())
// 	.pipe(sourcemaps.write('./maps/'))
// 	.pipe(gulp.dest("./dist")); //save bundle.js  
// 	// .pipe(notify({
// 	// 	title: 'Gulp',
// 	// 	message: 'Scripts Done'
// 	// })); 								 	  
// });

// gulp.task('watch', function(){
// 	gulp.watch(javascriptFiles, ['bundle']);
// })
// //default task when 'gulp' runs: bundle, starts web server, then watches for changes
// gulp.task('default', ['bundle', 'watch']);

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
// var uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const javascriptFiles = [
	'./app.js',
	'./workouts/define.js',
	'./workouts/log.js',
	'./user/auth.js'
];

gulp.task('bundle', function() {
	return gulp.src(javascriptFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js')) // squash files together into bundle.js
		.pipe(uglify())
		.pipe(sourcemaps.write('./maps/'))
		.pipe(gulp.dest('./dist'));// save into /dist folder
});

gulp.task('default', ['bundle']);