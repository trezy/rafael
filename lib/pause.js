// Local imports
import { state } from './state.js'





/**
 * Pauses this instance. Can also pause an individual task.
 *
 * @memberof module:Rafael
 * @param {string} [taskID] The ID of the task to pause.
 */
export function pause(taskID) {
	if (!taskID) {
		Object.values(state.tasks).forEach(task => {
			task.isPaused = true
		})
	} else if (state.tasks[taskID]) {
		state.tasks[taskID].isPaused = true
	}
}
