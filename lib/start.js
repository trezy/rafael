// Local imports
import { loop } from './loop.js'
import { state } from './state.js'
import { taskCaller } from './taskCaller.js'





/**
 * Starts this instance. Can also start an individual task.
 *
 * @memberof module:Rafael
 * @param {string} [taskID] The ID of the task to start.
 */
export function start(taskID) {
	if (taskID) {
		const task = state.tasks[taskID]
		task.isPaused = false

		if (task.framerate < 60) {
			taskCaller(task)
		}
	} else {
		Object.values(state.tasks).forEach(task => {
			task.isPaused = false
		})
	}

	if (!state.loopID) {
		loop()
	}
}
