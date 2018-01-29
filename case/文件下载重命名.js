<a>标签 dowload属性在不跨域的时候可用，跨域时可以将文件下载到本地失去域名信息，再下载。


  var xhr = new XMLHttpRequest();
  xhr.open('GET', fileUrl, true);
  xhr.responseType = "blob";
  xhr.onload = function(){
  	var reader = new FileReader();
		reader.onloadend = function(){
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
  }
  xhr.send();


  readAsDataURL 
  createObjectURL