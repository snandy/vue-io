;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Index = factory();
    }
}(this, function() {

var IO = {};
var toString = Object.prototype.toString;

// Iterator
function forEach(obj, iterator, context) {
    if (!obj) return; 
    if ( obj.length && obj.length === +obj.length ) {
        for (var i = 0; i < obj.length; i++) {
            if (iterator.call(context, obj[i], i, obj) === true) return;
        }
    } else {
        for (var k in obj) {
            if (iterator.call(context, obj[k], k, obj) === true) return;
        }
    }
}

// IO.isArray, IO.isBoolean, ...
forEach(['Boolean', 'Function', 'Object', 'String', 'Number'], function(name) {
    IO['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    }
})

// Object to queryString
function serialize(obj) {
    var a = []
    forEach(obj, function(val, key) {
        if ( Array.isArray(val) ) {
            forEach(val, function(v, i) {
                a.push( key + '=' + encodeURIComponent(v) );
            })
        } else {
            a.push(key + '=' + encodeURIComponent(val));
        }
    })
    return a.join('&');
}

    
// Empty function
function noop() {}

