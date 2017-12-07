# vue-io
The HTTP for Vue.js，include ajax &amp; jsonp

## Ajax API

+ 执行基本ajax请求, 返回XMLHttpRequest
    <pre>
    Vue.IO.ajax(url, {
        async      是否异步 true(默认)
        method     请求方式 POST or GET(默认)
        type       数据格式 json(默认) or xml, text
        encode     请求的编码 UTF-8(默认)
        timeout    请求超时时间 0(默认)
        credential 跨域请求时是否带证书(默认false，不带http认证信息如cookie)
        data       请求参数 (字符串或json)
        scope      成功回调执行上下文
        success    请求成功后响应函数 参数为text,json,xml数据
        failure    请求失败后响应函数 参数为xmlHttp, msg, exp
    })
    </pre>

+ 也可只传一个配置对象
    <pre>
    Vue.IO.ajax({
        url        请求
        async      是否异步 true(默认)
        method     请求方式 POST or GET(默认)
        ...
    })
    </pre>
        
+ 执行ajax请求, 返回纯文本
    <pre>
    Vue.IO.text(url, {
        ...
    })
    </pre>
    
+ 执行ajax请求, 返回JSON
    <pre>
    Vue.IO.json(url, {
        ...
    })
    </pre>
    
+ 执行ajax请求, 返回XML
    <pre>
    Vue.IO.xml(url, {
        ...
    })
    </pre>
    
+ GET 请求
    <pre>
    Vue.IO.get(url, {
        ...
    })
    </pre>

+ POST 请求
    <pre>
    Vue.IO.post(url, {
        ...
    })
    </pre>

+ 同步请求
    <pre>
    Vue.IO.sync(url, {
        ...
    })
    </pre>
    
+ 异步请求
    <pre>
    Vue.IO.async(url, {
        ...
    })
    </pre>
        
+ 还有更简便的，总有一种满足您
    <pre>
    Vue.IO.get(url)
    Vue.IO.get(url, success)
    Vue.IO.get(url, data, success)
    
    Vue.IO.post(url)
    Vue.IO.post(url, success)
    Vue.IO.post(url, data, success)
    
    Vue.IO.sync(url)
    Vue.IO.sync(url, success)
    Vue.IO.sync(url, data, success)
    </pre>


## JSONP API

+ 基本的JSONP请求
    <pre>
    Vue.IO.jsonp(url, {
        param     // 请求参数 (键值对字符串或js对象)
        success   // 请求成功回调函数
        failure   // 请求失败回调函数
        scope     // 回调函数执行上下文
        timestamp // 是否加时间戳
        jsonpCallback // 指定回调函数名称，不使用随机函数名，用在缓存时，此时timestamp应该设为false
    })
    </pre>
    
+ 也可只传一个配置对象
    <pre>
    Vue.IO.jsonp({
        url       // 请求url 
        param     // 请求参数 (键值对字符串或js对象)
        success   // 请求成功回调函数
        ...
    })
    </pre>
    
+ 还有更简便的，总有一种满足您
    <pre>
    Vue.IO.jsonp(url)
    Vue.IO.jsonp(url, success)
    Vue.IO.jsonp(url, data, success)
    </pre>
    