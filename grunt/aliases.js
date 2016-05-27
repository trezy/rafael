module.exports = {
  default: [
    'build'
  ],

  build: [
    'babel',
    'uglify'
  ],

  dev: [
    'build',
    'test',
    'watch'
  ],

  dist: [
    'build',
    'docs'
  ],

  docs: [
    'clean:docs',
    'groc'
  ],

  test: [
    'mocha:test'
  ]
}
