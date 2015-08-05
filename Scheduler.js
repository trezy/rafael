/*
# Scheduler v1.0.0
*/
var Scheduler;





/*
  ## `new Scheduler`

  `Scheduler.tasks` maintains a record of all currently running tasks
  associated with this scheduler.

  This will kick off the `Scheduler`'s loop to constantly run tasks.
*/
Scheduler = function Scheduler () {
  this.tasks = [];
  this._startLoop();

  return true;
}





/*
  ## `Scheduler.schedule( taskId, task, context )`

  Schedule a task to be run in our loop. It takes up to three arguments:
  `taskId`, `task`, and `context`.

  * `taskId` (optional) represents the ID you'll use to interact with this task
  later on. If an ID isn't set then it will be the index of the new task in
  `this.tasks`.

  * `task` (required) is the function to be run on this `Scheduler`.

  * `context` (optional) is the value of `this` within the function. If not
  set, the context will be `window`.
*/
Scheduler.prototype.schedule = function schedule () {
  var context, id, task;

  if ( typeof arguments[0] === 'string' ) {
    id = arguments[0];
    task = arguments[1];
    context = arguments[2] || window;

  } else {
    id = this.tasks.length;
    task = arguments[0];
    context = arguments[1] || window;
  }

  this.tasks.push({
    id: id,
    context: context,
    task: task
  });

  return id;
}





/*
  ## `Scheduler.unschedule( id )`

  Remove a task from our loop. `id` is ID of the task to be removed from this `Scheduler`.
*/
Scheduler.prototype.unschedule = function schedule ( id ) {
  var newTaskList, oldTaskList;

  newTaskList = [];
  oldTaskList = this.tasks;

  oldTaskList.forEach( function ( task ) {
    if ( task.id !== id ) {
      newTaskList.push( task );
    }
  });

  this.tasks = newTaskList;

  return !this.tasks[id];
}





/*
  ## `Scheduler.clear()`

  Remove all tasks from the `Scheduler`. We just overwrite the original array
  since this is a destructive operation.
*/
Scheduler.prototype.clear = function schedule () {
  if ( this.tasks.length ) {
    this.tasks = [];
  }

  return true;
}





/*
  ## `Scheduler._startLoop()`

  Start the loop `requestAnimationFrame` loop for this `Scheduler`.
*/
Scheduler.prototype._startLoop = function _startLoop () {
  var schedule;

  schedule = this;

  requestAnimationFrame( function () {
    schedule._startLoop()
  });

  schedule.tasks.forEach( function ( taskObject ) {
    taskObject.task.call( taskObject.context );
  });
}
