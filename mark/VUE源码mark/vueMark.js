/**
 * 不继承原型方法
 */
Object.create(null)

/**
 * 参阅 266-270
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

Array.prototype.reduce();
reduce()方法对累加器贺数组中的每个元素应用一个函数，将其减少为单个值。

var total = [0, 1, 2, 3].reduce(function(sum, value) {
  return sum + value;
}, 0);
// total is 6

var flattened = [[0, 1], [2, 3], [4, 5]].reduce(function(a, b) {
  return a.concat(b);
}, []);
// flattened is [0, 1, 2, 3, 4, 5]
参数

callback
执行数组中每个值的函数，包含四个参数：
accumulator
累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue（如下所示）。

currentValue
数组中正在处理的元素。
currentIndex
数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则为索引为1。
array
调用reduce的数组
initialValue
[可选] 用作第一个调用 callback的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

/**
 * 参阅 319-327
 * 函数只被调用一次  闭包
 */

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

