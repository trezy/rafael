// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import * as Rafael from '../lib/index.js'





describe('Rafael', function() {
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
		Rafael.clear()
	})

	describe('.clear()', function() {
		it('exists', function() {
			expect(Rafael.clear).to.be.a('function')
		})

		it('should clear all tasks', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks).to.be.an('object')

			// eslint-disable-next-line no-unused-expressions
			expect(Object.keys(Rafael.state.tasks)).to.have.lengthOf(3)

			Rafael.clear()

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks).to.be.an('object').that.is.empty
		})
	})

	describe('.pause()', function() {
		it('exists`', function() {
			expect(Rafael.pause).to.be.a('function')
		})

		it('should pause all tasks', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })
			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.isPaused).to.be.false

			Rafael.pause()

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.isPaused).to.be.true
		})

		it('should pause a single task', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks['foo'].isPaused).to.be.false

			Rafael.pause('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks['foo'].isPaused).to.be.true
		})

		it('should not throw an error when pausing a task that does not exist', function() {
			expect(() => Rafael.pause('foo')).to.not.throw(Error)
		})
	})

	describe('.schedule()', function() {
		it('exists', function() {
			expect(Rafael.schedule).to.be.a('function')
		})

		it('should schedule a task', function(done) {
			let isDone = false

			Rafael.schedule(() => {
				if (!isDone) {
					isDone = true
					done()
				}
			}, { id: 'foo' })
		})

		it('should schedule a task even without an ID', function() {
			const expectedID = String(Object.keys(Rafael.state.tasks).length)

			expect(Rafael.schedule(sinon.fake())).to.be.equal(expectedID)
		})

		it('should error on duplicate IDs', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })

			expect(() => Rafael.schedule(sinon.fake(), { id: 'foo' })).to.throw(RangeError)
		})

		it('should schedule multiple tasks', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			expect(Object.keys(Rafael.state.tasks)).to.have.lengthOf(3)
		})

		it('should schedule a task with a framerate between 1 and 60', function(done) {
			const framerate = 30
			let count = 0

			Rafael.schedule(function() {
				count += 1
			}, {
				framerate,
				id: 'foo',
			})

			setTimeout(() => {
				Rafael.unschedule('foo')
				expect(count).to.be.closeTo(framerate, 5)
				done()
			}, 1000)
		})

		it('should schedule a task with a framerate lower than 1', function(done) {
			this.timeout(4600)

			const framerate = 0.5
			let count = 0

			Rafael.schedule(function() {
				count += 1
			}, {
				framerate,
				id: 'foo',
			})

			setTimeout(() => {
				Rafael.unschedule('foo')
				expect(count).to.equal(2)
				done()
			}, 4000)
		})

		it('should error on framerates higher than 60', function() {
			const framerate = 61

			expect(() => {
				Rafael.schedule(sinon.fake(), {
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

			Rafael.schedule(function() {
				if (!isDone) {
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

	describe('.start()', function() {
		it('exists', function() {
			expect(Rafael.start).to.be.a('function')
		})

		it('should start all tasks', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.isPaused).to.be.false

			Rafael.pause()

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.isPaused).to.be.true

			Rafael.start()

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.isPaused).to.be.false
		})

		it('should start a single task', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks['foo'].isPaused).to.be.false

			Rafael.pause('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks['foo'].isPaused).to.be.true

			Rafael.start('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks['foo'].isPaused).to.be.false
		})
	})

	describe('.stop()', function() {
		it('exists', function() {
			expect(Rafael.stop).to.be.a('function')
		})

		it('should stop all tasks', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks).to.be.an('object')

			// eslint-disable-next-line no-unused-expressions
			expect(Object.keys(Rafael.state.tasks)).to.have.lengthOf(3)

			Rafael.stop()

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.frame).to.equal(0)

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.isPaused).to.be.false

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.loopID).to.be.null

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks).to.be.an('object').that.is.empty
		})
	})

	describe('.unschedule()', function() {
		it('exists', function() {
			expect(Rafael.unschedule).to.be.a('function')
		})

		it('should unschedule a task', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })

			// eslint-disable-next-line no-unused-expressions
			expect(Object.keys(Rafael.state.tasks)).to.have.lengthOf(1)

			Rafael.unschedule('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.tasks).to.be.an('object').that.is.empty
		})

		it('should stop the task runner if there are no tasks left', function() {
			Rafael.schedule(sinon.fake(), { id: 'foo' })
			Rafael.schedule(sinon.fake(), { id: 'bar' })
			Rafael.schedule(sinon.fake(), { id: 'baz' })

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.loopID).to.not.be.null

			Rafael.unschedule('foo')
			Rafael.unschedule('bar')
			Rafael.unschedule('baz')

			// eslint-disable-next-line no-unused-expressions
			expect(Rafael.state.loopID).to.be.null
		})
	})
})
