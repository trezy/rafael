// Local imports
import {
	createTask,
	Task,
} from './createTask.js'
import { start } from './start.js'
import { state } from './state.js'





/**
 * Adds a task to the schedule, ensuring it is run on the `requestAnimationFrame` loop.
 *
 * @memberof module:Rafael
 * @param {Function} task The function to be run.
 * @param {Task} [options] All options.
 * @returns {string} The ID of the created task.
 */
export function schedule(task, options = {}) {
	const {
		context,
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

	if (!isPaused) {
		start(taskID)
	}

	return taskID
}
