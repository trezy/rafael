// Local imports
import { Task } from './createTask.js'





/**
 * Runs a task with the appropriate context
 *
 * @private
 * @memberof module:Rafael
 * @param {Task} config Configuration for the task being called.
 */
export function taskCaller(config) {
	const {
		context,
		task,
	} = config

	if (context) {
		task.call(context)
	} else {
		task()
	}
}
