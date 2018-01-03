1. 三元操作符

2. 短路求值简写方式 
	 const variable2 = variable1 || 'new';

3. 声明简写

4. if存在条件简写

5. 循环简写
	 forin  or  Array.forEach

6. 十进制指数
	 1e7 == 10000000;

7. 对象属性简写
	 如果属性名与key名相同，则可以采用ES6的方法
	 const obj = {x:x, y:y};
	 const obj = {x, y};

8. 箭头函数简写
传统函数编写方法很容易让人理解和编写，但是当嵌套在另一个函数中，则这些优势就荡然无存。
```
function sayHello(name) {
  console.log('Hello', name);
}

setTimeout(function() {
  console.log('Loaded')
}, 2000);

list.forEach(function(item) {
  console.log(item);
});

简写
sayHello = name => console.log('Hello', name);

setTimeout(() => console.log('Loaded'), 2000);

list.forEach(item => console.log(item));
```

9. 隐式返回值简写
	 经常使用return语句来返回函数最终结果，一个单独语句的箭头函数能隐式返回其值（函数必须省略{}为了省略return关键字）

	 为返回多行语句（例如对象字面表达式），则需要使用（）包围函数体。

```
function calcCircumference(diameter) {
  return Math.PI * diameter
}

var func = function func() {
  return { foo: 1 };
};
简写：

calcCircumference = diameter => (
  Math.PI * diameter;
)

var func = () => ({ foo: 1 });
```

10. 默认参数值 
	  为了给函数中参数传递默认值，通常使用if语句来编写，但是使用ES6定义默认值，则会很简洁：
```
function volume(l, w, h) {
  if (w === undefined)
    w = 3;
  if (h === undefined)
    h = 4;
  return l * w * h;
}
简写：

volume = (l, w = 3, h = 4 ) => (l * w * h);

volume(2) //output: 24
```

11. 模板字符串

传统的JavaScript语言，输出模板通常是这样写的。
```
const welcome = 'You have logged in as ' + first + ' ' + last + '.'

const db = 'http://' + host + ':' + port + '/' + database;
```
ES6可以使用反引号和${}简写：
```
const welcome = `You have logged in as ${first} ${last}`;

const db = `http://${host}:${port}/${database}`;
```

12. 解构赋值简写方法
		在web框架中，经常需要从组件和API之间来回传递数组或对象字面形式的数据，然后需要解构它
```
const observable = require('mobx/observable');
const action = require('mobx/action');
const runInAction = require('mobx/runInAction');

const store = this.props.store;
const form = this.props.form;
const loading = this.props.loading;
const errors = this.props.errors;
const entity = this.props.entity;
简写：

import { observable, action, runInAction } from 'mobx';

const { store, form, loading, errors, entity } = this.props;
也可以分配变量名：

const { store, form, loading, errors, entity:contact } = this.props;
//最后一个变量名为contact
```

13. 多行字符串简写
    ` a 
      b
      c`

14. 扩展运算符简写
扩展运算符有几种用例让JavaScript代码更加有效使用，可以用来代替某个数组函数。
```
// joining arrays
const odd = [1, 3, 5];
const nums = [2 ,4 , 6].concat(odd);

// cloning arrays
const arr = [1, 2, 3, 4];
const arr2 = arr.slice();
```
简写：
```
// joining arrays
const odd = [1, 3, 5 ];
const nums = [2 ,4 , 6, ...odd];
console.log(nums); // [ 2, 4, 6, 1, 3, 5 ]

// cloning arrays
const arr = [1, 2, 3, 4];
const arr2 = [...arr];
```
不像concat()函数，可以使用扩展运算符来在一个数组中任意处插入另一个数组。
```
const odd = [1, 3, 5 ];
const nums = [2, ...odd, 4 , 6];
```

也可以使用扩展运算符解构：
```
const { a, b, ...z } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a) // 1
console.log(b) // 2
console.log(z) // { c: 3, d: 4 }
```

15. 强制参数简写 （同10）
JavaScript中如果没有向函数参数传递值，则参数为undefined。为了增强参数赋值，可以使用if语句来抛出异常，或使用强制参数简写方法。
```
function foo(bar) {
  if(bar === undefined) {
    throw new Error('Missing parameter!');
  }
  return bar;
}
```
简写：
```
mandatory = () => {
  throw new Error('Missing parameter!');
}

foo = (bar = mandatory()) => {
  return bar;
}
```

16. Array.find简写
想从数组中查找某个值，则需要循环。在ES6中，find()函数能实现同样效果。
```
const pets = [
  { type: 'Dog', name: 'Max'},
  { type: 'Cat', name: 'Karl'},
  { type: 'Dog', name: 'Tommy'},
]

function findDog(name) {
  for(let i = 0; i<pets.length; ++i) {
    if(pets[i].type === 'Dog' && pets[i].name === name) {
      return pets[i];
    }
  }
}
```
简写：
```
pet = pets.find(pet => pet.type ==='Dog' && pet.name === 'Tommy');
console.log(pet); // { type: 'Dog', name: 'Tommy' }
```

18. Object[key]简写

考虑一个验证函数
```
function validate(values) {
  if(!values.first)
    return false;
  if(!values.last)
    return false;
  return true;
}

console.log(validate({first:'Bruce',last:'Wayne'})); // true
```
假设当需要不同域和规则来验证，能否编写一个通用函数在运行时确认？
```
// 对象验证规则
const schema = {
  first: {
    required:true
  },
  last: {
    required:true
  }
}

// 通用验证函数
const validate = (schema, values) => {
  for(field in schema) {
    if(schema[field].required) {
      if(!values[field]) {
        return false;
      }
    }
  }
  return true;
}


console.log(validate(schema, {first:'Bruce'})); // false
console.log(validate(schema, {first:'Bruce',last:'Wayne'})); // true
现在可以有适用于各种情况的验证函数，不需要为了每个而编写自定义验证函数了
```

20. 双重非位运算简写
有一个有效用例用于双重非运算操作符。可以用来代替Math.floor()，其优势在于运行更快。
Math.floor(4.9) === 4 //true

简写：
~~4.9 === 4 //true