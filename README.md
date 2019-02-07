<p align="center">
  <img alt="rAFael" src="https://github.com/trezy/rafael-logo/raw/master/rafael.png" width="500">
</p>

<p align="center">
<!--  <img alt="Downloads" src="https://img.shields.io/npm/dt/rafael.svg?style=flat-square">-->
  <a href="https://www.npmjs.com/package/rafael"><img alt="npm" src="https://img.shields.io/npm/v/rafael.svg?style=flat-square"></a>
  <a href="http://bower.io/search/?q=rafael"><img alt="Bower" src="https://img.shields.io/bower/v/rafael.svg?style=flat-square"></a>
  <a href="https://github.com/trezy/rafael/issues"><img alt="Open Github Issues" src="https://img.shields.io/github/issues/trezy/rafael.svg?style=flat-square"></a>
  <a href="https://david-dm.org/trezy/rafael#info=devDependencies"><img alt="Dependencies" src="https://img.shields.io/david/dev/trezy/rafael.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/trezy/rafael"><img alt="Travis CI Build" src="https://img.shields.io/travis/trezy/rafael.svg?style=flat-square"></a>
</p>

rAFael.js is a simple client side rafael based on the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) loop. Typically you may use something like [`window.setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) or [`window.setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout) to achieve this.

However, `requestAnimationFrame` allows us to utilize the GPU, avoiding the performance bottlenecks of those other methods. `requestAnimationFrame` is intended to allow Javascript animations to utilize the computer's GPU so it can be handled at ~60fps (performance depends on the machine). rAFael just makes it easy to control multiple tasks running on the `requestAnimationFrame` loop.

**NOTE:** This plugin will make it really, *really*, ***really*** easy to bog down your app. Schedule with caution.

## Usage

Create a new instance of rAFael:

```javascript
var rafael = new rAFael;
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

`rAFael` will be happy to run as many tasks as you want to give it.

## API

### `new rAFael`

Creates and returns a new instance of `rAFael`.

### `rAFael.schedule(taskId, task[, options])`

The `schedule()` method adds a task to the schedule, causing it to run on every iteration of the schedule loop. *Returns* the task's ID.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | A string used to manipulate the task within the context of the `rAFael`. If an ID is not passed then the task's ID will be it's index in `rAFael.tasks`. |
| `task` | required | The function to be run. |
| `options` | optional | This is a hash of options to be considered for the task. |

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `context` | Object | `window` | The value of `this` within the task |
| `framerate` | Number | `60` | The number of times the task should run per second. Max is 60. |
| `paused` | Boolean | `false` | Whether or not the task should start immediately. Tasks that receive `paused` can be kicked off with `rAFael.start`. |

### `rAFael.unschedule(taskId)`

The `unschedule()` method removes a task from the schedule and stops it from running. *Returns* a success boolean.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | required | The task to be removed from the schedule. This will completely remove the task from the `rAFael` so it cannot be restarted. |

### `rAFael.pause([taskId])`

The `pause()` method pauses a task without removing it from the schedule. The task can later be restarted with `start()`.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | The task to be paused. If no `taskId` is passed, the entire rafael will be paused. |

### `rAFael.start([taskId])`

The `start()` method restarts a paused task.

| Parameter | Required/Optional | Description |
|---|---|---|
| `taskId` | optional | The task to be started. If no `taskId` is passed, the entire rafael will be started. |

### `rAFael.clear()`

Removes all tasks from the rafael.
