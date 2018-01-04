
var url = '';
var xhr = new XMLHttpRequest();

xhr.open('GET', url);
xhr.responseType = 'blob';
xhr.onload = function() {
	var reader = new FileReader();
	reader.onloadend = function(){

	}
	reader.readAsDataURL(xhr.response);
};
xhr.send(null);


let url = window.URL || window.webkitURL;
let xhr = new XMLHttpRequest();
xhr.open(method, url, [,async=true,]);
xhr.ontimeout = ()=>{};
xhr.onreadystatechange=()=>{
  if(xhr.readystate === 4) {
    if(xhr.status =200) {
      let res = xhr.responseText;
      let blob = new Blob([res], {type: 'video/mpeg4'});
      ....
      ....
      videoEle.src = url.createObjectURL(blob);
    };
  }
};