// Local imports
import { shouldRunTask } from './shouldRunTask.js'
import { state } from './state.js'
import { taskCaller } from './taskCaller.js'





/**
 * Runs the `requestAnimationFrame` loop.
 *
 * @private
 * @memberof module:Rafael
 */
export function loop() {
	if (!state.isPaused) {
		const taskKeys = Object.values(state.tasks)

		taskKeys.forEach(task => {
			const {
				framerate,
				isPaused,
			} = task

			if ((framerate === 60 || shouldRunTask(task)) && !isPaused) {
				taskCaller(task)
			}
		})

		state.frame += 1
	}

	state.loopID = window.requestAnimationFrame(loop)
}
