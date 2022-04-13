// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import {
	clear,
	schedule,
	state,
	stop,
} from '../lib/index.js'





describe('stop', function() {
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
		expect(stop).to.be.a('function')
	})

	it('should stop all tasks', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.with.keys('foo', 'bar')

		stop()

		// eslint-disable-next-line no-unused-expressions
		expect(state.frame).to.equal(0)

		// eslint-disable-next-line no-unused-expressions
		expect(state.loopID).to.be.null

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.that.is.empty
	})
})
