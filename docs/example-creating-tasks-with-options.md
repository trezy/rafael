## Creating tasks with options

When scheduling tasks, they can be passed several options that affect the way they operate.

### Identifying tasks

When using `schedule()`, the scheduled task is always assigned an ID. This ID is also returned from the `schedule()` method. This ID can then be used to pause or delete the task later.

```javascript
import {
	schedule,
	unschedule,
} from 'rafael'

function someTask() {}

// A task ID is returned from the `schedule()` method.
const taskID = schedule(someTask)

// When the task is no longer needed, it can be deleted with the `unschedule()` method.
unschedule(taskID)
```

As an alternative, we can define the ID for a task when scheduling it. This can be useful if we need to handle tasks from different parts of our application, as they don't need to track the auto-generated ID of the task. The one caveat to this is that scheduling a task with an ID that's already in use **will throw an error**; this will never happen with auto-generated IDs.

```javascript
import {
	schedule,
	unschedule,
} from 'rafael'

// Create a dictionary of names for individual tasks.
const TASK_NAMES = {
	engine: 'engine',
	renderer: 'renderer',
	ui: 'ui',
}

function someTask() {}

schedule(engine.update, { id: TASK_NAMES.engine })
schedule(renderer.update, { id: TASK_NAMES.renderer })

unschedule(engine.update, { id: TASK_NAMES.engine })
```

### Passing context

Some functions need to be run within a certain context. If we're using a class method that needs to access instance properties, we'll get an error if we try to pass the method to `Rafael` directly. To remedy this issue, we can pass a `context` when scheduling the task.

```javascript
import { schedule } from 'rafael'

class Counter() {
	value = 0

	increment() {
		this.value += 1
	}
}

const counter = new Counter()

const taskID = schedule(counter.increment, {
	context: counter,
})
```

### Alternative framerates

By default, `requestAnimationFrame` — and, subsequently, `Rafael` — runs at 60 frames per second on most machines. This is fine for most implementations, but there are times that we need to run our tasks at a slower framerate. For example, a video player that plays videos at their original framerate may need to run at 24 or 30 frames per second, or a GIF viewer may need to display 10-15 frames per second. To handle these scenarios, `Rafael` tasks can receive the `framerate` option.

```javascript
import { schedule } from 'rafael'
import { GIF } from './GIF.js'

const gif = new GIF({
	framerate: 10,
	src: '/gifs/example-{frame}.png',
})

const taskID = schedule(gif.update, {
	framerate: gif.framerate,
})
```

### Creating paused tasks

Sometimes we need to create a task, but we don't want to start it immediately. Say, for example, that we're creating a game. We want to queue up all of our update tasks when the game is loading, but we don't want them to start until the player clicks the `Play` button. We can accomplish this with the `isPaused` option.

```javascript
import {
	schedule,
	start,
} from 'rafael'
import {
	engine,
	renderer,
	ui,
} from './game.js'

// Schedule the engine and renderer updates, but don't start them immediately.
schedule(engine.update, {
	id: 'engine',
	isPaused: true,
})
schedule(renderer.update, {
	id: 'renderer',
	isPaused: true,
})

// Schedule the UI update and allow it to kick off immediately so that the menus will work.
schedule(ui.update, { id: 'ui' })

// Start the engine and renderer updates as soon as the player clicks the play button.
ui.playButton.addEventListener('click', () => {
	start('engine')
	start('renderer')
})
```

### Updating a task's options

There's no way to alter the options of a running task. We can, however, reschedule the task with new options.

```javascript
import {
	schedule,
	unschedule,
} from 'rafael'

const defaultTaskOptions = { framerate: 30 }

let taskID = null

function someTask() {}

function updateTaskOptions(options) {
	unschedule(taskID)
	taskID = schedule(someTask, {
		...defaultTaskOptions,
		...options,
	})
}

taskID = schedule(someTask, defaultTaskOptions)

```
