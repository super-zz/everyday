###### URL
Window.URL 属性返回一个对象，它提供了用于创建和管理对象URLs的静态方法。它也可以作为一个构造函数被调用来构造 URL 对象。

+ 语法
	- 构造一个新对象：

		var url = new URL("../cats/", "https://www.example.com");    

	- 调用createObjectURL静态方法：
		在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放。浏览器会在文档退出的时候自动释放它们，但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。

		img.src = URL.createObjectURL(blob);
		blob是用来创建 URL 的 File 对象或者 Blob 对象​

		URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。

		提示： 使用 一个MediaStream对象作为此方法的输入正在被弃用。这个方法正在被讨论是否应该被移除. 所以，你应当你使用MediaStream时避免使用这个方法，而用HTMLMediaElement.srcObject() 替代.

	- 调用revokeObjectURL静态方法：
		URL.revokeObjectURL() 静态方法用来释放一个之前通过调用 URL.createObjectURL() 创建的已经存在的 URL 对象。当你结束使用某个 URL 对象时，应该通过调用这个方法来让浏览器知道不再需要保持这个文件的引用了。

		你可以在sourceopen被处理之后的任何时候调用revokeObjectURL()。这是因为createObjectURL()仅仅意味着将一个媒体元素的src属性关联到一个 MediaSource 对象。调用revokeObjectURL() 使这个潜在的对象保留在原来的地方，允许平台在合适的时机进行垃圾收集。

		window.URL.revokeObjectURL(objectURL);
		objectURL是一个 DOMString，表示通过调用 URL.createObjectURL() 方法产生的 URL 对象.


###### FileReader
FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

其中File对象可以是来自用户在一个<input>元素上选择文件后返回的FileList对象,也可以来自拖放操作生成的 DataTransfer对象,还可以是来自在一个HTMLCanvasElement上执行mozGetAsFile()方法后返回结果.


+ 方法概述

	void abort();
	void readAsArrayBuffer(in Blob blob);
	void readAsBinaryString(in Blob blob);
	void readAsDataURL(in Blob blob);
	void readAsText(in Blob blob, [optional] in DOMString encoding);

+ 属性

	属性名	  			类型										描述
	error				DOMError				在读取文件时发生的错误. 只读.
	readyState	unsigned short	表明FileReader对象的当前状态. 值为State constants中的一个. 只读
	result			jsval						读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的. 只读.

+ 状态常量

	常量名			值 		描述
	EMPTY			0		还没有加载任何数据.
	LOADING		1		数据正在被加载.
	DONE			2		已完成全部的读取请求.


+ 事件处理程序

	onabort
	当读取操作被中止时调用.
	onerror
	当读取操作发生错误时调用.
	onload
	当读取操作成功完成时调用.
	onloadend
	当读取操作完成时调用,不管是成功还是失败.该处理程序在onload或者onerror之后调用.
	onloadstart
	当读取操作将要开始之前调用.
	onprogress
	在读取数据过程中周期性调用.