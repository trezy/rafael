<p align="center">
  <img alt="Rafael" src="https://github.com/trezy/rafael-logo/raw/master/rafael.png" width="500">
</p>

<p align="center">
  [![Travis CI Build](https://img.shields.io/travis/trezy/rafael.svg?style=flat-square)]()
  [![npm](https://img.shields.io/npm/dt/rafael.svg?style=flat-square)]()
  [![Bower](https://img.shields.io/bower/v/rafael.svg?style=flat-square)]()
  [![Open Github Issues](https://img.shields.io/github/issues/trezy/rafael.svg?style=flat-square)]()
  [![Bower](https://img.shields.io/david/trezy/rafael.svg?style=flat-square)]()
</p>

Rafael.js is a simple client side rafael based on the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) loop. Typically you may use something like [`window.setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) or [`window.setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout) to achieve this.

However, `requestAnimationFrame` allows us to utilize the GPU, avoiding the performance bottlenecks of those other methods. `requestAnimationFrame` is intended to allow Javascript animations to utilize the computer's GPU so it can be handled at ~60fps (performance depends on the machine). Rafael just makes it easy to control multiple tasks running on the `requestAnimationFrame` loop.

**NOTE:** This plugin will make it really, *really*, ***really*** easy to bog down your app. Schedule with caution.

## Usage

Create a new instance of Rafael:

```javascript
var rafael = new Rafael;
```

Now let's schedule something:

```javascript
var foo = function () {
  console.log('Do a thing.');
};

rafael.schedule('foo', foo);
```

Then let's stop it:

```javascript
rafael.unschedule('foo');
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

rafael.schedule('foo', foo);
rafael.schedule('bar', bar);

setTimeout(function () {
  rafael.unschedule('foo');
}, 1000)
```

`Rafael` will be happy to run as many tasks as you want to give it.

## API

### `new Rafael`

Creates and returns a new instance of `Rafael`.

### `Rafael.schedule(taskId, task[, options])`

The `schedule()` method adds a task to the schedule, causing it to run on every iteration of the schedule loop. *Returns* the task's ID.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | A string used to manipulate the task within the context of the `Rafael`. If an ID is not passed then the task's ID will be it's index in `Rafael.tasks`. |
| `task` | required | The function to be run. |
| `options` | optional | This is a hash of options to be considered for the task. |

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `context` | Object | `window` | The value of `this` within the task |
| `framerate` | Number | `60` | The number of times the task should run per second. Max is 60. |
| `paused` | Boolean | `false` | Whether or not the task should start immediately. Tasks that receive `paused` can be kicked off with `Rafael.start`. |

### `Rafael.unschedule(taskId)`

The `unschedule()` method removes a task from the schedule and stops it from running. *Returns* a success boolean.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | required | The task to be removed from the schedule. This will completely remove the task from the `Rafael` so it cannot be restarted. |

### `Rafael.pause([taskId])`

The `pause()` method pauses a task without removing it from the schedule. The task can later be restarted with `start()`.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | The task to be paused. If no `taskId` is passed, the entire rafael will be paused. |

### `Rafael.start([taskId])`

The `start()` method restarts a paused task.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | The task to be started. If no `taskId` is passed, the entire rafael will be started. |

### `Rafael.clear()`

Removes all tasks from the rafael.
