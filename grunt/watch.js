module.exports = {
  options: {
    spawn: true
  },

  js: {
    files: [
      'Rafael.js'
    ],
    tasks: [
      'dist',
      'test'
    ]
  },

  docs: {
    files: [
      'dist/Rafael.js'
    ],
    tasks: [
      'docs'
    ]
  },

  test: {
    files: [
      'test/**/*.js'
    ],
    tasks: [
      'test'
    ]
  }
};
