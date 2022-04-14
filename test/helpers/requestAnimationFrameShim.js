let cancelledItems = []
let frame = 0
let queue = []
let time = 0





/**
 * Moves time forward by the specified number of frames.
 *
 * @param {number} frameCount A number of frames to move forward.
 */
export function advanceRequestAnimationFrameShim(frameCount) {
	let index = 0

	while (index < frameCount) {
		// Retrieve the current queue.
		const temporaryQueue = queue

		// Reset the queue before executing so that new items can be added to the queue.
		queue = []

		// Execute all items in the queue.
		temporaryQueue.forEach((fn, itemIndex) => {
			if (cancelledItems[itemIndex]) {
				return
			}

			fn(time)
		})

		// Update the shim's trackers
		cancelledItems = []
		frame += frameCount
		time = frame * (1000 / 60)

		// Advance the index
		index += 1
	}
}

/**
 * Shim for `cancelAnimationFrame`.
 *
 * @param {number} loopID The ID of the loop item to be cancelled.
 */
export function cancelAnimationFrame(loopID) {
	cancelledItems.push(loopID)
}

/**
 * Shim for `requestAnimationFrame`.
 *
 * @param {Function} item An item to be executed on the next frame.
 * @returns {number} The ID of this loop item.
 */
export function requestAnimationFrame(item) {
	const loopID = queue.length

	queue.push(item)

	return loopID
}

/**
 * Resets the current time and frames of the shim.
 */
export function resetRequestAnimationFrameShim() {
	cancelledItems = []
	frame = 0
	queue = []
	time = 0
}

/**
 * This static class is designed to replace `requestAnimationFrame` and `cancelAnimationFrame` for tests. It allows us to manipulate time and advance by any number of frames or milliseconds.
 */
export class RequestAnimationFrameShim {
	/**
	 * Moves time forward by the specified number of frames.
	 *
	 * @param {number} frameCount A number of frames to move forward.
	 */
	static advance(frameCount) {
		let index = 0

		while (index < frameCount) {
			// Retrieve the current queue.
			const temporaryQueue = queue

			// Reset the queue before executing so that new items can be added to the queue.
			queue = []

			// Execute all items in the queue.
			temporaryQueue.forEach((fn, itemIndex) => {
				if (cancelledItems[itemIndex]) {
					return
				}

				fn(time)
			})

			// Update the shim's trackers
			cancelledItems = []
			frame += frameCount
			time = frame * (1000 / 60)

			// Advance the index
			index += 1
		}
	}

	/**
	 * Shim for `cancelAnimationFrame`.
	 *
	 * @param {number} loopID The ID of the loop item to be cancelled.
	 */
	static cancelAnimationFrame(loopID) {
		cancelledItems.push(loopID)
	}

	/**
	 * Shim for `requestAnimationFrame`.
	 *
	 * @param {Function} item An item to be executed on the next frame.
	 * @returns {number} The ID of this loop item.
	 */
	static requestAnimationFrame(item) {
		const loopID = queue.length

		queue.push(item)

		return loopID
	}

	/**
	 * Resets the current time and frames of the shim.
	 */
	static reset() {
		cancelledItems = []
		frame = 0
		queue = []
		time = 0
	}
}
