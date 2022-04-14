// Module imports
import { expect } from 'chai'
import sinon from 'sinon'





// Local imports
import {
	clear,
	schedule,
	state,
	updateConfig,
} from '../lib/index.js'
import { requestAnimationFrame } from './helpers/requestAnimationFrameShim.js'





describe('clear', function() {
	before(function() {
		updateConfig({ requestAnimationFrame })
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
