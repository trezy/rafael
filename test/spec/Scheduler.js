var expect = chai.expect





describe('Scheduler', function () {
  var foo, isDone, scheduler




  before(function () {
    scheduler = new Scheduler
  })

  beforeEach(function () {
    isDone = false
    foo = function () {
      return true
    }
  })

  afterEach(function () {
    scheduler.clear()
  })





  it('should have a method named "clear"', function () {
    expect(scheduler.clear).to.be.a('function')
  })

  it('should have a method named "pause"', function () {
    expect(scheduler.pause).to.be.a('function')
  })

  it('should have a method named "start"', function () {
    expect(scheduler.start).to.be.a('function')
  })

  it('should have a method named "schedule"', function () {
    expect(scheduler.schedule).to.be.a('function')
  })

  it('should have a method named "unschedule"', function () {
    expect(scheduler.unschedule).to.be.a('function')
  })





  describe('.clear()', function () {
    it('should clear all tasks', function () {
      scheduler.schedule('foo', foo)
      scheduler.schedule('bar', foo)
      scheduler.schedule('baz', foo)
      scheduler.clear()
      expect(scheduler.tasks).to.be.empty
    })
  })





  describe('.pause()', function () {
    it('should pause all tasks', function () {
      scheduler.schedule('foo', foo)
      scheduler.schedule('bar', foo)
      scheduler.schedule('baz', foo)
      scheduler.pause()
      expect(scheduler.paused).to.be.true
    })

    it('should pause a single task', function () {
      scheduler.schedule('foo', foo)
      scheduler.schedule('bar', foo)
      scheduler.schedule('baz', foo)
      scheduler.pause('foo')
      expect(scheduler.tasks['foo'].paused).to.be.true
    })
  })





  describe('.start()', function () {
    it('should start all tasks', function () {
      scheduler.schedule('foo', foo)
      scheduler.schedule('bar', foo)
      scheduler.schedule('baz', foo)
      scheduler.pause()
      scheduler.start()
      expect(scheduler.paused).to.be.false
    })

    it('should start a single task', function () {
      scheduler.schedule('foo', foo)
      scheduler.schedule('bar', foo)
      scheduler.schedule('baz', foo)
      scheduler.pause('foo')
      scheduler.start('foo')
      expect(scheduler.tasks['foo'].paused).to.be.false
    })
  })





  describe('.schedule()', function () {
    it('should schedule a task', function (done) {
      scheduler.schedule('foo', function () {
        if (!isDone) {
          isDone = true
          done()
        }
      })
    })

    it('should schedule a task with a numeric ID', function () {
      expect(scheduler.schedule(foo)).to.be.a('number')
    })

    it('should error on duplicate IDs', function () {
      scheduler.schedule('foo', foo)
      expect(function () {
        scheduler.schedule('foo', foo)
      }).to.throw(RangeError)
    })

    it('should be able to schedule multiple tasks', function () {
      scheduler.schedule('foo', foo)
      scheduler.schedule('bar', foo)
      scheduler.schedule('baz', foo)

      expect(Object.keys(scheduler.tasks).length).to.equal(3)
    })

    it('should schedule a task with a frame rate', function (done) {
      var count = 0
      var framerate = Math.floor(Math.random() * 60)

      scheduler.schedule('foo', function () {
        count++
      }, { framerate: framerate })

      setTimeout(function () {
        scheduler.unschedule('foo')
        expect(count).to.be.closeTo(framerate, 5)
        done()
      }, 1000)
    })

    it('should error on framerates higher than 60', function () {
      var framerate = Math.random() + 60

      expect(function () {
        scheduler.schedule('foo', foo, { framerate: framerate })
      }).to.throw(RangeError)
    })

    it('should execute a task within a given context', function (done) {
      var scope = {}
      var then = function () {
        expect(scope.secret).to.equal('bar')
        done()
      }

      scheduler.schedule('foo', function () {
        if (!isDone) {
          isDone = true
          this.secret = 'bar'
          then()
        }
      }, {context: scope})
    })
  })





  describe('.unschedule()', function () {
    it('should unschedule a task', function () {
      scheduler.schedule('foo', foo)
      scheduler.unschedule('foo')
      expect(scheduler.tasks).to.be.empty
    })
  })
})
