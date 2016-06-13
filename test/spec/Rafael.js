var expect = chai.expect





describe('Sanity Check', function () {
  var rafael





  before(function () {
    rafael = new Rafael
  })





  it('should have a method named "clear"', function () {
    expect(rafael.clear).to.be.a('function')
  })

  it('should have a method named "pause"', function () {
    expect(rafael.pause).to.be.a('function')
  })

  it('should have a method named "start"', function () {
    expect(rafael.start).to.be.a('function')
  })

  it('should have a method named "schedule"', function () {
    expect(rafael.schedule).to.be.a('function')
  })

  it('should have a method named "unschedule"', function () {
    expect(rafael.unschedule).to.be.a('function')
  })
})





describe('Rafael', function () {
  var foo, isDone, rafael




  before(function () {
    rafael = new Rafael
  })

  beforeEach(function () {
    isDone = false
    foo = function () {
      return true
    }
  })

  afterEach(function () {
    rafael.clear()
  })





  describe('.clear()', function () {
    it('should clear all tasks', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, { framerate: Math.random() })
      rafael.clear()

      expect(rafael.tasks).to.be.empty
      expect(rafael.slowTasks).to.be.empty
      expect(rafael.intervals).to.be.empty
    })
  })





  describe('.pause()', function () {
    it('should pause all tasks', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, { framerate: Math.random() })
      rafael.pause()

      expect(rafael.paused).to.be.true
    })

    it('should pause a single task', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, { framerate: Math.random() })
      rafael.schedule('bat', foo, { framerate: Math.random() })
      rafael.pause('foo')

      expect(rafael.tasks['foo'].paused).to.be.true
      expect(rafael.tasks['bar'].paused).to.be.false
      expect(rafael.slowTasks['baz'].paused).to.be.false
      expect(rafael.slowTasks['bat'].paused).to.be.false
    })

    it('should pause a single slow task', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, { framerate: Math.random() })
      rafael.schedule('bat', foo, { framerate: Math.random() })
      rafael.pause('baz')

      expect(rafael.tasks['foo'].paused).to.be.false
      expect(rafael.tasks['bar'].paused).to.be.false
      expect(rafael.slowTasks['baz'].paused).to.be.true
      expect(rafael.slowTasks['bat'].paused).to.be.false
    })

    it('should delete the interval if all relevant slow tasks are paused', function () {
      var framerate

      framerate = Math.random()

      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, { framerate: framerate })
      rafael.schedule('bat', foo, { framerate: framerate })
      rafael.pause('baz')
      rafael.pause('bat')

      expect(rafael.tasks['foo'].paused).to.be.false
      expect(rafael.tasks['bar'].paused).to.be.false
      expect(rafael.slowTasks['baz'].paused).to.be.true
      expect(rafael.slowTasks['bat'].paused).to.be.true
      expect(rafael.intervals[framerate]).to.not.exist
    })

    it('shouldn\'t fail when trying to pause a task that\'s already paused', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, { framerate: Math.random() })
      rafael.schedule('bat', foo, { framerate: Math.random() })
      rafael.pause('baz')
      rafael.pause('baz')

      expect(rafael.tasks['foo'].paused).to.be.false
      expect(rafael.tasks['bar'].paused).to.be.false
      expect(rafael.slowTasks['baz'].paused).to.be.true
      expect(rafael.slowTasks['bat'].paused).to.be.false
    })
  })





  describe('.start()', function () {
    it('should start all tasks', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo)
      rafael.pause()
      rafael.start()

      expect(rafael.paused).to.be.false
    })

    it('should start a single task', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo)
      rafael.pause('foo')
      rafael.start('foo')

      expect(rafael.tasks['foo'].paused).to.be.false
    })

    xit('should start a single slow task', function () {})
  })





  describe('.schedule()', function () {
    it('should schedule a task', function (done) {
      rafael.schedule('foo', function () {
        if (!isDone) {
          isDone = true
          done()
        }
      })
    })

    it('should schedule a task even without an ID', function () {
      expect(rafael.schedule(foo)).to.be.a('number')
    })

    it('should error on duplicate IDs', function () {
      rafael.schedule('foo', foo)
      expect(function () {
        rafael.schedule('foo', foo)
      }).to.throw(RangeError)
    })

    it('should schedule multiple tasks', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo)

      expect(Object.keys(rafael.tasks).length).to.equal(3)
    })

    it('should schedule a task with a framerate', function (done) {
      var count = 0
      var framerate = Math.floor(Math.random() * 60)

      rafael.schedule('foo', function () {
        count++
      }, { framerate: framerate })

      setTimeout(function () {
        rafael.unschedule('foo')
        expect(count).to.be.closeTo(framerate, 5)
        done()
      }, 1000)
    })

    it('should schedule a task with a framerate lower than 1', function () {
      var count = 0
      var framerate = Math.random()

      rafael.schedule('foo', function () {
        count++
      }, { framerate: framerate })

      setTimeout(function () {
        rafael.unschedule('foo')
        expect(count).to.be.closeTo(1, 0.5)
        done()
      }, 3000)
    })

    it('should error on framerates higher than 60', function () {
      var framerate = Math.random() + 60

      expect(function () {
        rafael.schedule('foo', foo, { framerate: framerate })
      }).to.throw(RangeError)
    })

    it('should execute a task within a given context', function (done) {
      var scope = {}
      var then = function () {
        expect(scope.secret).to.equal('bar')
        done()
      }

      rafael.schedule('foo', function () {
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
      rafael.schedule('foo', foo)
      rafael.unschedule('foo')

      expect(rafael.tasks).to.be.empty
    })

    xit('should unschedule a slow task', function () {
      var framerate

      framerate = Math.random()

      rafael.schedule('foo', foo, { framerate: framerate })
      rafael.unschedule('foo')

      expect(rafael.slowTasks).to.be.empty
    })
  })
})
