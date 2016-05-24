module.exports = {
  default: [
    'build'
  ],

  build: [
    'dist',
    'docs'
  ],

  dev: [
    'test',
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
    'dist',
    'mocha:test'
  ]
}
