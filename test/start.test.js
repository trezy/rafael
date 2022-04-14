// Module imports
import { expect } from 'chai'
import sinon from 'sinon'





// Local imports
import {
	advanceRequestAnimationFrameShim,
	requestAnimationFrame,
} from './helpers/requestAnimationFrameShim.js'
import {
	clear,
	schedule,
	start,
	state,
	updateConfig,
} from '../lib/index.js'





describe('start', function() {
	before(function() {
		updateConfig({ requestAnimationFrame })
	})

	afterEach(function() {
		clear()
	})

	it('exists', function() {
		expect(start).to.be.a('function')
	})

	it('starts all tasks', function() {
		const callback1 = sinon.fake()
		const callback2 = sinon.fake()

		schedule(callback1, { isPaused: true })
		schedule(callback2, { isPaused: true })

		Object.values(state.tasks).forEach(task => {
			// eslint-disable-next-line no-unused-expressions
			expect(task.isPaused).to.be.true
		})

		advanceRequestAnimationFrameShim(59)

		// eslint-disable-next-line no-unused-expressions
		expect(callback1.called).to.be.false
		// eslint-disable-next-line no-unused-expressions
		expect(callback2.called).to.be.false

		start()

		advanceRequestAnimationFrameShim(59)

		// eslint-disable-next-line no-unused-expressions
		expect(callback1.called).to.be.true
		// eslint-disable-next-line no-unused-expressions
		expect(callback2.called).to.be.true

		Object.values(state.tasks).forEach(task => {
			// eslint-disable-next-line no-unused-expressions
			expect(task.isPaused).to.be.false
		})
	})

	it('starts a single task', function() {
		const callback1 = sinon.fake()
		const callback2 = sinon.fake()

		schedule(callback1, {
			id: 'foo',
			isPaused: true,
		})
		schedule(callback2, {
			id: 'bar',
			isPaused: true,
		})

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.true
		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['bar'].isPaused).to.be.true

		advanceRequestAnimationFrameShim(59)

		// eslint-disable-next-line no-unused-expressions
		expect(callback1.called).to.be.false
		// eslint-disable-next-line no-unused-expressions
		expect(callback2.called).to.be.false

		start('foo')

		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['foo'].isPaused).to.be.false
		// eslint-disable-next-line no-unused-expressions
		expect(state.tasks['bar'].isPaused).to.be.true

		advanceRequestAnimationFrameShim(59)

		// eslint-disable-next-line no-unused-expressions
		expect(callback1.called).to.be.true
		// eslint-disable-next-line no-unused-expressions
		expect(callback2.called).to.be.false
	})
})
