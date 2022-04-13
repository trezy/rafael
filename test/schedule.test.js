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





describe('schedule', function() {
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
		expect(schedule).to.be.a('function')
	})

	it('should schedule a task', function(done) {
		let isDone = false

		schedule(() => {
			if (!isDone) {
				isDone = true
				clear()
				done()
			}
		}, { id: 'foo' })
	})

	it('should schedule a task even without an ID', function() {
		const expectedID = String(Object.keys(state.tasks).length)

		expect(schedule(sinon.fake(), { isPaused: true })).to.be.equal(expectedID)
	})

	it('should error on duplicate IDs', function() {
		schedule(sinon.fake(), { id: 'foo' })

		expect(() => schedule(sinon.fake(), { id: 'foo' })).to.throw(RangeError)
	})

	it('should schedule multiple tasks', function() {
		schedule(sinon.fake(), { id: 'foo' })
		schedule(sinon.fake(), { id: 'bar' })
		schedule(sinon.fake(), { id: 'baz' })

		expect(Object.keys(state.tasks)).to.have.lengthOf(3)

		clear()
	})

	it('should schedule a task with a framerate between 1 and 60', function(done) {
		const framerate = 30
		let count = 0

		schedule(function() {
			count += 1
		}, {
			framerate,
			id: 'foo',
		})

		setTimeout(() => {
			clear()
			expect(count).to.be.closeTo(framerate, 5)
			done()
		}, 1000)
	})

	it('should schedule a task with a framerate lower than 1', function(done) {
		this.timeout(4600)

		const framerate = 0.5
		let count = 0

		schedule(function() {
			count += 1
		}, {
			framerate,
			id: 'foo',
		})

		setTimeout(() => {
			clear()
			expect(count).to.be.within(2, 3)
			done()
		}, 4000)
	})

	it('should error on framerates higher than 60', function() {
		const framerate = 61

		expect(() => {
			schedule(sinon.fake(), {
				framerate,
				id: 'foo',
			})
		}).to.throw(RangeError)
	})

	it('should execute a task within a given context', function(done) {
		const scope = {}
		let isDone = false

		// eslint-disable-next-line
		function then() {
			expect(scope.secret).to.equal('bar')
			done()
		}

		schedule(function() {
			if (!isDone) {
				clear()
				isDone = true
				this.secret = 'bar'
				then()
			}
		}, {
			context: scope,
			id: 'foo',
		})
	})
})
