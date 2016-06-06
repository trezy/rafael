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
    'test',
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
