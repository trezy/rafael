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





describe('clear', function() {
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
		expect(clear).to.be.a('function')
	})

	it('clears all tasks', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })

		expect(state.tasks).to.be.an('object')
			.with.keys('foo', 'bar')

		clear()

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks).to.be.an('object')
			.that.is.empty
	})
})
