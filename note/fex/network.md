传统上，为什么要从多个域服务站点资产更好呢?
1.静态内容和动态内容分服务器存放，使用不同的服务器处理请求。 提高效率；
2.图片请求是不需要传递cookie；
3.突破浏览器并发限制。

从你输入网站的URL到它在你的屏幕上完成加载的时候，尽你所能描述这个过程。
1.查询本地DNS缓存，chrome://net-internals/#dns
2.查询远程域名根DNS，找到IP地址
3.向远程IP地址的服务器发送请求
4.服务器响应请求，向用户发送数据
5.浏览器对返回的数据进行处理（浏览器渲染）

长轮询、Websockets和服务器发送的事件之间有什么区别?
http协议:一个request等于一个response,response是被动的，不能主动发起。
Websocket:一个持久化协议，基于HTTP的协议完成一部分握手。

GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com

解释以下请求和响应头:
差异，在过期，日期，年龄和修改-……
不跟踪
cache - control
传输编码
ETag
X-Frame-Options

Cache-Control指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置 Cache-Control并不会修改另一个消息处理过程中的缓存处理过程。请求时的缓存指令包括no-cache、no-store、max-age、 max-stale、min-fresh、only-if-cached，响应消息中的指令包括public、private、no-cache、no- store、no-transform、must-revalidate、proxy-revalidate、max-age。各个消息中的指令含义如下：

no-cache：指示请求或响应消息不能缓存，实际上是可以存储在本地缓存区中的，只是在与原始服务器进行新鲜度验证之前，缓存不能将其提供给客户端使用。
no-store：缓存应该尽快从存储器中删除文档的所有痕迹，因为其中可能会包含敏感信息。
max-age：缓存无法返回缓存时间长于max-age规定秒的文档，若不超规定秒浏览器将不会发送对应的请求到服务器，数据由缓存直接返回；超过这一时间段才进一步由服务器决定是返回新数据还是仍由缓存提供。若同时还发送了max-stale指令，则使用期可能会超过其过期时间。
min-fresh：至少在未来规定秒内文档要保持新鲜，接受其新鲜生命期大于其当前 Age 跟 min-fresh 值之和的缓存对象。
max-stale：指示客户端可以接收过期响应消息，如果指定max-stale消息的值，那么客户端可以接收过期但在指定值之内的响应消息。
only-if-cached：只有当缓存中有副本存在时，客户端才会获得一份副本。
Public：指示响应可被任何缓存区缓存，可以用缓存内容回应任何用户。
Private：指示对于单个用户的整个或部分响应消息，不能被共享缓存处理，只能用缓存内容回应先前请求该内容的那个用户。




HTTP方法是什么?列出您所知道的所有HTTP方法并解释它们。