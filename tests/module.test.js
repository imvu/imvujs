module({
}, function(imports) {
    fixture("Fixture", function() {
        this.setUp(function() {
            this.criticalErrorOccurred = false;
            this.sysincludeCalls = [];
            this.sysincludeModuleDep = null;
            this.settings = {
                path: {
                    dirname: function(f) {
                        return "fake_dir";
                    },
                    join: function(a,b) {
                        return a + "/" + b;
                    }
                },
                criticalErrorHandler: function() {
                    this.criticalErrorOccurred = true;
                }.bind(this),
                sysinclude: function(currentPath, includePath, settings) {
                    this.sysincludeCalls.push(includePath);
                    if (this.sysincludeModuleDep) {
                        module({depB: "a.js"}, this.fakeModuleBody, this.settings);
                    }
                }.bind(this)
            };

            this.bodyCallParam = null;
            this.fakeModuleBody = function(param) {
                this.bodyCallParam = param;
            }.bind(this);
        });

        test("include module with correct path", function() {
            module({depA: "a.js"}, this.fakeModuleBody, this.settings);
            assert.equal(1, this.sysincludeCalls.length);
            assert.equal('fake_dir/a.js', this.sysincludeCalls[0]);
            assert.false(this.criticalErrorOccurred);
        });

        test("call body with module after all dependencies resolved", function() {
            module({depA: "a.js"}, this.fakeModuleBody, this.settings);
            var imports = this.bodyCallParam;
            assert.true(imports.hasOwnProperty('depA'));
            assert.false(this.criticalErrorOccurred);
        }),

        test("handle circular dependency", function() {
            this.sysincludeModuleDep = true;
            module({depA: "a.js"}, this.fakeModuleBody, this.settings);
            assert.true(this.criticalErrorOccurred);
        });
        
        //test("dynamicImport loads after module is instantiated", function() {
        //    this.fakeModuleBody = function(param) {
        //        this.loadedModule = {
        //            load: function() {
        //                console.log(IMVU.repr(module));
        //                module.dynamicImport(["fake_dir/a.js"]);
        //            }
        //        }
        //    }.bind(this);
        //    
        //    module({}, this.fakeModuleBody, this.settings);
        //    assert.equal(0, this.sysincludeCalls.length);
        //    assert.notEqual('fake_dir/a.js', this.sysincludeCalls[0]);
        //    assert.false(this.criticalErrorOccurred);
        //    
        //    this.loadedModule.load();
        //    assert.equal(1, this.sysincludeCalls.length);
        //    assert.equal('fake_dir/a.js', this.sysincludeCalls[0]);
        //    assert.false(this.criticalErrorOccurred);
        //});
    });
});
