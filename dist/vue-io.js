/*!
 * vue-io.js v1.0.3
 * snandy 2017-12-13 11:12:01
 *
 */
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


/**
 *  Ajax API
 *     IO.ajax, IO.get, IO.post, IO.text, IO.json, IO.xml
 *  
 */
~function(IO) {

function ajax(url, options) {
    if ( IO.isObject(url) ) {
        options = url;
        url = options.url;
    }
    var options    = options || {};
    var async      = options.async !== false;
    var method     = options.method  || 'GET';
    var type       = options.type    || 'text';
    var encode     = options.encode  || 'UTF-8';
    var timeout    = options.timeout || 0;
    var credential = options.credential;
    var data       = options.data;
    var scope      = options.scope;
    var success    = options.success || noop;
    var failure    = options.failure || noop;
    
    
    // 大小写都行，但大写是匹配HTTP协议习惯
    method  = method.toUpperCase();
    
    // 对象转换成字符串键值对
    if ( IO.isObject(data) ) {
        data = serialize(data);
    }
    if (method === 'GET' && data) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + data;
    }

    return new Promise(function(resolve, reject) {
        var timer;
        var isTimeout = false;
        var xhr = new XMLHttpRequest();
        if (async && timeout > 0) {
            timer = setTimeout(function() {
                // 先给isTimeout赋值，不能先调用abort
                isTimeout = true;
                xhr.abort();
            }, timeout);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (isTimeout) {
                    reject('request timeout');
                } else {
                    onStateChange(type);
                    clearTimeout(timer);
                }
            }
        };
        var onStateChange = function(type) {
            var result;
            var s = xhr.status;
            if (s >= 200 && s < 300) {
                switch (type) {
                    case 'text':
                        result = xhr.responseText;
                        break;
                    case 'json':
                        result = JSON.parse(xhr.responseText);
                        break;
                    case 'xml':
                        result = xhr.responseXML;
                        break;
                }
                // text, 返回空字符时执行success
                // json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
                result !== undefined && resolve(result);
                
            } else {
                reject(xhr, xhr.status)
            }
            xhr = null;
        };

        xhr.open(method, url, async);
        if (credential) {
            xhr.withCredentials = true;
        }
        if (method == 'POST') {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
        }
        xhr.send(data);
    });
}



// exports to IO
var api = {
    method: ['get', 'post'],
    type: ['text','json','xml'],
    async: ['sync', 'async']
};

// Low-level Interface: IO.ajax
IO.ajax = ajax;

// Shorthand Methods: IO.get, IO.post, IO.text, IO.json, IO.xml
forEach(api, function(val, key) {
    forEach(val, function(item, index) {
        IO[item] = function(key, item) {
            return function(url, opt, success) {
                if ( IO.isObject(url) ) {
                    opt = url;
                }
                if ( IO.isFunction(opt) ) {
                    opt = {success: opt};
                }
                if ( IO.isFunction(success) ) {
                    opt = {data: opt};
                    opt.success = success;
                }
                if (key === 'async') {
                    item = item==='async' ? true : false;
                }
                opt = opt || {};
                opt[key] = item;
                return ajax(url, opt);
            }
        }(key, item);
    });
});

}(IO);

/**
 *  JSONP API
 *  IO.jsonp
 *  
 */
~function(IO) {
    
var win = window;
var doc = win.document;
var head = doc.head;

// Thanks to Kevin Hakanson
// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/873856#873856
function generateRandomName() {
    var uuid = '';
    var s = [];
    var i = 0;
    var hexDigits = '0123456789ABCDEF';
    for (i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[12] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01  
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
    uuid = 'jsonp_' + s.join('');
    return uuid;
}

function jsonp(url, options) {
    if ( IO.isObject(url) ) {
        options = url;
        url = options.url;
    }
    var options = options || {};
    var me      = this;
    var url     = url.indexOf('?') === -1 ? (url + '?') : (url + '&');
    var data    = options.data;
    var charset = options.charset;
    var timestamp = options.timestamp;
    var jsonpName = options.jsonpName || 'callback';
    var callbackName = options.jsonpCallback || generateRandomName();
    
    if ( IO.isObject(data) ) {
        data = serialize(data);
    }

    var script = doc.createElement('script');
    
    function destroy(isSucc) {
        // Handle memory leak in IE
        script.onload = script.onerror = script.onreadystatechange = null;
        if ( head && script.parentNode ) {
            head.removeChild(script);
            script = null;
            win[callbackName] = undefined;
        }
    }
    
    url += jsonpName + '=' + callbackName;
    
    if (charset) {
        script.charset = charset;
    }
    if (data) {
        url += '&' + data;
    }
    if (timestamp) {
        url += '&ts=';
        url += (new Date).getTime();
    }
    
    return new Promise(function(resolve, reject) {
        script.onload = function() {
            destroy();
        }
        script.onerror = function() {
            destroy();
            reject();
        }
        win[callbackName] = function(json) {
            resolve(json);
        };
        script.src = url;
        head.insertBefore(script, head.firstChild);
    });
}

// exports to IO
IO.jsonp = function(url, opt) {
    if ( IO.isObject(url) ) {
        opt = url;
    }
    return jsonp(url, opt);
};

}(IO);


Vue.IO = Vue.prototype.$IO = IO;

return IO;

}));
