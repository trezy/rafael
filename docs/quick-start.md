## Quick Start

### Requirements

* `npm` or Yarn

### Installation

```sh
npm install rafael

# OR

yarn add rafael
```

### Basic Setup

`Rafael` exports all of its methods individually, so we can import only what we need:

```javascript
import {
	schedule,
	unschedule,
} from 'rafael'

// A function to run on the requestAnimationFrame loop
function render() {}

// Schedule the task to be run by Rafael
schedule(render, { id: 'render' })

// Remove the task from Rafael's schedule after 5 seconds
setTimeout(() => {
	unschedule('render')
}, 5000)
```

Alternatively, we can import everything as a namespace:

```javascript
import * as Rafael from 'rafael'

function render() {}

Rafael.schedule(render, { id: 'render' })

setTimeout(() => {
	Rafael.unschedule('render')
}, 5000)
```

### Usage

`Rafael` is great for managing any number of tasks that need to run on the `requestAnimationFrame` loop. Scheduling a single task can be done with `schedule()`. If we're rendering a game to a canvas but we're not concerned about cleanup...

```javascript
import { schedule } from 'rafael'

// The main game loop
function gameLoop() {}

schedule(gameLoop)
```

Perhaps we want to break our `gameLoop` into multiple steps like updating our game engine, then updating our renderer...

```javascript
import { schedule } from 'rafael'
import {
	engine,
	renderer,
} from './game.js'

// This works because tasks are always run in the order they're added. Pausing/restarting a task does not affect the tasks place in the queue.
schedule(engine.update)
schedule(renderer.update)
```

Most games provide a pause functionality so the player can access menus or go grab their pizza rolls from the microwave. This is simple with `Rafael`'s `pause()` and `start()` methods:

```javascript
import {
	pause,
	schedule,
} from 'rafael'
import {
	engine,
	renderer,
} from './game.js'

schedule(engine.update)
schedule(renderer.update)

const pauseButton = document.querySelector('#pause-button')
const playButton = document.querySelector('#play-button')

pauseButton.addEventListener('click', pause)
playButton.addEventListener('click', start)
```

The previous example pauses all tasks, but what if we are also scheduling a task to render our UI, and we need to keep that running while the game is paused? `Rafael` allows pausing and restarting individual tasks using their IDs:

```javascript
import {
	pause,
	schedule,
} from 'rafael'
import {
	engine,
	renderer,
	ui,
} from './game.js'

const engineUpdateTaskID = schedule(engine.update)
const rendererUpdateTaskID = schedule(renderer.update)
const uiUpdateTaskID = schedule(ui.update)

const pauseButton = document.querySelector('#pause-button')
const playButton = document.querySelector('#play-button')

pauseButton.addEventListener('click', () => {
	pause(engineUpdateTaskID)
	pause(rendererUpdateTaskID)
})
playButton.addEventListener('click', () => {
	start(engineUpdateTaskID)
	start(rendererUpdateTaskID)
})
```

There are also several options that can be passed when scheduling a task. For example, we can define the ID to be used when creating a task. Note that `Rafael` will throw an error if we try to schedule a task with an ID that's already in use.

```javascript
import {
	pause,
	schedule,
} from 'rafael'
import {
	engine,
	renderer,
	ui,
} from './game.js'

schedule(engine.update, { id: 'update engine' })
schedule(renderer.update, { id: 'update renderer' })
schedule(ui.update, { id: 'update ui' })

const pauseButton = document.querySelector('#pause-button')
const playButton = document.querySelector('#play-button')

pauseButton.addEventListener('click', () => {
	pause('update engine')
	pause('update renderer')
})
playButton.addEventListener('click', () => {
	start('update engine')
	start('update renderer')
})
```

### Further Reading

For more information, check out our examples.

* [Creating tasks with options](./docs/example-creating-tasks-with-options.md)
* [Managing multiple tasks](./docs/example-managing-multiple-tasks.md)
