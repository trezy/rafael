# Scheduler.js

Scheduler.js is a simple client side scheduler based on the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) loop. Typically you may use something like [`window.setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) or [`window.setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout) to achieve this.

However, `requestAnimationFrame` allows us to utilize the GPU, avoiding the performance bottlenecks of those other methods. `requestAnimationFrame` is intended to allow Javascript animations to utilize the computer's GPU so it can be handled at ~60fps (performance depends on the machine). Scheduler just makes it easy to control multiple tasks running on the `requestAnimationFrame` loop.

**NOTE:** This plugin will make it really, *really*, ***really*** easy to bog down your app. Schedule with caution.

## Usage

Create a new instance of Scheduler:

```javascript
var scheduler = new Scheduler;
```

Now let's schedule something:

```javascript
var foo = function () {
  console.log('Do a thing.');
};

scheduler.schedule('foo', foo);
```

Then let's stop it:

```javascript
scheduler.unschedule('foo');
```

Boom. Now let's get crazy:
```javascript
var fooCounter = 0;
var barCounter = 0;

var foo = function () {
  console.log('foo has run ' + fooCounter + ' times.');
  fooCounter++;
};

var bar = function () {
  console.log('bar has run ' + barCounter + ' times.');
  barCounter++;
};

scheduler.schedule('foo', foo);
scheduler.schedule('bar', bar);

setTimeout(function () {
  scheduler.unschedule('foo');
}, 1000)
```

`Scheduler` will be happy to run as many tasks as you want to give it.

## API

### `new Scheduler`

Creates and returns a new instance of `Scheduler`.

### `Scheduler.schedule(taskId, task[, context])`

The `schedule()` method adds a task to the schedule, causing it to run on every iteration of the schedule loop. *Returns* the task's ID.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | A string used to manipulate the task within the context of the `Scheduler`. If an ID is not passed then the task's ID will be it's index in `Scheduler.tasks`. |
| `task` | required | The function to be run. |
| `context` | optional | A value to be used for `this` inside the task. |

### `Scheduler.unschedule(taskId)`

The `unschedule()` method removes a task from the schedule and stops it from running. *Returns* a success boolean.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | required | The task to be removed from the schedule. This will completely remove the task from the `Scheduler` so it cannot be restarted. |

### `Scheduler.pause([taskId])`

The `pause()` method pauses a task without removing it from the schedule. The task can later be restarted with `start()`.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | The task to be paused. If no `taskId` is passed, the entire scheduler will be paused. |

### `Scheduler.start([taskId])`

The `start()` method restarts a paused task.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | The task to be started. If no `taskId` is passed, the entire scheduler will be started. |

### `Scheduler.clear()`

Removes all tasks from the scheduler.
