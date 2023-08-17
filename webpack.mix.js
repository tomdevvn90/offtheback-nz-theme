const mix = require('laravel-mix');

mix
  .js('./src/main.js', './assets/offtheback-nz.bundle.js')
  .sass('./src/scss/main.scss', 'offtheback-nz.bundle.css')
  .setPublicPath('./assets')