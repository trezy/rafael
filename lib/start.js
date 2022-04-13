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
		state.tasks[taskID].isPaused = false
		taskCaller(state.tasks[taskID])
	} else {
		Object.values(state.tasks).forEach(task => {
			task.isPaused = false
		})
	}

	if (!state.loopID) {
		loop()
	}
}
