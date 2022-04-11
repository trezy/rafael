/**
 * A task to be run by Rafael.
 */
export class Task {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#isPaused = false

	#options = {}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new task.
	 *
	 * @param {object} options All options.
	 * @param {number} [options.framerate] The speed at which to run the task.
	 * @param {boolean} [options.isPaused] Whether or not this task is currently running.
	 * @param {*} [options.context] The context to be used when running the task.
	 * @param {Function} options.task The function to be run for this task.
	 */
	constructor(options) {
		const { isPaused } = options

		this.#isPaused = isPaused
		this.#options = options
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Pauses the task.
	 */
	pause() {
		this.#isPaused = true
	}

	/**
	 * Starts the task.
	 */
	start() {
		this.#isPaused = false
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {*} The context to be used when running the task.
	 */
	get context() {
		return this.#options.context
	}

	/**
	 * @returns {number} The speed at which to run the task.
	 */
	get framerate() {
		return this.#options.framerate
	}

	/**
	 * @returns {boolean} Whether or not this task is currently running.
	 */
	get isPaused() {
		return this.#isPaused
	}

	/**
	 * @returns {Function} The function to be run for this task.
	 */
	get task() {
		return this.#options.task
	}
}
