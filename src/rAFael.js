// Local imports
import { Task } from './Task.js'





/**
 * The main Rafael class.
 */
export class Rafael {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#frame = 0

	#isPaused = false

	#tasks = {}

	/**
	 * Starts the `requestAnimationFrame` loop.
	 */
	#loop = () => {
		if (!this.#isPaused) {
			const taskKeys = Object.values(this.#tasks)

			taskKeys.forEach(task => {
				const {
					framerate,
					isPaused,
				} = task

				if ((framerate === 60 || this.#shouldRunTask(task)) && !isPaused) {
					this.#taskCaller(task)
				}
			})

			this.#frame += 1
		}

		window.requestAnimationFrame(this.#loop)
	}





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Rafael instance.
	 *
	 * @param {object} [options] All options.
	 * @param {boolean} [options.startImmediately = true] Whether or not to start the `requestAnimationFrame` loop immediately upon creation of this instance.
	 */
	constructor(options = {}) {
		const {
			startImmediately = true,
		} = options

		if (startImmediately) {
			this.#loop()
		}
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Determines if a task should be run based on its framerate.
	 *
	 * @param {Task} task The task to be checked.
	 * @returns {boolean} Whether or not the task should be run.
	 */
	#shouldRunTask(task) {
		const { framerate } = task

		return !(Math.floor(this.#frame % (60 / framerate)))
	}

	/**
	 * Runs a task with the appropriate context
	 *
	 * @param {Task} config Configuration for the task being called.
	 */
	#taskCaller(config) {
		const {
			context,
			task,
		} = config

		task.call(context)
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Removes all tasks. We just overwrite the original dictionary since this is a destructive operation.
	 */
	clear() {
		this.#tasks = {}
	}

	/**
	 * Pauses this instance. Can also pause an individual task.
	 *
	 * @param {string} [taskID] The ID of the task to pause.
	 */
	pause(taskID) {
		// if (this._debug) {
		// 	console.log('Pausing', taskID || 'all tasks')
		// }

		if (!taskID) {
			this.#isPaused = true
		} else if (this.tasks[taskID]) {
			this.tasks[taskID].pause()
		}
	}

	/**
	 * Starts this instance. Can also start an individual task.
	 *
	 * @param {string} [taskID] The ID of the task to start.
	 */
	start(taskID) {
		// if (this._debug) {
		// 	console.log('Starting', id || 'all tasks')
		// }

		if (taskID) {
			this.tasks[taskID].start()
		} else {
			this.#isPaused = false
		}
	}

	/**
	 * Adds a task to the schedule, ensuring it is run on the `requestAnimationFrame` loop.
	 *
	 * @param {Function} task The function to be run.
	 * @param {object} [options] All options.
	 * @param {*} [options.context = window] The context within which the function will run. If not set, the context will be `window`.
	 * @param {number} [options.framerate = 60] The speed at which the task should be run in frames per second (fps).
	 * @param {boolean} [options.isPaused = false] Whether this task should be running.
	 * @param {string} [options.id] The ID you'll use to interact with this task later on. If an ID isn't set then it will be the index of the new task in `this.tasks`.
	 * @returns {string} The ID of the created task.
	 */
	schedule(task, options = {}) {
		const {
			context = window,
			framerate = 60,
			isPaused = false,
			id: taskID = String(Object.keys(this.tasks).length),
		} = options

		if (framerate > 60) {
			throw new RangeError(`Framerate may not be higher than 60; requested framerate is ${framerate}.`)
		}

		if (this.tasks[taskID]) {
			throw new RangeError(`A task with the ID \`${taskID}\` already exists.`)
		}

		this.#tasks[taskID] = new Task({
			context,
			isPaused,
			framerate,
			task,
		})

		return taskID
	}

	/**
	 * Removes a task from the schedule.
	 *
	 * @param {string} taskID The ID of the task to be removed from the schedule.
	 * @returns {boolean} Whether or not we successfully removed the task from the schedule.
	 */
	unschedule(taskID) {
		// if (this._debug) {
		// 	console.log('Unscheduling task', id)
		// }

		delete this.#tasks[taskID]
		return !this.#tasks[taskID]
	}





	/****************************************************************************\
	 * Public instance getters/setters
	\****************************************************************************/

	/**
	 * @returns {object} Whether or not this instance is currently running.
	 */
	get isPaused() {
		return this.#isPaused
	}

	/**
	 * @returns {object} A dictionary of the current tasks.
	 */
	get tasks() {
		return { ...this.#tasks }
	}
}
