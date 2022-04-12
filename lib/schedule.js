// Local imports
import { createTask } from './createTask.js'
import { start } from './start.js'
import { state } from './state.js'





/**
 * Adds a task to the schedule, ensuring it is run on the `requestAnimationFrame` loop.
 *
 * @memberof module:Rafael
 * @param {Function} task The function to be run.
 * @param {object} [options] All options.
 * @param {*} [options.context = window] The context within which the function will run. If not set, the context will be `window`.
 * @param {number} [options.framerate = 60] The speed at which the task should be run in frames per second (fps).
 * @param {boolean} [options.isPaused = false] Whether this task should be running.
 * @param {string} [options.id] The ID you'll use to interact with this task later on. If an ID isn't set then it will be the index of the new task in `this.tasks`.
 * @returns {string} The ID of the created task.
 */
export function schedule(task, options = {}) {
	const {
		context = window,
		framerate = 60,
		isPaused = false,
		id: taskID = String(Object.keys(state.tasks).length),
	} = options

	if (framerate > 60) {
		throw new RangeError(`Framerate may not be higher than 60; requested framerate is ${framerate}.`)
	}

	if (state.tasks[taskID]) {
		throw new RangeError(`A task with the ID \`${taskID}\` already exists.`)
	}

	state.tasks[taskID] = createTask({
		context,
		isPaused,
		framerate,
		task,
	})

	start()

	return taskID
}
