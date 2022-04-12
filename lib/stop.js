// Local imports
import { clear } from './clear.js'
import { state } from './state.js'





/**
 * Stops this instance.
 *
 * @memberof module:Rafael
 */
export function stop() {
	state.frame = 0
	state.isPaused = false

	clear()

	if (state.loopID) {
		window.cancelAnimationFrame(state.loopID)
		state.loopID = null
	}
}
