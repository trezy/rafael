// Local imports
import { state } from './state.js'
import { Task } from './createTask.js'





/**
 * Determines if a task should be run based on its framerate.
 *
 * @private
 * @memberof module:Rafael
 * @param {Task} task The task to be checked.
 * @returns {boolean} Whether or not the task should be run.
 */
export function shouldRunTask(task) {
	const { framerate } = task

	return !(Math.floor(state.frame % (60 / framerate)))
}
