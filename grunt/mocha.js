module.exports = {
  test: {
    src: ['test/test.html']
  },

  coverage: {
    options: {
      reporter: 'HTMLCov',
      run: true
    },
    src: ['test/test.html'],
    dest: 'doc/coverage.html'
  }
}
