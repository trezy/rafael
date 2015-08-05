var expect;





expect = chai.expect;





describe( 'Scheduler', function () {
  var foo, scheduler;





  before( function () {
    scheduler = new Scheduler;

    foo = function () {
      return true;
    };
  });





  it('should have a method named "schedule"', function () {
    expect( scheduler.schedule ).to.be.a( 'function' );
  });

  describe( '.schedule()', function () {
    it( 'should schedule a task', function ( done ) {
      scheduler.schedule( 'foo', function () {
        done();
      });
    });

    it( 'shouldn\'t allow duplicate IDs', function () {
      scheduler.schedule( 'foo', foo );
      expect( scheduler.tasks.length ).to.equal( 1 );
    });
  });





  it('should have a method named "unschedule"', function () {
    expect( scheduler.unschedule ).to.be.a( 'function' );
  });

  describe( '.unschedule()', function () {
    it( 'should unschedule a task', function () {
      scheduler.unschedule( 'foo' );
      expect( scheduler.tasks ).to.be.empty;
    });
  });





  it('should have a method named "clear"', function () {
    expect( scheduler.clear ).to.be.a( 'function' );
  });

  describe( '.clear()', function () {
    it( 'should clear all tasks', function () {
      scheduler.schedule( 'foo', foo );
      scheduler.schedule( 'bar', foo );
      scheduler.schedule( 'baz', foo );
      scheduler.clear();
      expect( scheduler.tasks ).to.be.empty;
    });
  });
});
