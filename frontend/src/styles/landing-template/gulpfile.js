'use strict';

// Load plugins
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const gulp = require('gulp');
const header = require('gulp-header');
const merge = require('merge-stream');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = [
  '/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + new Date().getFullYear(),
  ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (DELETED_URL_WITH_CREDENTIALS