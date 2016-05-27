module.exports = {
  options: {
    commit: true,
    commitFiles: [
      'package.json',
      'bower.json'
    ],
    createTag: false,
    files: [
      'package.json',
      'bower.json'
    ],
    push: true,
    pushTo: 'upstream',
    syncVersions: true
  }
}
