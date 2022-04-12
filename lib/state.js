/**
 * Maintains Rafael state as a singleton.
 *
 * @private
 * @property {number} frame The current frame of the loop.
 * @property {boolean} isPaused Whether or not the loop is currently paused.
 * @property {string} loopID The ID of the current loop. Used to stop the loop.
 * @property {object} tasks A dictionary of the currently tracked tasks.
 */
export const state = {
	frame: 0,
	isPaused: false,
	loopID: null,
	tasks: {},
}
