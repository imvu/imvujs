(function() {
     var calls = [];

     var Base = fixture("Base", function() {
         this.setUp(function() {
             calls.push("Base.setUp");
         });
         this.tearDown(function() {
             calls.push("Base.tearDown");
         });
     });

     var Derived = Base.extend("Derived", function() {
         this.setUp(function() {
             calls.push("Derived.setUp");
         });
         this.tearDown(function() {
             calls.push("Derived.tearDown");
         });

         test("nop", function() {
         });
     });

     test("setUp and tearDown run in the right order", function() {
         assert.deepEqual(['Base.setUp', 'Derived.setUp', 'Derived.tearDown', 'Base.tearDown'], calls);
     });
 })();
