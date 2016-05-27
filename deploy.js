'use strict'





let fs = require('fs')
let path = require('path')
let shelljs = require('shelljs')

let nodePath = process.argv.shift()
let scriptPath = process.argv.shift()





class Git {
  add (files) {
    shelljs.exec('git add -f ' + files.join(' '), this.shellOptions)
  }

  branch (name, options) {
    let args = []
    options || (options = {})

    if (options.delete) {
      args.push('-D')
    }

    args = args.join(' ')

    shelljs.exec(`git branch ${args} ${name}`, this.shellOptions)
  }

  checkout (name, options) {
    let args = []
    options || (options = {})

    if (options.isNew) {
      args.push('-b')
    }

    args = args.join(' ')

    shelljs.exec(`git checkout ${args} ${name}`, this.shellOptions)
  }

  commit (message) {
    shelljs.exec(`git commit -m '${message}'`, this.shellOptions)
  }

  tag (name, message) {
    message || (name = message)

    shelljs.exec(`git tag ${name} -m '${message}'`, this.shellOptions)
  }

  get currentBranch () {
    return shelljs.exec('git branch', this.shellOptions).stdout.match(/\*.*/gi)[0].replace('* ', '')
  }

  get shellOptions () {
    return {
      silent: true
    }
  }
}





new class Deployment {
  _bump (version) {
    // Break up the version number for easier parsing
    version = version.split('.')

    // Convert the version numbers to actual numbers instead of strings so we can
    // properly increment them
    version.forEach((number, index, array) => {
      array[index] = parseInt(number)
    })

    switch (this.args.bump) {
      case 'major':
        version[0]++
        version[1] = 0
        version[2] = 0
        break

      case 'minor':
        version[1]++
        version[2] = 0
        break

      case 'patch':
        version[2]++
        break
    }

    return version.join('.')
  }

  _saveBowerJSON () {
    this.bowerJSON = this.bowerJSON
  }

  _savePackageJSON () {
    this.packageJSON = this.packageJSON
  }

  _updateBowerJSON () {
    this.bowerJSON.version = this.version
  }

  _updatePackageJSON () {
    this.packageJSON.version = this.version
  }





  constructor () {
    this.args.bump = process.argv.shift()

    this.git = new Git
    this.originalBranch = this.git.currentBranch
    this.version = this._bump(this.packageJSON.version)

    this.update()
    this.save()

    console.log('Done.')
  }

  save () {
    let name = `v${this.version}`
    let message = `Release v${this.version}`

    this._saveBowerJSON()
    this._savePackageJSON()

    console.log('Commiting config files...')
    this.git.add(['bower.json', 'package.json'])
    this.git.commit(`Bump version to ${name}`)

    console.log('Creating new release branch...')
    this.git.checkout(name, {
      isNew: true
    })
    this.git.add(['dist'])
    this.git.commit(message)

    console.log('Creating tag...')
    this.git.tag(name, message)

    console.log(`Switching back to ${this.originalBranch} branch...`)
    this.git.checkout(this.originalBranch)

    console.log('Deleting release branch...')
    this.git.branch(name, {
      delete: true
    })
  }

  update () {
    console.log('Updating config files...')
    this._updatePackageJSON()
    this._updateBowerJSON()
  }





  get args () {
    return this._args || (this._args = {})
  }

  get bowerJSON () {
    return this._bowerJSON || (this._bowerJSON = JSON.parse(fs.readFileSync('bower.json', 'utf8')))
  }

  get packageJSON () {
    return this._packageJSON || (this._packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8')))
  }





  set bowerJSON (value) {
    this._bowerJSON = value
    fs.writeFileSync('bower.json', JSON.stringify(value, null, 2), 'utf8')
  }

  set packageJSON (value) {
    this._packageJSON = value
    fs.writeFileSync('package.json', JSON.stringify(value, null, 2), 'utf8')
  }
}
