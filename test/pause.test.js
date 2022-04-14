// Module imports
import { expect } from 'chai'
import sinon from 'sinon'





// Local imports
import {
	clear,
	pause,
	schedule,
	state,
	updateConfig,
} from '../lib/index.js'
import { requestAnimationFrame } from './helpers/requestAnimationFrameShim.js'





describe('pause', function() {
	before(function() {
		updateConfig({ requestAnimationFrame })
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
