// plug-in
const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const terser = require("gulp-terser"); // min
const obfusc = require("gulp-javascript-obfuscator"); // 난독화
const sass = require("gulp-dart-sass");
const cleanCSS = require("gulp-clean-css");
const fs = require('fs-extra');
const browserSync = require("browser-sync").create();

// path
const src = "./src";
const dist = "./dist";
const assets = "/assets";
const html = "/html";
const path_src = {
  scss: src + assets + "/styles/scss",
  css: src + assets + "/styles/css",
  fonts: src + assets + "/styles/fonts",
  js: src + assets + "/js",
  images: src + assets + "/images",
  html: src + html,
};
const path_dist = {
  css: dist + assets + "/styles/css",
  fonts: dist + assets + "/styles/fonts",
  images: dist + assets + "/images",
  js: dist + assets + "/js",
  html: dist + html,
  root: dist,
};

// dist 폴더를 삭제하는 task 정의
gulp.task("clean", function () {
  return import("del").then((del) => {
    return del.deleteAsync([path_dist.root]);
  });
});

// HTML 파일 인클루드
gulp.task("fileinclude", function () {
  return gulp
    .src([
      path_src.html + "/**/*.html", // 불러올 파일의 위치
      "!" + path_src.html + "/inc/**/*.html", // include 위치
    ])
    .pipe(fileinclude({
      prefix: "@@",
      basepath: "@file",
      context: {
        cssPath: "/assets/styles/css",
        jsPath: "/assets/js",
        fontsPath: "/assets/styles/fonts",
        imgPath: "/assets/images",
      }
    }))
    .pipe(gulp.dest(path_dist.root))
    .pipe(browserSync.stream());
});

// JavaScript 파일 병합 및 난독화
gulp.task("scripts", function () {
  // js 난독화
  const jsTask = gulp
    .src(path_src.js + "/*.js")
    // min 파일 생성
    // .pipe(terser())
    // 난독화
    .pipe(obfusc())
    // {
    //   compact: true,
    //   renameGlobals: true,
    //   unicodeEscapeSequence: true,
    //   splitStrings: true,
    //   selfDefending: true,
    //   controlFlowFlattening: true,
    // }
    .pipe(gulp.dest(path_dist.js))
    .pipe(browserSync.stream());

  // JSON 파일 복사
  const jsonTask = gulp
    .src(path_src.js + "/*.json")
    .pipe(gulp.dest(path_dist.js))
    .pipe(browserSync.stream());

  return Promise.all([jsTask, jsonTask]);
});

// SCSS 컴파일 작업
gulp.task("sass", function() {
  return gulp.src(path_src.scss + "/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path_dist.css))
    .pipe(browserSync.stream());
});

// 폰트 파일 복사
gulp.task('fonts', function() {
  return fs.copy(path_src.fonts, path_dist.fonts)
    .then(() => {
      console.log('Fonts copied successfully!');
    })
    .catch(err => {
      console.error('Error copying fonts:', err);
    });
});

// 이미지 파일 복사
gulp.task('images', function() {
  return fs.copy(path_src.images, path_dist.images)
    .then(() => {
      console.log('Images copied successfully!');
    })
    .catch(err => {
      console.error('Error copying images:', err);
    });
});

// serve
gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: path_dist.root
    }
  });
  // watch
  gulp.watch(path_src.html + "/**/*.html", gulp.series("fileinclude"));
  gulp.watch(path_src.js + "/**/*", gulp.series("scripts"));
  gulp.watch(path_src.scss + "/**/*", gulp.series("sass"));
  // .on("change", browserSync.reload);
});

// gulp start
gulp.task("default", gulp.series("clean", "fileinclude", "sass", "scripts", "fonts", "images", "serve"));
