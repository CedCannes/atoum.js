require('../../..')(module);

var testedClass = require('../../../lib/test/stub/generator'),
    globalObject = {
        method: function() { return "method"; }
    },
    unit = module.exports = {
        getEngines: function() {
            return {
                testStubGlobal: "inline",
                testStubGlobalReset: "inline"

            }
        },

        testClass: function() {
            var object;

            this
                .object(object = new testedClass())
                .array(object.stubs).isEmpty()
            ;
        },

        testGenerate: function() {
            var object, global, method, otherMethod, generator;

            this
                .if(global = {})
                .and(method = Math.random().toString(36).substring(7))
                .and(global[method] = this.generateCallback())
                .and(generator = new testedClass())
                .then()
                    .callback(generator.generate(global, method)).isIdenticalTo(global[method])
                    .array(generator.stubs).isEqualTo([global[method]])
                .if(otherMethod = Math.random().toString(36).substring(7))
                .and(global[otherMethod] = this.generateCallback())
                .then()
                    .callback(generator.generate(global, otherMethod)).isIdenticalTo(global[otherMethod])
                    .array(generator.stubs).isEqualTo([global[method], global[otherMethod]])
                .if(global = function global() {})
                .and(global.prototype[method] = this.generateCallback())
                .and(global.prototype[otherMethod] = this.generateCallback())
                .and(object = new global())
                .then()
                    .callback(generator.generate(object, method)).isIdenticalTo(object[method])
                    .callback(generator.generate(object, otherMethod)).isIdenticalTo(object[otherMethod])
            ;
        },

        testReset: function() {
            var global, method, otherMethod, stub, otherStub, generator;

            this
                .if(global = {})
                .and(method = Math.random().toString(36).substring(7))
                .and(otherMethod = Math.random().toString(36).substring(7))
                .and(global[method] = this.generateCallback())
                .and(global[otherMethod] = this.generateCallback())
                .and(generator = new testedClass())
                .and(stub = generator.generate(global, method))
                .and(otherStub = generator.generate(global, otherMethod))
                .and(this.generateStub(stub, "restore"))
                .and(this.generateStub(otherStub, "restore"))
                .then()
                    .object(generator.reset()).isIdenticalTo(generator)
                    .array(generator.stubs).isEmpty()
                    .stub(stub.restore).wasCalled()
                    .stub(otherStub.restore).wasCalled()
            ;
        },

        testStubGlobal: function() {
            this
                .if(this.generateStub(globalObject, 'method', function() { return 'stub'; }))
                .then()
                    .string(globalObject.method()).isEqualTo('stub')
            ;
        },

        testStubGlobalReset: function() {
            this
                .string(globalObject.method()).isEqualTo('method')
            ;
        }
    };
