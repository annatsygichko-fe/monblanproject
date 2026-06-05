import gulp from "gulp";
import * as sassCompiler from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import browserSync from "browser-sync";
import { deleteAsync } from "del";

const sass = gulpSass(sassCompiler);
const bs = browserSync.create();

// Paths
const paths = {
  html: { src: "src/*.html", dest: "dist/" },
  scss: { src: "src/scss/**/*.scss", dest: "dist/css/" },
  js: { src: "src/js/**/*.js", dest: "dist/js/" },
  images: { src: "src/images/**/*", dest: "dist/images/" },
};

// Clean
export async function clean() {
  await deleteAsync(["dist"]);
}

// HTML
export function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(bs.stream());
}

// SCSS → CSS
export function styles() {
  return gulp
    .src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(bs.stream());
}

// JS
export function scripts() {
  return gulp
    .src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(bs.stream());
}

// Images
export function images() {
  return gulp
    .src(paths.images.src, { encoding: false })
    .pipe(gulp.dest(paths.images.dest))
    .pipe(bs.stream());
}

// Watch
export function watch() {
  bs.init({ server: { baseDir: "dist" }, notify: false });
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.scss.src, styles);
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.images.src, images);
}

// Build & Dev
export const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images),
);
export const dev = gulp.series(build, watch);

export default dev;