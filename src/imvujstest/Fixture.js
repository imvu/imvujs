module({
}, function (imports) {
    var Fixture = IMVU.BaseClass.extend('Fixture', {
        initialize: function (parent, name, definition, abstract_, runner) {
            if (typeof definition !== "function") {
                throw new TypeError("fixture's 2nd argument must be a function");
            }

            this.runner = runner; // TODO: remove nasty coupling
            this.name = name;
            this.parent = parent;
            this.abstract = abstract_;
            if (this.abstract) {
                // { name: string,
                //   body: function }
                this.abstractTests = [];
            }

            if (this.parent !== undefined) {
                this.parent.addAbstractTests(this);
            }

            this.scope = (this.parent === undefined ? {} : Object.create(this.parent.scope));
            this.scope.setUp = function(setUp) {
                this.setUp = setUp;
            }.bind(this);
            this.scope.tearDown = function(tearDown) {
                this.tearDown = tearDown;
            }.bind(this);

            if (undefined !== this.runner.activeFixture) {
                throw new TypeError("Cannot define a fixture within another fixture");
            }

            this.runner.activeFixture = this;
            try {
                definition.call(this.scope);
            }
            finally {
                this.runner.activeFixture = undefined;
            }
        },
        setUp: null,
        tearDown: null,
        addAbstractTests: function(concreteFixture) {
            if (this.abstract) {
                for (var i = 0; i < this.abstractTests.length; ++i) {
                    var test = this.abstractTests[i];
                    this.runner.allTests.push({
                        name: concreteFixture.name + ': ' + test.name,
                        body: test.body,
                        fixture: concreteFixture});
                }
            }
            if (this.parent) {
                this.parent.addAbstractTests(concreteFixture);
            }
        },
        extend: function(fixtureName, definition) {
            return new Fixture(this, fixtureName, definition, false, this.runner);
        },
        abstractExtend: function(fixtureName, definition) {
            return new Fixture(this, fixtureName, definition, true, this.runner);
        }
    });
    return Fixture;
});
