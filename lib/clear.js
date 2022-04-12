// Local imports
import { state } from './state.js'

/**
 * Removes all tasks. We just overwrite the original dictionary since this is a destructive operation.
 *
 * @memberof module:Rafael
 */
export function clear() {
	state.tasks = {}
}
