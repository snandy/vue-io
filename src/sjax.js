/**
 *  JSONP API
 *  IO.jsonp
 *  
 */
~function(IO) {
    
    var win = window;
    var doc = win.document;
    var head = doc.head;
    var timeout = 3000;
    var done = false;
    
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
        var success = options.success || noop;
        var failure = options.failure || noop;
        var scope   = options.scope || win;
        var timestamp = options.timestamp;
        var jsonpName = options.jsonpName || 'callback';
        var callbackName = options.jsonpCallback || generateRandomName();
        
        if ( IO.isObject(data) ) {
            data = serialize(data);
        }
        var script = doc.createElement('script');
        
        function callback(isSucc) {
            if (isSucc) {
                done = true;
            } else {
                failure.call(scope);
            }
            // Handle memory leak in IE
            script.onload = script.onerror = script.onreadystatechange = null;
            if ( head && script.parentNode ) {
                head.removeChild(script);
                script = null;
                win[callbackName] = undefined;
            }
        }

        script.onload = function() {
            callback(true);
        }
        script.onerror = function() {
            callback();
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
        
        win[callbackName] = function(json) {
            success.call(scope, json);
        };
        
        script.src = url;
        head.insertBefore(script, head.firstChild);
    }
    
    // exports to IO
    IO.jsonp = function(url, opt, success) {
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
        
        return jsonp(url, opt);
    }

}(IO);
