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
		expect(unschedule).to.be.a('function')
	})

	it('should unschedule a task', function() {
		schedule(sinon.fake(), { id: 'foo' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.with.all.keys('foo')

		unschedule('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.that.is.empty
	})

	it('should stop the task runner if there are no tasks left', function() {
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
