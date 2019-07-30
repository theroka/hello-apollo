const gulp = require("gulp");
const ts = require("gulp-typescript");

let project = ts.createProject("tsconfig.json");

// transpile Ts to ES5 / CommonJS
gulp.task("build", function() {
  return project.src()
    .pipe(project())
    .js.pipe(gulp.dest("build"))
});

// copy static assets to dist folder
gulp.task("assets", function() {
  return gulp.src([
    "src/schema.gql",
    "protos/Books.proto"
  ])
    .pipe(gulp.dest("build"))
})

gulp.task("default", gulp.series("build", "assets"));
