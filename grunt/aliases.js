module.exports = {
  default: [
    'dist',
    'docs',
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
