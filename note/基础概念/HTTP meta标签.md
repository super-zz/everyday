必需的属性

属性：content
值：some_text
描述：定义与 http-equiv 或 name 属性相关的元信息


可选的属性

属性：http-equiv
值	： 
	content-type
 	expires 
 	[refresh]如果内容属性只包含一个正整数，则应该重新加载页面的秒数;如果内容属性包含一个正整数编号，然后是字符串';url='和一个有效的url，那么页面应该被重定向到另一个页面。 
 	refresh示例
	每5秒之后刷新本页面:
	<meta http-equiv="refresh" content="5" />
	5秒之后定向到百度首页:
	<meta http-equiv="refresh" content="5; url=http://www.baidu.com/" />
	广告恶意脚本攻击。
 	set-cookie
描述：把 content 属性关联到 HTTP 头部。

属性：name
值	： 
	author
	description
	[keywords] 一组关键字，搜索引擎对文档进行分类
	generator
	revised
	others
描述：把 content 属性关联到一个名称。

属性：scheme
值	：some_text
描述：	定义用于翻译 content 属性值的格式。







		