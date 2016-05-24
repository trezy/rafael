module.exports = {
  options: {
    spawn: true
  },

  js: {
    files: [
      'Scheduler.js'
    ],
    tasks: [
      'dist',
      'test'
    ]
  },

  docs: {
    files: [
      'dist/Scheduler.js'
    ],
    tasks: [
      'docs'
    ]
  },

  test: {
    files: [
      'dist/Scheduler.js',
      'test/**/*.js'
    ],
    tasks: [
      'test'
    ]
  }
};
