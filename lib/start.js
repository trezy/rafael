// Local imports
import { loop } from './loop.js'
import { state } from './state.js'





/**
 * Starts this instance. Can also start an individual task.
 *
 * @memberof module:Rafael
 * @param {string} [taskID] The ID of the task to start.
 */
export function start(taskID) {
	// if (this._debug) {
	// 	console.log('Starting', id || 'all tasks')
	// }

	if (taskID) {
		state.tasks[taskID].isPaused = false
	} else {
		Object.values(state.tasks).forEach(task => {
			task.isPaused = false
		})
	}

	if (!state.loopID) {
		loop()
	}
}
