module.exports = {
  options: {
    spawn: true
  },

  js: {
    files: [
      'Scheduler.js'
    ],
    tasks: [
      'dist'
    ]
  },

  docs: {
    files: [
      'dist/Scheduler.js'
    ],
    tasks: [
      'docs'
    ]
  }
};
