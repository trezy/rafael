'use strict'

let expect = chai.expect;





describe('Scheduler', () => {
  before(() => {
    let scheduler = new Scheduler;
    let isDone = false;

    let foo = () => {
      return true;
    };
  });

  afterEach(() => {
    scheduler.clear();
  });





  it('should have a method named "clear"', () => {
    expect(scheduler.clear).to.be.a('function');
  });

  it('should have a method named "pause"', () => {
    expect(scheduler.pause).to.be.a('function');
  });

  it('should have a method named "start"', () => {
    expect(scheduler.start).to.be.a('function');
  });

  it('should have a method named "schedule"', () => {
    expect(scheduler.schedule).to.be.a('function');
  });

  it('should have a method named "unschedule"', () => {
    expect(scheduler.unschedule).to.be.a('function');
  });





  describe('.clear()', () => {
    it('should clear all tasks', () => {
      scheduler.schedule('foo', foo);
      scheduler.schedule('bar', foo);
      scheduler.schedule('baz', foo);
      scheduler.clear();
      expect(scheduler.tasks).to.be.empty;
    });
  });





  describe('.pause()', () => {
    it('should pause all tasks', () => {
      scheduler.schedule('foo', foo);
      scheduler.schedule('bar', foo);
      scheduler.schedule('baz', foo);
      scheduler.pause();
      expect(scheduler.paused).to.be.true;
    });

    it('should pause a single task', () => {
      scheduler.schedule('foo', foo);
      scheduler.schedule('bar', foo);
      scheduler.schedule('baz', foo);
      scheduler.pause('foo');
      expect(scheduler.tasks['foo'].paused).to.be.true;
    });
  });





  describe('.start()', () => {
    it('should start all tasks', () => {
      scheduler.schedule('foo', foo);
      scheduler.schedule('bar', foo);
      scheduler.schedule('baz', foo);
      scheduler.pause();
      scheduler.start();
      expect(scheduler.paused).to.be.false;
    });

    it('should start a single task', () => {
      scheduler.schedule('foo', foo);
      scheduler.schedule('bar', foo);
      scheduler.schedule('baz', foo);
      scheduler.pause('foo');
      scheduler.start('foo');
      expect(scheduler.tasks['foo'].paused).to.be.false;
    });
  });





  describe('.schedule()', () => {
    it('should schedule a task', (done) => {
      scheduler.schedule('foo', () => {
        if (!isDone) {
          isDone = true;
          done();
        }
      });
    });

    it('should error on duplicate IDs', () => {
      scheduler.schedule('foo', foo);
      expect(() => {
        scheduler.schedule('foo', foo)
      }).to.throw(RangeError);
    });

    it('should be able to schedule multiple tasks', () => {
      scheduler.schedule('foo', foo);
      scheduler.schedule('bar', foo);
      scheduler.schedule('baz', foo);

      expect(Object.keys(scheduler.tasks).length).to.equal(3);
    });
  });





  describe('.unschedule()', () => {
    it('should unschedule a task', () => {
      scheduler.schedule('foo', foo);
      scheduler.unschedule('foo');
      expect(scheduler.tasks).to.be.empty;
    });
  });
});
