
200 from memory cache

不访问服务器，直接读缓存，从内存中读取缓存。此时的数据时缓存到内存中的，当kill进程后，也就是浏览器关闭以后，数据将不存在。

但是这种方式只能缓存派生资源。

200 from disk cache

不访问服务器，直接读缓存，从磁盘中读取缓存，当kill进程时，数据还是存在。

这种方式也只能缓存派生资源

304 Not Modified

访问服务器，发现数据没有
更新，服务器返回此状态码。然后从缓存中读取数据。



######206 “Partial Content”
客户端表明自己只需要目标URL上的部分资源的时候返回的，
这种情况经常发生在客户端继续请求一个未完成的下载的时候，
(通常是当客户端加载一个体积较大的潜入文件，比如视频或PDF
),或者是客户端尝试实现带宽遏流的时候。