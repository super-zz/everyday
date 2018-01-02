null (对象)
null表示没有对象，即该处不应该有值。
 1) 作为函数的参数，表实该函数的参数不是对象；
 2) 作为对象原型链的终点。

undefined (值)
undefined表示缺少值，就是此处应该有一个值，但是还没有定义。
	1) 变量被声明了，但没有赋值时，就等于undefined；
	2) 调用函数时，应该提供的参数没有提供，该参数等于undefined；
	3) 对象没有赋值的属性，该属性的值为undefined；
	4) 函数没有返回值时，默认返回undefined。


null 表示一个值被定义了，定义为“空值”；
undefined 表示根本不存在定义。
所以设置一个值为 null 是合理的，如
objA.valueA = null;
但设置一个值为 undefined 是不合理的

区别
1. typeof undefined === undefined  //true
	 typeof null === object  //true
2. 转为数值
	 +null   //0
	 +undefined //NAN
相同点
1. Boolean类型都为false