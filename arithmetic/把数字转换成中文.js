//完成将 toChineseNum， 可以将数字转换成中文大写的表示，处理到万级别，例如 toChineseNum(12345)，返回 一万二千三百四十五。
const unit = ['', '十', '百', '千', '万'];
const cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
let k = 0;
let strArr = [];

const toChineseNum = (num) => {
  // TODO
  if (num == 0) {
  	k == 0 && strArr.push(cnum[k]);
  	console.log(strArr.reverse().join(''));
  	strArr = [];
  	k = 0;
  }else{
  	num%10 != 0 && (strArr.push(unit[k]), strArr.push(cnum[num%10]));
  	k++;
  	toChineseNum(~~(num/10));
  }
}