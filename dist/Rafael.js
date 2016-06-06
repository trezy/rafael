(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('Rafael', ['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.Rafael = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var Rafael;

  Rafael = function Rafael() {
    this.paused = false;
    this.tasks = {};
    this._startLoop = this._startLoop.bind(this);
    this._startLoop();
  };

  Rafael.prototype.schedule = function schedule(id, task, options) {
    var framerate;

    if (typeof id !== 'string') {
      options = task;
      task = id;
      id = Object.keys(this.tasks).length;
    }

    options || (options = {});

    this._debug = options.debug || false;
    this._frame = 0;
    framerate = Math.ceil(options.framerate || 60);

    if (this._debug) {
      console.log('Scheduling task', id);
    }

    if (framerate > 60) {
      throw new RangeError('Framerate may not be higher than 60; Requested framerate is', framerate);
      return;
    }

    if (this.tasks[id]) {
      throw new RangeError('A task with the ID "' + id + '" already exists');
      return;
    }

    this.tasks[id] = {
      context: options.context || window,
      paused: options.paused || false,
      framerate: framerate,
      task: task
    };

    return id;
  };

  Rafael.prototype.unschedule = function schedule(id) {
    if (this._debug) {
      console.log('Unscheduling task', id);
    }

    delete this.tasks[id];
    return !this.tasks[id];
  };

  Rafael.prototype.clear = function schedule() {
    if (this._debug) {
      console.log('Clearing tasks');
    }

    this.tasks = {};
  };

  Rafael.prototype.pause = function pause(id) {
    if (this._debug) {
      console.log('Pausing', id || 'all tasks');
    }

    if (id) {
      this.tasks[id].paused = true;
    } else {
      this.paused = true;
    }
  };

  Rafael.prototype.start = function start(id) {
    if (this._debug) {
      console.log('Starting', id || 'all tasks');
    }

    if (id) {
      this.tasks[id].paused = false;
    } else {
      this.paused = false;
    }
  };

  Rafael.prototype._taskCaller = function _taskCaller(taskObject) {
    taskObject.task.call(taskObject.context);
  };

  Rafael.prototype._startLoop = function _startLoop() {
    var i, schedule, tasks;

    schedule = this;
    tasks = Object.keys(this.tasks);

    requestAnimationFrame(schedule._startLoop);

    if (!this.paused) {
      for (i = 0; i < tasks.length; i++) {
        var task;

        task = this.tasks[tasks[i]];

        if ((task['framerate'] === 60 || this._shouldRun(task['framerate'])) && !task.paused) {
          this._taskCaller(task);
        }
      }

      this._frame++;
    }
  };

  Rafael.prototype._shouldRun = function _shouldRun(framerate) {
    return !Math.floor(this._frame % (60 / framerate));
  };

  module.exports = Rafael;
});
//# sourceMappingURL=Rafael.js.map
