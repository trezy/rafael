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
  ## `Rafael.unschedule(id)`

  Remove a task from our loop. `id` is ID of the task to be removed from this `Rafael`.
*/
Rafael.prototype.unschedule = function schedule (id) {
  if (this._debug) {
    console.log('Unscheduling task', id)
  }

  delete this.tasks[id]
  return !this.tasks[id]
}





/*
  ## `Rafael.clear()`

  Remove all tasks from the `Rafael`. We just overwrite the original array
  since this is a destructive operation.
*/
Rafael.prototype.clear = function schedule () {
  if (this._debug) {
    console.log('Clearing tasks')
  }

  this.tasks = {}
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
    this.tasks[id].paused = true
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
    this.tasks[id].paused = false
  } else {
    this.paused = false
  }
}





/*
  ## `Rafael._taskCaller(taskObject)`

  Start the loop `requestAnimationFrame` loop for this `Rafael`.
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
  ## `Rafael._shouldRun()`

  Compares the passed in framerate against the current frame to determine if the
  task should run on this frame
*/
Rafael.prototype._shouldRun = function _shouldRun (framerate) {
  return !(Math.floor(this._frame % (60 / framerate)))
}





module.exports = Rafael
