'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------
var localPath = 'F:/Temp/new/soi2/'
var input = localPath + 'scss/**/*.scss';
var output = localPath + '/css';

var autoprefixerOptions = {
		browsers: [
			'last 2 Chrome versions',
			'last 4 Android versions',
			'last 4 iOS versions',
			'last 2 OperaMobile versions',
			'last 4 ChromeAndroid versions',
			'last 2 FirefoxAndroid versions',
			'last 2 ExplorerMobile versions'
		]
	};

// -----------------------------------------------------------------------------
// Production build
// -----------------------------------------------------------------------------
gulp.task('prod', function () {
	return gulp.src(input)
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(csscomb())
	.pipe(gulp.dest(output))
});

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------
gulp.task('watch', function() {
	return gulp
	// Watch the input folder for change,
	// and run refresh task when something happens
	.watch(input, ['prod'])
	// When there is a change,
	// log a message in the console
	.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------
gulp.task('default', ['watch']);

