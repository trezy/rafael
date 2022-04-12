/**
 * @memberof module:Rafael
 * @property {number} framerate The speed at which to run the task.
 * @property {boolean} isPaused Whether or not this task is currently running.
 * @property {*} [context] The context to be used when running the task.
 * @property {Function} task The function to be run for this task.
 */
export const Task = {}

/**
 * Creates a new task.
 *
 * @private
 * @memberof module:Rafael
 * @param {object} options All options.
 * @param {number} [options.framerate = 60] The speed at which to run the task.
 * @param {boolean} [options.isPaused = false] Whether or not this task is currently running.
 * @param {*} [options.context] The context to be used when running the task.
 * @param {Function} options.task The function to be run for this task.
 * @returns {Task} The created task object.
 */
export function createTask(options) {
	const {
		context = window,
		framerate = 60,
		isPaused = false,
		task,
	} = options

	return {
		context,
		framerate,
		isPaused,
		task,
	}
}
