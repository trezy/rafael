// Module imports
const { expect } = require('chai')
const sinon = require('sinon')





// Local imports
const Rafael = require('../dist/Rafael')





describe('Sanity Check', function () {
  before(function () {
    // Run `jsdom` to get a fake `window`
    require('jsdom-global')('', {
      // This options ensures that the `window` object has `requestAnimationFrame`
      pretendToBeVisual: true,
    })

    // Create the Rafael instance to be used throughout the tests
    this.rafael = new Rafael
  })





  it('should have a method named "clear"', function () {
    expect(this.rafael.clear).to.be.a('function')
  })

  it('should have a method named "pause"', function () {
    expect(this.rafael.pause).to.be.a('function')
  })

  it('should have a method named "start"', function () {
    expect(this.rafael.start).to.be.a('function')
  })

  it('should have a method named "schedule"', function () {
    expect(this.rafael.schedule).to.be.a('function')
  })

  it('should have a method named "unschedule"', function () {
    expect(this.rafael.unschedule).to.be.a('function')
  })
})





describe('Rafael', function () {
  before(function () {
    this.rafael = new Rafael
  })

  afterEach(function () {
    this.rafael.clear()
  })





  describe('.clear()', function () {
    it('should clear all tasks', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.schedule('bar', sinon.fake())
      this.rafael.schedule('baz', sinon.fake())
      this.rafael.clear()
      expect(this.rafael.tasks).to.be.empty
    })
  })





  describe('.pause()', function () {
    it('should pause all tasks', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.schedule('bar', sinon.fake())
      this.rafael.schedule('baz', sinon.fake())
      this.rafael.pause()
      expect(this.rafael.paused).to.be.true
    })

    it('should pause a single task', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.schedule('bar', sinon.fake())
      this.rafael.schedule('baz', sinon.fake())
      this.rafael.pause('foo')
      expect(this.rafael.tasks['foo'].paused).to.be.true
    })

    it('should not throw an error when pausing a task that does not exist', function () {
      expect(() => this.rafael.pause('foo')).to.not.throw(Error)
    })
  })





  describe('.start()', function () {
    it('should start all tasks', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.schedule('bar', sinon.fake())
      this.rafael.schedule('baz', sinon.fake())
      this.rafael.pause()
      this.rafael.start()
      expect(this.rafael.paused).to.be.false
    })

    it('should start a single task', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.schedule('bar', sinon.fake())
      this.rafael.schedule('baz', sinon.fake())
      this.rafael.pause('foo')
      this.rafael.start('foo')
      expect(this.rafael.tasks['foo'].paused).to.be.false
    })
  })





  describe('.schedule()', function () {
    it('should schedule a task', function (done) {
      let isDone = false

      this.rafael.schedule('foo', () => {
        if (!isDone) {
          isDone = true
          done()
        }
      })
    })

    it('should schedule a task even without an ID', function () {
      expect(this.rafael.schedule(sinon.fake())).to.be.a('number')
    })

    it('should error on duplicate IDs', function () {
      this.rafael.schedule('foo', sinon.fake())
      expect(() => this.rafael.schedule('foo', sinon.fake())).to.throw(RangeError)
    })

    it('should schedule multiple tasks', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.schedule('bar', sinon.fake())
      this.rafael.schedule('baz', sinon.fake())

      expect(Object.keys(this.rafael.tasks).length).to.equal(3)
    })

    it('should schedule a task with a framerate', function (done) {
      let count = 0
      let framerate = Math.floor(Math.random() * 60)

      this.rafael.schedule('foo', function () {
        count++
      }, { framerate: framerate })

      setTimeout(() => {
        this.rafael.unschedule('foo')
        expect(count).to.be.closeTo(framerate, 5)
        done()
      }, 1000)
    })

    it('should schedule a task with a framerate lower than 1', function () {
      let count = 0
      let framerate = Math.random()

      this.rafael.schedule('foo', function () {
        count++
      }, { framerate: framerate })

      setTimeout(() => {
        this.rafael.unschedule('foo')
        expect(count).to.be.closeTo(1, 0.5)
        done()
      }, 3000)
    })

    it('should error on framerates higher than 60', function () {
      let framerate = Math.random() + 60

      expect(() => this.rafael.schedule('foo', sinon.fake(), { framerate: framerate })).to.throw(RangeError)
    })

    it('should execute a task within a given context', function (done) {
      const scope = {}
      const then = function () {
        expect(scope.secret).to.equal('bar')
        done()
      }
      let isDone = false

      this.rafael.schedule('foo', function () {
        if (!isDone) {
          isDone = true
          this.secret = 'bar'
          then()
        }
      }, { context: scope })
    })
  })





  describe('.unschedule()', function () {
    it('should unschedule a task', function () {
      this.rafael.schedule('foo', sinon.fake())
      this.rafael.unschedule('foo')
      expect(this.rafael.tasks).to.be.empty
    })
  })
})
