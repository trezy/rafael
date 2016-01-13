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

//  test: {
//    files: [
//      'test/**/*.js'
//    ],
//    tasks: [
//      'test'
//    ]
//  }
};
