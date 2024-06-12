"use strict";

// plug-in
const gulp = require("gulp");
const uglify = require("gulp-uglify"); // min
const terser = require("gulp-terser"); // min
const obfusc = require("gulp-javascript-obfuscator"); // 낙독화

// path
const src = "./src";
const dist = "./dist";
const assets = "/assets";
const html = "/html";
const path_src = {
  scss : src + assets + "/styles/scss",
  css : src + assets + "/styles/css",
  js : src + assets + "/js",
  html : src + html,
}
const path_dist = {
  css : dist + assets + "/css",
  js : dist + assets + "/js",
  root : dist,
}

// minifyJs
gulp.task("minifyJs", function () {
  // js 난독화
  const jsTask = gulp
    .src(path_src.js + "/*.js")
    // .pipe(concat("bundle.js")) // 모듈화 파일 병합
    // min 파일 생성
    // .pipe(uglify())
    .pipe(obfusc())
    // obfusc 옵션 난독화
    // {
    //   compact: true,
    //   renameGlobals: true,
    //   unicodeEscapeSequence: true,
    //   splitStrings: true,
    //   selfDefending: true,
    //   controlFlowFlattening: true,
    // }
    .pipe(gulp.dest(path_dist.js));

  // JSON 파일 복사
  const jsonTask = gulp
    .src(path_src.js + "/*.json")
    .pipe(gulp.dest(path_dist.js));

  return Promise.all([jsTask, jsonTask]);
});

// gulp start
gulp.task(
  "start",
  gulp.parallel(
    "minifyJs"
    // "html",
    // "sass_compile",
    // "css_min",
    // "webstart",
    // "watch"
    // "browser_sync",
  )
);
