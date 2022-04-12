// Local imports
import { state } from './state.js'





/**
 * Pauses this instance. Can also pause an individual task.
 *
 * @memberof module:Rafael
 * @param {string} [taskID] The ID of the task to pause.
 */
export function pause(taskID) {
	// if (this._debug) {
	// 	console.log('Pausing', taskID || 'all tasks')
	// }

	if (!taskID) {
		state.isPaused = true
	} else if (state.tasks[taskID]) {
		state.tasks[taskID].isPaused = true
	}
}
