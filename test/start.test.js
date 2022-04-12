// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import {
	clear,
	pause,
	schedule,
	start,
	state,
} from '../lib/index.js'





describe('start', function() {
	before(function() {
		// Run `jsdom` to get a fake `window`
		const { window } = new JSDOM('', {
			// This option ensures that the `window` object has `requestAnimationFrame`
			pretendToBeVisual: true,
		})

		// @ts-ignore
		globalThis.window = window
	})

	after(function() {
		globalThis.window.close()
	})

	afterEach(function() {
		clear()
	})

	it('exists', function() {
		expect(start).to.be.a('function')
	})

	it('should start all tasks', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })
		schedule(sinon.fake(), { id: 'baz' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.isPaused).to.be.false

		pause()

		// eslint-disable-next-line no-unused-expressions
		expect(state.isPaused).to.be.true

		start()

		// eslint-disable-next-line no-unused-expressions
		expect(state.isPaused).to.be.false
	})

	it('should start a single task', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })
		schedule(sinon.fake(), { id: 'baz' })

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.false

		pause('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.true

		start('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.false
	})
})
