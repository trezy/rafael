// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import {
	clear,
	pause,
	schedule,
	state,
	updateConfig,
} from '../lib/index.js'





describe('pause', function() {
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
		expect(pause).to.be.a('function')
	})

	it('pauses all tasks', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })

		Object.values(state.tasks).forEach(task => {
			// eslint-disable-next-line no-unused-expressions
			expect(task.isPaused).to.be.false
		})

		pause()

		Object.values(state.tasks).forEach(task => {
			// eslint-disable-next-line no-unused-expressions
			expect(task.isPaused).to.be.true
		})
	})

	it('pauses a single task', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.false

		pause('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.true
	})

	it('should not throw an error when pausing a task that does not exist', function() {
		expect(() => pause('foo')).to.not.throw(Error)
	})
})
