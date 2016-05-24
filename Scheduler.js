/*
# Scheduler v3.0.0
*/
var Scheduler





/*
  ## `new Scheduler`

  `Scheduler.tasks` maintains a record of all currently running tasks
  associated with this scheduler.

  This will kick off the `Scheduler`'s loop to constantly run tasks.
*/
Scheduler = function Scheduler () {
  this.paused = false
  this.tasks = {}
  this._startLoop = this._startLoop.bind(this)
  this._startLoop()
}





/*
  ## `Scheduler.schedule(taskId, task, context)`

  Schedule a task to be run in our loop. It takes up to three arguments:
  `taskId`, `task`, and `context`.

  * `taskId` (optional) represents the ID you'll use to interact with this task
  later on. If an ID isn't set then it will be the index of the new task in
  `this.tasks`.

  * `task` (required) is the function to be run on this `Scheduler`.

  * `options` (optional) is a hash of options thingies?

      * `context` (optional) is the value of `this` within the function. If not
      set, the context will be `window`.

      * `paused` (optional) determines whether this task will run immediately
      after being added to the schedule

      * `framerate` (optional) is the speed at which the task should be run in
      frames per second (fps)
*/
Scheduler.prototype.schedule = function schedule (id, task, options) {
  var framerate

  if (typeof id !== 'string') {
    options = task
    task = id
    id = Object.keys(this.tasks).length
  }

  options || (options = {})

  this._debug = options.debug || false
  this._frame = 0
  framerate = Math.ceil(options.framerate || 60)

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

  this.tasks[id] = {
    context: options.context || window,
    paused: options.paused || false,
    framerate: framerate,
    task: task
  }

  return id
}





/*
  ## `Scheduler.unschedule(id)`

  Remove a task from our loop. `id` is ID of the task to be removed from this `Scheduler`.
*/
Scheduler.prototype.unschedule = function schedule (id) {
  if (this._debug) {
    console.log('Unscheduling task', id)
  }

  delete this.tasks[id]
  return !this.tasks[id]
}





/*
  ## `Scheduler.clear()`

  Remove all tasks from the `Scheduler`. We just overwrite the original array
  since this is a destructive operation.
*/
Scheduler.prototype.clear = function schedule () {
  if (this._debug) {
    console.log('Clearing scheduler')
  }

  this.tasks = {}
}





/*
  ## `Scheduler.pause(id)`

  TODO: Describe
*/
Scheduler.prototype.pause = function pause (id) {
  if (this._debug) {
    console.log('Pausing task', id || 'scheduler')
  }

  if (id) {
    this.tasks[id].paused = true
  } else {
    this.paused = true
  }
}





/*
  ## `Scheduler.start(id)`

  TODO: Describe
*/
Scheduler.prototype.start = function start (id) {
  if (this._debug) {
    console.log('Starting', id || 'scheduler')
  }

  if (id) {
    this.tasks[id].paused = false
  } else {
    this.paused = false
  }
}





/*
  ## `Scheduler._taskCaller(taskObject)`

  Start the loop `requestAnimationFrame` loop for this `Scheduler`.
*/
Scheduler.prototype._taskCaller = function _taskCaller (taskObject) {
  taskObject.task.call(taskObject.context)
}





/*
  ## `Scheduler._startLoop()`

  Start the loop `requestAnimationFrame` loop for this `Scheduler`.
*/
Scheduler.prototype._startLoop = function _startLoop () {
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
  ## `Scheduler._shouldRun()`

  Compares the passed in framerate against the current frame to determine if the
  task should run on this frame
*/
Scheduler.prototype._shouldRun = function _shouldRun (framerate) {
  return !(Math.floor(this._frame % (60 / framerate)))
}
