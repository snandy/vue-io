# vue-io
The HTTP for Vue.js，include ajax &amp; jsonp

## Ajax API

+ 执行基本ajax请求, 返回XMLHttpRequest
```javascript
Vue.IO.ajax(url, {
    async      是否异步 true(默认)
    method     请求方式 POST or GET(默认)
    type       数据格式 json(默认) or xml, text
    encode     请求的编码 UTF-8(默认)
    timeout    请求超时时间 0(默认)
    credential 跨域请求时是否带证书(默认false，不带http认证信息如cookie)
    data       请求参数 (字符串或json)
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});

```
+ 也可只传一个配置对象
```javascript
Vue.IO.ajax({
    url        请求
    async      是否异步 true(默认)
    method     请求方式 POST or GET(默认)
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```
        
+ 执行ajax请求, 返回纯文本
```javascript
Vue.IO.text(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```
    
+ 执行ajax请求, 返回JSON
```javascript
Vue.IO.json(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```
    
+ 执行ajax请求, 返回XML
```javascript
Vue.IO.xml(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```
    
+ GET 请求
```javascript
Vue.IO.get(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```

+ POST 请求
```javascript
Vue.IO.post(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```

+ 同步请求
```javascript
Vue.IO.sync(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```
    
+ 异步请求
```javascript
Vue.IO.async(url, {
    ...
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
});
```
        
+ 还有更简便的，总有一种满足您
```javascript
Vue.IO.get(url)
Vue.IO.get(url, data)

Vue.IO.post(url)
Vue.IO.post(url, data)

Vue.IO.sync(url)
Vue.IO.sync(url, data)
```


## JSONP API

+ 基本的JSONP请求
```javascript
Vue.IO.jsonp(url, {
    param     // 请求参数 (键值对字符串或js对象)
    timestamp // 是否加时间戳
    jsonpCallback // 指定回调函数名称，不使用随机函数名，用在缓存时timestamp应该设为false
}).then(function(res) {
    // Success
}, function() {
    // Fail
});
```
    
+ 也可只传一个配置对象
```javascript
Vue.IO.jsonp({
    url       // 请求url 
    param     // 请求参数 (键值对字符串或js对象)
    timestamp // 是否加时间戳
    jsonpCallback // 指定回调函数名称，不使用随机函数名，用在缓存时timestamp应该设为false    
}).then(function(res) {
    // Success
}).catch(function() {
    // Fail
})
```
    