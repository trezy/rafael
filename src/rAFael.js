/*
  # rAFael

  */
 class rAFael {
  /*
    The `rAFael.paused` flag determines if this entire rAFael instance should be paused.
  */
  this.paused = false

  /*
    `rAFael.tasks` maintains a record of all currently running tasks
    associated with this instance of rAFael.
  */
  this.tasks = {}





  /*
    ## `new rAFael`

    Creating a new `rAFael` instance will kick off its loop and start to
    running tasks.
  */
  constructor () {
    this._startLoop()
  }





  /*
    ## `rAFael.schedule(taskId, task, options)`

    Schedule a task to be run in our loop. It takes up to three arguments:
    `taskId`, `task`, and `options`.

    * `taskId` (optional) represents the ID you'll use to interact with this task
    later on. If an ID isn't set then it will be the index of the new task in
    `this.tasks`.

    * `task` (required) is the function to be run on this `rAFael`.

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
    ## `rAFael.unschedule(id)`

    Remove a task from our loop. `id` is ID of the task to be removed from this `rAFael`.
  */
  unschedule = function schedule (id) {
    if (this._debug) {
      console.log('Unscheduling task', id)
    }

    delete this.tasks[id]
    return !this.tasks[id]
  }





  /*
    ## `rAFael.clear()`

    Remove all tasks from the `rAFael`. We just overwrite the original array
    since this is a destructive operation.
  */
  clear () {
    if (this._debug) {
      console.log('Clearing tasks')
    }

    this.tasks = {}
  }





  /*
    ## `rAFael.pause(id)`

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
    ## `rAFael.start(id)`

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
    ## `rAFael._taskCaller(taskObject)`

    Start the loop `requestAnimationFrame` loop for this `rAFael`.
  */
  _taskCaller (taskObject) {
    taskObject.task.call(taskObject.context)
  }





  /*
    ## `rAFael._startLoop()`

    Start the loop `requestAnimationFrame` loop for this `rAFael`.
  */
  _startLoop = () => {
    const schedule = this

    if (!this.paused) {
      for (const [taskName, task] of Object.entries(this.tasks)) {
        const task = this.tasks[tasks[i]]

        if ((task['framerate'] === 60 || this._shouldRun(task['framerate'])) && !task.paused) {
          this._taskCaller(task)
        }
      }

      this._frame++
    }

    window.requestAnimationFrame(schedule._startLoop)
  }





  /*
    ## `rAFael._shouldRun()`

    Compares the passed in framerate against the current frame to determine if the
    task should run on this frame
  */
  _shouldRun (framerate) {
    return !(Math.floor(this._frame % (60 / framerate)))
  }
}





export default rAFael
export { rAFael }
