var expect;





expect = chai.expect;





describe( 'Scheduler', function () {
  var bar, foo, scheduler;





  before( function () {
    scheduler = new Scheduler;

    bar = false;

    foo = function () {
      console.log( 'foo' );
      bar = true;
    };
  });





  it('should have a method named "schedule"', function () {
    expect( scheduler.schedule ).to.be.a( 'function' );
  });

  describe( '.schedule()', function () {
    it( 'should schedule a task' );
  });





  it('should have a method named "unschedule"', function () {
    expect( scheduler.unschedule ).to.be.a( 'function' );
  });

  describe( '.unschedule()', function () {
    it( 'should unschedule a task' );
  });





  it('should have a method named "clear"', function () {
    expect( scheduler.clear ).to.be.a( 'function' );
  });

  describe( '.clear()', function () {
    it( 'should clear all tasks' );
  });
});
