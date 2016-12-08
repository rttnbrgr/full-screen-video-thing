var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var jade = require('gulp-jade')
var surge = require('gulp-surge')

var sources = {
	jade: './**/*.jade',
	index: './index.jade'
}

var destination = {
	public: './',
	surge: 'full-screen-video-thing.surge.sh'
}

// sass task
gulp.task('styles', function() {
	return gulp.src('./assets/css/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./assets/css'));
});
 
// gulp.task('build', st)
gulp.task('default', ['styles'], function() {
	gulp.watch('assets/css/**/*.scss', ['styles']);
})

// browswer sync
gulp.task('browser-sync', function() {
	browserSync.init({
			server: {
					baseDir: "./"
			}
	});
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

	browserSync.init({
			server: {
				baseDir: "./"
			}
	});

	gulp.watch('assets/css/*.scss', ['sass']);
	gulp.watch(sources.jade, ['jade']);
	gulp.watch("./*.html").on('change', browserSync.reload);

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
		return gulp.src("assets/css/**/*.scss")
				.pipe(sass())
				.pipe(gulp.dest("assets/css"))
				.pipe(browserSync.stream());
});

// Compile and copy Jade
gulp.task('jade', function(event) {
	return gulp.src(sources.index)
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest(destination.public))
});

gulp.task('thing', ['serve', 'jade']);

// Surge Deploy Task
gulp.task('deploy', [], function () {
	return surge({
		project: destination.public,  // Path to your static build directory
		domain: destination.surge     // Your domain or Surge subdomain
	})
})