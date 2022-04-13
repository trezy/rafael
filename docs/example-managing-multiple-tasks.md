## Managing multiple tasks

While `Rafael` is fine for scheduling a single task, where it really shines is allowing us to manage multiple tasks at once. One of the best examples of this is creating a video game.

Let's assume we're building our game from scratch. We've created a `controls` component that updates the player's position based on the state of their controls, an `engine` component that handles updating all of the internals (like AI and physics), and a `renderer` component that renders the game based on the state of `engine`. Each of these components are updated with an `update` method. Setting this up with `Rafael` is relatively simple:

```javascript
import { schedule } from 'rafael'
import {
	controls,
	engine,
	renderer,
} from './game.js'

schedule(controls.update)
schedule(engine.update)
schedule(renderer.update)
```

Now let's assume that we've added a `ui` component. Since we always want `ui` to update after the `engine`, we want to create all of our tasks immediately. However, we only want the `ui` component to start. To accomplish this, we'll schedule all of our tasks, but we'll create `controls`, `engine`, and `renderer` in a paused state.

```javascript
import { schedule } from 'rafael'
import {
	controls,
	engine,
	renderer,
	ui,
} from './game.js'

schedule(controls.update, { isPaused: true })
schedule(engine.update, { isPaused: true })
schedule(renderer.update, { isPaused: true })
schedule(ui.update)
```

Excellent! Not the player can use the menus and such, but we're not wasting cycles updating and rendering a game that's not actually running. Now let's add a `Play` button and `start()` the rest of the tasks when it's clicked.

```javascript
import {
	schedule,
	start,
} from 'rafael'
import {
	controls,
	engine,
	renderer,
	ui,
} from './game.js'

const playButton = document.querySelector('#play-button')

const controlsTaskID = schedule(controls.update, { isPaused: true })
const engineTaskID = schedule(engine.update, { isPaused: true })
const rendererTaskID = schedule(renderer.update, { isPaused: true })
schedule(ui.update)

playButton.addEventlistener('click', () => {
	start(controlsTaskID)
	start(engineTaskID)
	start(rendererTaskID)
})
```

Looking good! Finally, let's add support for a pause menu. We'll want to pause the `controls` and `engine` components, but leave the `renderer` and `ui` components running so that we can see the paused game behind the pause menu.

```javascript
import {
	pause,
	schedule,
	start,
} from 'rafael'
import {
	controls,
	engine,
	renderer,
	ui,
} from './game.js'

const pauseButton = document.querySelector('#pause-button')
const playButton = document.querySelector('#play-button')

const controlsTaskID = schedule(controls.update, { isPaused: true })
const engineTaskID = schedule(engine.update, { isPaused: true })
const rendererTaskID = schedule(renderer.update, { isPaused: true })
schedule(ui.update)

// We're assuming the `playButton` exists in both the main menu and the pause menu, so we can use the same click event listener.
playButton.addEventlistener('click', () => {
	start(controlsTaskID)
	start(engineTaskID)

	// Calling `start()` on a task that's already running has no effect, so it's safe to leave this for the pause menu.
	start(rendererTaskID)
})

pauseButton.addEventlistener('click', () => {
	pause(controlsTaskID)
	pause(engineTaskID)
})
```
