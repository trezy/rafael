// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import {
	clear,
	schedule,
	state,
} from '../lib/index.js'





// Constants
/**
 * Represents the delta between frames. It's set to 16 because Sinon's fake timers run `requestAnimationFrame` every 16ms, rather than 16.67ms.
 */
const REQUEST_ANIMATION_FRAME_DELTA = 16
/**
 * Similar to the constant above, this represents 60 frames (typically 1 second).
 */
const ONE_REQUEST_ANIMATION_FRAME_SECOND = REQUEST_ANIMATION_FRAME_DELTA * 60





describe('schedule', function() {
	before(function() {
		// Run `jsdom` to get a fake `window`
		const { window } = new JSDOM('', {
			// This option ensures that the `window` object has `requestAnimationFrame`
			pretendToBeVisual: true,
		})

		// @ts-ignore
		this.clock = sinon.useFakeTimers({ global: window })

		// @ts-ignore
		globalThis.window = window
	})

	after(function() {
		this.clock.restore()
		globalThis.window.close()
	})

	afterEach(function() {
		clear()
	})

	it('exists', function() {
		expect(schedule).to.be.a('function')
	})

	it('schedules a task', function() {
		const callback = sinon.fake()

		schedule(callback, { id: 'foo' })

		expect(Object.keys(state.tasks)).to.include('foo')
	})

	it('schedules multiple tasks', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })
		schedule(sinon.fake(), { id: 'baz' })

		expect(Object.keys(state.tasks)).to.have.lengthOf(3)
	})

	it('automatically generates IDs for tasks', function() {
		const expectedID = String(Object.keys(state.tasks).length)
		const actualID = schedule(sinon.fake())

		expect(actualID).to.equal(expectedID)
	})

	it('errors on duplicate IDs', function() {
		schedule(sinon.fake(), { id: 'foo' })

		// eslint-disable-next-line jsdoc/require-jsdoc
		function scheduleDuplicateTask() {
			schedule(sinon.fake(), { id: 'foo' })
		}

		expect(scheduleDuplicateTask).to.throw(RangeError)
	})

	it('executes tasks at 60fps', function() {
		const callback = sinon.fake()

		schedule(callback)

		this.clock.tick(ONE_REQUEST_ANIMATION_FRAME_SECOND)

		// We're looking for 61 instead of 60 because `schedule()` executes the task once as soon as its added to the schedule, then again every frame after.
		// eslint-disable-next-line no-unused-expressions
		expect(callback.callCount).to.equal(61)
	})

	it('executes a scheduled task immediately', function() {
		const callback = sinon.fake()

		schedule(callback)

		this.clock.tick(1)

		// eslint-disable-next-line no-unused-expressions
		expect(callback.called).to.be.true
	})

	describe('non-default framerates', function() {
		describe('between 1fps and 60fps', function() {
			let framerate = 1

			while (framerate < 60) {
				it(`executes a task ${framerate + 1} times per second with a framerate of ${framerate}fps`, function() {
					const callback = sinon.fake()
					schedule(callback, { framerate: framerate })

					this.clock.tick(ONE_REQUEST_ANIMATION_FRAME_SECOND)

					expect(callback.callCount).to.equal(framerate + 1)
				})

				framerate += 1
			}
		})

		describe('less than 1fps', function() {
			let framerate = 0.1

			while (framerate < 0.9) {
				const expectedCallCount = 2

				// eslint-disable-next-line mocha/no-setup-in-describe
				const roundedSeconds = Math.round((ONE_REQUEST_ANIMATION_FRAME_SECOND / framerate) / 1000)

				it(`executes a task ${expectedCallCount} times in ${roundedSeconds} seconds with a framerate of ${framerate}fps`, function() {
					const callback = sinon.fake()

					schedule(callback, { framerate: framerate })

					this.clock.tick(ONE_REQUEST_ANIMATION_FRAME_SECOND / framerate)

					expect(callback.callCount).to.equal(expectedCallCount)
				})

				// eslint-disable-next-line mocha/no-setup-in-describe
				framerate = ((framerate * 10) + (0.1 * 10)) / 10
			}
		})

		it('throws an error on framerates higher than 60', function() {
			const framerate = 61

			// eslint-disable-next-line jsdoc/require-jsdoc
			function scheduleWithExcessiveFramerate() {
				schedule(sinon.fake(), { framerate })
			}

			expect(scheduleWithExcessiveFramerate).to.throw(RangeError)
		})
	})

	it('executes a task with a given context', function() {
		const scope = {}

		//eslint-disable-next-line jsdoc/require-jsdoc
		function updateScopeSecret() {
			this.secret = 'bar'
		}

		schedule(updateScopeSecret, { context: scope })

		this.clock.tick(1)

		expect(scope.secret).to.equal('bar')
	})
})
