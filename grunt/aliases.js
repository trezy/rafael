module.exports = {
  default: [
    'build'
  ],

  build: [
    'dist',
    'docs'
  ],

  dev: [
    'build',
    'watch'
  ],

  dist: [
    'umd',
    'uglify'
  ],

  docs: [
    'clean:docs',
    'groc',
    //'mocha:coverage'
  ],

  test: [
    'mocha:test'
  ]
}
