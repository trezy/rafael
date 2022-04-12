/**
 * Maintains Rafael state as a singleton.
 *
 * @private
 * @property {number} frame The current frame of the loop.
 * @property {string} loopID The ID of the current loop. Used to stop the loop.
 * @property {object} tasks A dictionary of the currently tracked tasks.
 */
export const state = {
	frame: 0,
	loopID: null,
	tasks: {},
}
