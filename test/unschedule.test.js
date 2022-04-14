// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import {
	clear,
	schedule,
	state,
	unschedule,
	updateConfig,
} from '../lib/index.js'





describe('unschedule', function() {
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
		expect(unschedule).to.be.a('function')
	})

	it('unschedules a task', function() {
		schedule(sinon.fake(), { id: 'foo' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.with.all.keys('foo')

		unschedule('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.that.is.empty
	})

	it('stops the task runner if there are no tasks left', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.loopID).to.not.be.null
		expect(state.tasks).to.be.an('object')
			.with.keys('foo', 'bar')

		unschedule('foo')
		unschedule('bar')

		// eslint-disable-next-line no-unused-expressions
		expect(state.loopID).to.be.null
		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.that.is.empty
	})
})
