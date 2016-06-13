/*
# Rafael
*/
var Rafael





/*
  ## `new Rafael`

  `Rafael.tasks` maintains a record of all currently running tasks
  associated with this instance of Rafael.

  This will kick off the `Rafael`'s loop to constantly run tasks.
*/
Rafael = function Rafael () {
  this.paused = false
  this.tasks = {}
  this.slowTasks = {}
  this.intervals = {}
  this._startLoop = this._startLoop.bind(this)
  this._startLoop()
}





/*
  ## `Rafael.schedule(taskId, task, options)`

  Schedule a task to be run in our loop. It takes up to three arguments:
  `taskId`, `task`, and `options`.

  * `taskId` (optional) represents the ID you'll use to interact with this task
  later on. If an ID isn't set then it will be the index of the new task in
  `this.tasks`.

  * `task` (required) is the function to be run on this `Rafael`.

  * `options` (optional) is a hash of options thingies?

      * `context` (optional) is the value of `this` within the function. If not
      set, the context will be `window`.

      * `paused` (optional) determines whether this task will run immediately
      after being added to the schedule

      * `framerate` (optional) is the speed at which the task should be run in
      frames per second (fps)
*/
Rafael.prototype.schedule = function schedule (id, task, options) {
  var framerate, task

  if (typeof id !== 'string') {
    options = task
    task = id
    id = Object.keys(this.tasks).length
  }

  options || (options = {})

  this._debug = options.debug || false
  this._frame = 0
  framerate = options.framerate || 60

  if (this._debug) {
    console.log('Scheduling task', id)
  }

  if (framerate > 60) {
    throw new RangeError('Framerate may not be higher than 60; Requested framerate is', framerate)
    return
  }

  if (this.tasks[id]) {
    throw new RangeError('A task with the ID "' + id + '" already exists')
    return
  }

  task = {
    context: options.context || window,
    paused: options.paused || false,
    framerate: framerate,
    task: task
  }

  if (framerate >= 1) {
    this.tasks[id] = task

  } else {
    this.slowTasks[id] = task
    this._startSlowTask(id)
  }

  return id
}





/*
  ## `Rafael.unschedule(id)`

  Remove a task from our loop. `id` is ID of the task to be removed from this `Rafael`.
*/
Rafael.prototype.unschedule = function unschedule (id) {
  if (this._debug) {
    console.log('Unscheduling task', id)
  }

  if (this.tasks[id]) {
    delete this.tasks[id]
  }

  if (this.slowTasks[id]) {
    this._pauseSlowTask(id)
    delete this.slowTasks[id]
  }

  return !this.tasks[id]
}





/*
  ## `Rafael.clear()`

  Remove all tasks from the `Rafael`. We just overwrite the original array
  since this is a destructive operation.
*/
Rafael.prototype.clear = function clear () {
  var i, interval, intervalID, intervalIDs, intervals

  if (this._debug) {
    console.log('Clearing tasks')
  }

  this.tasks = {}
  this.slowTasks = {}

  intervals = this.intervals
  intervalIDs = Object.keys(intervals)

  for (i = 0; i < intervalIDs.length; i++) {
    intervalID = intervalIDs[i]
    interval = intervals[intervalID]

    clearInterval(interval.timer)
    delete this.intervals[intervalID]
  }
}





/*
  ## `Rafael.pause(id)`

  TODO: Describe
*/
Rafael.prototype.pause = function pause (id) {
  if (this._debug) {
    console.log('Pausing', id || 'all tasks')
  }

  if (id) {
    if (this.tasks[id]) {
      this.tasks[id].paused = true
    }

    if (this.slowTasks[id]) {
      this.slowTasks[id].paused = true
      this._pauseSlowTask(id)
    }
  } else {
    this.paused = true
  }
}





/*
  ## `Rafael.start(id)`

  TODO: Describe
*/
Rafael.prototype.start = function start (id) {
  if (this._debug) {
    console.log('Starting', id || 'all tasks')
  }

  if (id) {
    if (this.tasks[id] && this.tasks[id].paused) {
      this.tasks[id].paused = false
    }

    if (this.slowTasks[id] && this.slowTasks[id].paused) {
      this.slowTasks[id].paused = false
      this._startSlowTask(id)
    }

  } else {
    this.paused = false
  }
}





/*
  ## `Rafael._taskCaller(taskObject)`

  TODO: Don't lie.
*/
Rafael.prototype._taskCaller = function _taskCaller (taskObject) {
  taskObject.task.call(taskObject.context)
}





/*
  ## `Rafael._startLoop()`

  Start the loop `requestAnimationFrame` loop for this `Rafael`.
*/
Rafael.prototype._startLoop = function _startLoop () {
  var i, schedule, tasks

  schedule = this
  tasks = Object.keys(this.tasks)

  requestAnimationFrame(schedule._startLoop)

  if (!this.paused) {
    for (i = 0; i < tasks.length; i++) {
      var task

      task = this.tasks[tasks[i]]

      if ((task['framerate'] === 60 || this._shouldRun(task['framerate'])) && !task.paused) {
        this._taskCaller(task)
      }
    }

    this._frame++
  }
}






/*
  ## `Rafael._startSlowTask()`

  TODO: Don't procrastinate, you tard.
*/
Rafael.prototype._startSlowTask = function _startSlowTask (id) {
  var framerate, interval, task, tasks

  task = this.slowTasks[id]
  framerate = task.framerate

  if (task.paused) {
    return
  }

  if (!this.intervals[framerate]) {
    this._registerInterval(framerate)
  }

  tasks = this.intervals[framerate].tasks

  if (tasks.indexOf(id) === -1) {
    tasks.push(id)
  }
}






/*
  ## `Rafael._pauseSlowTask()`

  TODO: Don't procrastinate, you tard.
*/
Rafael.prototype._pauseSlowTask = function _pauseSlowTask (id) {
  var framerate, interval, task, tasks

  task = this.slowTasks[id]
  framerate = task.framerate

  if (!this.intervals[framerate]) {
    return
  }

  tasks = this.intervals[framerate].tasks

  tasks.splice(tasks.indexOf(id), 1)

  if (!tasks.length) {
    delete this.intervals[framerate]
  }
}






/*
  ## `Rafael._registerInterval()`

  TODO: Don't procrastinate, you tard.
*/
Rafael.prototype._registerInterval = function _registerInterval (framerate) {
  var interval, msPerFrame

  msPerFrame = 1000 / framerate

  interval = this.intervals[framerate] = {
    tasks: []
  }

  interval.timer = setInterval(this._runSlowTask.bind(this, interval), msPerFrame)
}






/*
  ## `Rafael._runSlowTask()`

  TODO: Don't procrastinate, you tard.
*/
Rafael.prototype._runSlowTask = function _runSlowTask (interval) {
  var i, taskID, task, tasks

  tasks = interval.tasks

  for (i = 0; i < tasks.length; i++) {
    taskID = tasks[i]
    task = this.slowTasks[taskID]

    this._taskCaller(task)

    taskID = null
  }
}





/*
  ## `Rafael._shouldRun()`

  Compares the passed in framerate against the current frame to determine if the
  task should run on this frame
*/
Rafael.prototype._shouldRun = function _shouldRun (framerate) {
  return !(Math.floor(this._frame % (60 / framerate)))
}





module.exports = Rafael
