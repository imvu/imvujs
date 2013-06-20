(function(self) {
     function bootstrap() {
         function Transitional() {

         }
         Transitional.prototype.foo = function() {
             var message = 'PhantomJS test runner: 1 tests of 1 passed, 0 failed';
             var tt = document.createElement('tt');
             tt.appendChild(document.createTextNode(message));
             document.body.appendChild(tt);
         };
         return Transitional;
     }

     if (module.inModuleDependency()) {
         module({}, bootstrap);
     } else {
         self.Transitional = bootstrap();
     }
})(this);
