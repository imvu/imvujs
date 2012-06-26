var vm = require('vm');
vm.runInThisContext('var x = 10');
console.log(x);
