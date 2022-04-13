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
		schedule(sinon.fake(), {
			id: 'foo',
			isPaused: true,
		})
		schedule(sinon.fake(), {
			id: 'bar',
			isPaused: true,
		})
		schedule(sinon.fake(), {
			id: 'baz',
			isPaused: true,
		})

		Object.values(state.tasks).forEach(task => {
			// eslint-disable-next-line no-unused-expressions
			expect(task.isPaused).to.be.true
		})

		start()

		Object.values(state.tasks).forEach(task => {
			// eslint-disable-next-line no-unused-expressions
			expect(task.isPaused).to.be.false
		})
	})

	it('should start a single task', function() {
		schedule(sinon.fake(), {
			id: 'foo',
			isPaused: true,
		})
		schedule(sinon.fake(), {
			id: 'bar',
			isPaused: true,
		})
		schedule(sinon.fake(), {
			id: 'baz',
			isPaused: true,
		})

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.true

		start('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.false
	})
})
