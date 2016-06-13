var expect





expect = chai.expect





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
  var foo, generateID, isDone, rafael, scheduleSlowTasks, scheduleTasks





  before(function () {
    rafael = new Rafael

    foo = function () {
      return true
    }

    generateID = function () {
      return parseInt((performance.now() * 10000000000).toFixed()).toString(36)
    }

    scheduleTasks = function scheduleTasks (taskCount) {
      var i, tasksCreated

      taskCount || (taskCount = 1)
      tasksCreated = []

      for (i = 0; i < taskCount; i++) {
        tasksCreated.push(rafael.schedule(generateID(), foo, { framerate: (Math.random() * 59) + 1 }))
      }

      return tasksCreated
    }

    scheduleSlowTasks = function scheduleTasks (taskCount) {
      var i, tasksCreated

      tasksCreated = []
      taskCount || (taskCount = 1)

      for (i = 0; i < taskCount; i++) {
        tasksCreated.push(rafael.schedule(generateID(), foo, { framerate: Math.random() }))
      }

      return tasksCreated
    }
  })

  beforeEach(function () {
    isDone = false
  })

  afterEach(function () {
    rafael.clear()
  })





  describe('.clear()', function () {
    it('should clear all tasks', function () {
      scheduleTasks(2)
      scheduleSlowTasks(2)
      rafael.clear()

      expect(rafael.tasks).to.be.empty
      expect(rafael.slowTasks).to.be.empty
      expect(rafael.intervals).to.be.empty
    })
  })





  describe('.pause()', function () {
    it('should pause all tasks', function () {
      scheduleTasks(2)
      scheduleSlowTasks(2)
      rafael.pause()

      expect(rafael.paused).to.be.true
    })

    it('should pause a single task', function () {
      var i, numTasks, slowTasks, tasks, taskToPause

      numTasks = 3
      taskToPause = 0

      tasks = scheduleTasks(numTasks)
      slowTasks = scheduleSlowTasks(numTasks)
      rafael.pause(tasks[taskToPause])

      for (i = 0; i < numTasks; i++) {
        if (i === taskToPause) {
          expect(rafael.tasks[tasks[i]].paused).to.be.true

        } else {
          expect(rafael.tasks[tasks[i]].paused).to.be.false
        }

        expect(rafael.slowTasks[slowTasks[i]].paused).to.be.false
      }
    })

    it('should pause a single slow task', function () {
      var i, numTasks, slowTasks, tasks, taskToPause

      numTasks = 3
      taskToPause = 0

      tasks = scheduleTasks(numTasks)
      slowTasks = scheduleSlowTasks(numTasks)
      rafael.pause(slowTasks[taskToPause])

      for (i = 0; i < numTasks; i++) {
        if (i === taskToPause) {
          expect(rafael.slowTasks[slowTasks[i]].paused).to.be.true

        } else {
          expect(rafael.slowTasks[slowTasks[i]].paused).to.be.false
        }

        expect(rafael.tasks[tasks[i]].paused).to.be.false
      }
    })

    it('should delete the interval if all relevant slow tasks are paused', function () {
      var framerates, i, numTasks, slowTasks, tasks

      framerates = []
      numTasks = 3

      tasks = scheduleTasks(numTasks)
      slowTasks = scheduleSlowTasks(numTasks)

      slowTasks.forEach(function (taskID) {
        framerates.push(rafael.slowTasks[taskID].framerate)
        rafael.pause(taskID)
      })

      framerates.forEach(function (framerate) {
        expect(rafael.intervals[framerate]).to.not.exist
      })
    })

    it('shouldn\'t fail when trying to pause a task that\'s already paused', function () {
      var numTasks, slowTasks, tasks, taskToPause

      numTasks = 3
      taskToPause = 0

      tasks = scheduleTasks(numTasks)
      slowTasks = scheduleSlowTasks(numTasks)

      rafael.pause(slowTasks[taskToPause])

      expect(function () {
        rafael.pause(slowTasks[taskToPause])
      }).to.not.throw(Error)
    })
  })





  describe('.start()', function () {
    it('should start all tasks', function () {
      var framerates, slowTasks, tasks

      framerates = []

      tasks = scheduleTasks(2)
      slowTasks = scheduleSlowTasks(2)
      rafael.pause()
      rafael.start()

      slowTasks.forEach(function (taskID) {
        framerates.push(rafael.slowTasks[taskID].framerate)
      })

      expect(rafael.paused).to.be.false

      framerates.forEach(function (framerate) {
        expect(rafael.intervals[framerate]).to.exist
      })
    })

    it('should start a single task', function () {
      var i, numTasks, slowTasks, tasks, taskToStart

      numTasks = 3
      taskToStart = 0

      tasks = scheduleTasks(numTasks)
      slowTasks = scheduleSlowTasks(numTasks)
      rafael.pause()
      rafael.start(tasks[taskToStart])

      for (i = 0; i < numTasks; i++) {
        if (i === taskToStart) {
          expect(rafael.tasks[tasks[i]].paused).to.be.true

        } else {
          expect(rafael.tasks[tasks[i]].paused).to.be.false
        }

        expect(rafael.slowTasks[slowTasks[i]].paused).to.be.false
      }
    })

    it('should start a single slow task', function () {
      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, {framerate: Math.random()})
      rafael.schedule('bat', foo, {framerate: Math.random()})
      rafael.pause('baz')
      rafael.start('baz')

      expect(rafael.tasks['foo'].paused).to.be.false
      expect(rafael.tasks['bar'].paused).to.be.false
      expect(rafael.slowTasks['baz'].paused).to.be.false
      expect(rafael.slowTasks['bat'].paused).to.be.false
    })

    it('shouldn\'t fail when trying to start a task that\'s already started', function () {
      var duplicates, framerate, tasks

      framerate = Math.random()

      rafael.schedule('foo', foo)
      rafael.schedule('bar', foo)
      rafael.schedule('baz', foo, {framerate: framerate})
      rafael.schedule('bat', foo, {framerate: framerate})
      rafael.start('baz')

      tasks = rafael.intervals[framerate].tasks
      duplicates = 0

      tasks.forEach(function (taskToMatch, index) {
        tasks.splice(index, 1)

        if (tasks.indexOf(taskToMatch) !== -1) {
          duplicates++
        }
      })

      expect(duplicates).to.equal(0)
    })
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

    it('should unschedule a slow task', function () {
      rafael.schedule('foo', foo, { framerate: Math.random() })
      rafael.unschedule('foo')

      expect(rafael.slowTasks).to.be.empty
    })
  })
})
