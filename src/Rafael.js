/*
  # Rafael

  */
 class Rafael {
  /*
    The `Rafael.paused` flag determines if this entire Rafael instance should be paused.
  */
  this.paused = false

  /*
    `Rafael.tasks` maintains a record of all currently running tasks
    associated with this instance of Rafael.
  */
  this.tasks = {}





  /*
    ## `new Rafael`

    Creating a new `Rafael` instance will kick off its loop and start to
    running tasks.
  */
  constructor () {
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
  schedule (id, task, options) {
    let framerate = null

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
  unschedule = function schedule (id) {
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
  clear () {
    if (this._debug) {
      console.log('Clearing tasks')
    }

    this.tasks = {}
  }





  /*
    ## `Rafael.pause(id)`

    TODO: Describe
  */
  pause (id) {
    if (this._debug) {
      console.log('Pausing', id || 'all tasks')
    }

    if (!id) {
      this.paused = true
    } else if (this.tasks[id]) {
      this.tasks[id].paused = true
    }
  }





  /*
    ## `Rafael.start(id)`

    TODO: Describe
  */
  start (id) {
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
  _taskCaller (taskObject) {
    taskObject.task.call(taskObject.context)
  }





  /*
    ## `Rafael._startLoop()`

    Start the loop `requestAnimationFrame` loop for this `Rafael`.
  */
  _startLoop = () => {
    const schedule = this
    const tasks = Object.keys(this.tasks)

    window.requestAnimationFrame(schedule._startLoop)

    if (!this.paused) {
      for (let i = 0; i < tasks.length; i++) {
        const task = this.tasks[tasks[i]]

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
  _shouldRun (framerate) {
    return !(Math.floor(this._frame % (60 / framerate)))
  }
}





export default Rafael
export { Rafael }
