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

  major: [
    'bump:major',
    'releaseable'
  ],

  minor: [
    'bump:minor',
    'releaseable'
  ],

  patch: [
    'bump',
    'releaseable'
  ],

  test: [
    'mocha:test'
  ]
}
