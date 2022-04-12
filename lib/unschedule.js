// Local imports
import { state } from './state.js'
import { stop } from './stop.js'





/**
 * Removes a task from the schedule.
 *
 * @memberof module:Rafael
 * @param {string} taskID The ID of the task to be removed from the schedule.
 * @returns {boolean} Whether or not we successfully removed the task from the schedule.
 */
export function unschedule(taskID) {
	// if (this._debug) {
	// 	console.log('Unscheduling task', id)
	// }

	delete state.tasks[taskID]

	if (Object.keys(state.tasks).length === 0) {
		stop()
	}

	return !state.tasks[taskID]
}
