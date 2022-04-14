// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import {
	clear,
	schedule,
	state,
	updateConfig,
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
const FRAMERATES_TO_TEST = Array(59)
	.fill(null)
	.map((_, index) => index + 1)
const SUB_1FPS_FRAMERATES_TO_TEST = Array(9)
	.fill(null)
	.map((_, index) => (index + 1) / 10)





describe('schedule', function() {
	before(function() {
		// Run `jsdom` to get a fake `window`
		const { window } = new JSDOM('', {
			// This option ensures that the `window` object has `requestAnimationFrame`
			pretendToBeVisual: true,
		})

		// @ts-ignore
		this.clock = sinon.useFakeTimers({ global: window })

		updateConfig({
			cancelAnimationFrame: window.cancelAnimationFrame,
			requestAnimationFrame: window.requestAnimationFrame,
		})
	})

	after(function() {
		this.clock.restore()
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

		// eslint-disable-next-line no-unused-expressions
		expect(callback.callCount).to.equal(60)
	})

	it('executes a scheduled task immediately', function() {
		const callback = sinon.fake()

		schedule(callback, { framerate: 59 })

		// eslint-disable-next-line no-unused-expressions
		expect(callback.called).to.be.true
	})

	describe('non-default framerates', function() {
		describe('between 1fps and 60fps', function() {
			// eslint-disable-next-line mocha/no-setup-in-describe
			FRAMERATES_TO_TEST.forEach(framerate => {
				it(`executes a task ${framerate + 1} times in one second with a framerate of ${framerate}`, function() {
					const callback = sinon.fake()

					schedule(callback, { framerate })

					this.clock.tick(ONE_REQUEST_ANIMATION_FRAME_SECOND)

					expect(callback.callCount).to.equal(framerate + 1)
				})
			})
		})

		describe('less than 1fps', function() {
			// eslint-disable-next-line mocha/no-setup-in-describe
			SUB_1FPS_FRAMERATES_TO_TEST.forEach(framerate => {
				it(`executes a task twice within ${Math.ceil((ONE_REQUEST_ANIMATION_FRAME_SECOND / framerate) / 1000)} seconds with a framerate of ${framerate}`, function() {
					const callback = sinon.fake()

					schedule(callback, { framerate })

					this.clock.tick(ONE_REQUEST_ANIMATION_FRAME_SECOND / framerate)

					expect(callback.callCount).to.equal(2)
				})
			})
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

		this.clock.tick(16)

		expect(scope.secret).to.equal('bar')
	})
})
