// Module imports
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import sinon from 'sinon'





// Local imports
import { Rafael } from '../src/index.js'





describe('Rafael', function() {
	before(function() {
		// Run `jsdom` to get a fake `window`
		const { window } = new JSDOM('', {
			// This option ensures that the `window` object has `requestAnimationFrame`
			pretendToBeVisual: true,
		})

		// @ts-ignore
		globalThis.window = window

		this.rafael = new Rafael
	})

	after(function() {
		globalThis.window.close()
	})

	beforeEach(function() {
		this.rafael = new Rafael
	})

	afterEach(function() {
		this.rafael.clear()
		delete this.rafael
	})

	describe('.clear()', function() {
		it('exists', function() {
			expect(this.rafael.clear).to.be.a('function')
		})

		it('should clear all tasks', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.schedule(sinon.fake(), { id: 'bar' })
			this.rafael.schedule(sinon.fake(), { id: 'baz' })
			this.rafael.clear()

			// eslint-disable-next-line no-unused-expressions
			expect(this.rafael.tasks).to.be.an('object').that.is.empty
		})
	})

	describe('.pause()', function() {
		it('exists`', function() {
			expect(this.rafael.pause).to.be.a('function')
		})

		it('should pause all tasks', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.schedule(sinon.fake(), { id: 'bar' })
			this.rafael.schedule(sinon.fake(), { id: 'baz' })
			this.rafael.pause()

			// eslint-disable-next-line no-unused-expressions
			expect(this.rafael.isPaused).to.be.true
		})

		it('should pause a single task', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.schedule(sinon.fake(), { id: 'bar' })
			this.rafael.schedule(sinon.fake(), { id: 'baz' })
			this.rafael.pause('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(this.rafael.tasks['foo'].isPaused).to.be.true
		})

		it('should not throw an error when pausing a task that does not exist', function() {
			expect(() => this.rafael.pause('foo')).to.not.throw(Error)
		})
	})

	describe('.start()', function() {
		it('exists', function() {
			expect(this.rafael.start).to.be.a('function')
		})

		it('should start all tasks', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.schedule(sinon.fake(), { id: 'bar' })
			this.rafael.schedule(sinon.fake(), { id: 'baz' })
			this.rafael.pause()
			this.rafael.start()

			// eslint-disable-next-line no-unused-expressions
			expect(this.rafael.isPaused).to.be.false
		})

		it('should start a single task', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.schedule(sinon.fake(), { id: 'bar' })
			this.rafael.schedule(sinon.fake(), { id: 'baz' })
			this.rafael.pause('foo')
			this.rafael.start('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(this.rafael.tasks['foo'].isPaused).to.be.false
		})
	})

	describe('.schedule()', function() {
		it('exists', function() {
			expect(this.rafael.schedule).to.be.a('function')
		})

		it('should schedule a task', function(done) {
			let isDone = false

			this.rafael.schedule(() => {
				if (!isDone) {
					isDone = true
					done()
				}
			}, { id: 'foo' })
		})

		it('should schedule a task even without an ID', function() {
			const expectedID = String(Object.keys(this.rafael.tasks).length)

			expect(this.rafael.schedule(sinon.fake())).to.be.equal(expectedID)
		})

		it('should error on duplicate IDs', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })

			expect(() => this.rafael.schedule(sinon.fake(), { id: 'foo' })).to.throw(RangeError)
		})

		it('should schedule multiple tasks', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.schedule(sinon.fake(), { id: 'bar' })
			this.rafael.schedule(sinon.fake(), { id: 'baz' })

			expect(Object.keys(this.rafael.tasks).length).to.equal(3)
		})

		it('should schedule a task with a framerate', function(done) {
			const framerate = 30
			let count = 0

			this.rafael.schedule(function() {
				count += 1
			}, {
				framerate,
				id: 'foo',
			})

			setTimeout(() => {
				this.rafael.unschedule('foo')
				expect(count).to.be.closeTo(framerate, 5)
				done()
			}, 1000)
		})

		it('should schedule a task with a framerate lower than 1', function(done) {
			this.timeout(4600)

			const framerate = 0.5
			let count = 0

			this.rafael.schedule(function() {
				count += 1
			}, {
				framerate,
				id: 'foo',
			})

			setTimeout(() => {
				this.rafael.unschedule('foo')
				expect(count).to.equal(2)
				done()
			}, 4500)
		})

		it('should error on framerates higher than 60', function() {
			const framerate = Math.random() + 60

			expect(() => {
				this.rafael.schedule(sinon.fake(), {
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

			this.rafael.schedule(function() {
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

	describe('.unschedule()', function() {
		it('exists', function() {
			expect(this.rafael.unschedule).to.be.a('function')
		})

		it('should unschedule a task', function() {
			this.rafael.schedule(sinon.fake(), { id: 'foo' })
			this.rafael.unschedule('foo')

			// eslint-disable-next-line no-unused-expressions
			expect(this.rafael.tasks).to.be.an('object').that.is.empty
		})
	})
})
