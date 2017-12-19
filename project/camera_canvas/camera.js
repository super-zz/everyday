/**
 * @fileoverview 转介绍-活动 拍照
 */

var urlExt = require(':widget/util/url.js'),
  Hammer = require(':widget/lib/hammer/hammer.js'),
  cookie = require(':widget/util/cookie.js'),
  EXIF = require(':widget/lib/exif/exif.js');

var $imgObj = $('#camera'),
  $posterObj = $('#watermark'),
  $code = $('#code'),
  $imgModal = $('.img'),
  $posterArea = $('.poster-area div'),
  Orientation,
  CANVASWIDTH = $posterArea.width()*2,
  CANVASHEIGHT = $posterArea.height()*2,
  CODEWIDTH = 100,
  index = 0;

var URLupload = '/course/wechat/diarybuild';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//检测设备
var u = navigator.userAgent;
var checkUA = {
  isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 性能检测
var isSVGSupported = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

function isCanvasSupported() {
  var _canvas = document.createElement('canvas');
  return !!(_canvas.getContext && _canvas.getContext('2d'));
}

if (isCanvasSupported() && isSVGSupported) {
  console.log('性能ok');
}else{
  alert('不支持canvas');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 照片对象放大缩小移动
var hammertime = new Hammer($posterObj.get(0));
hammertime.get('pinch').set({ enable: true });

hammertime.on("pinchin", function (e) {
  $imgObj.css({
    transform: 'scale('+ e.scale +')'
  });
});
hammertime.on("pinchout", function (e) {
  $imgObj.css({
    transform: 'scale('+ e.scale +')'
  });
});

var _left, _top;
hammertime.on("panstart", function (e) {
  _left = parseInt($imgObj.css('left'));
  _top = parseInt($imgObj.css('top'));
});

hammertime.on("panleft", function (e) {
  $imgObj.css({
    left: _left + e.deltaX + 'px'
  });
});
hammertime.on("panright", function (e) {
  $imgObj.css({
    left: _left + e.deltaX + 'px'
  });
});
hammertime.on("panup", function (e) {
  $imgObj.css({
    top: _top + e.deltaY + 'px'
  });
});
hammertime.on("pandown", function (e) {
  $imgObj.css({
    top: _top + e.deltaY + 'px'
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//二维码相关
var codePos =[
  {top: '0.55rem', left: '1.95rem', x: (240/600)*CANVASWIDTH, y: (65/900)*CANVASHEIGHT, size: CANVASWIDTH*12/60},
  {top: '5.78rem', left: '1.5rem', x: (184/600)*CANVASWIDTH, y: (720/900)*CANVASHEIGHT, size: CANVASWIDTH*12/60},
  {top: '6.1rem', left: '3.75rem', x: (465/600)*CANVASWIDTH, y: (770/900)*CANVASHEIGHT, size: CANVASWIDTH*12/60},
  {top: '0.3rem', left: '3.75rem', x: (465/600)*CANVASWIDTH, y: (33/900)*CANVASHEIGHT, size: CANVASWIDTH*12/60}
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 合成图层
var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d');

canvas.width = CANVASWIDTH;
canvas.height = CANVASHEIGHT;
$(canvas).css({
  width: CANVASWIDTH/2+"px",
  height: CANVASHEIGHT/2+"px",
});

var originPos = {
  scale: function(obj){
    var str = obj.css('transform');
    var pos1 = str.indexOf("(")+1;
    var pos2 = str.indexOf(")");
    return str.substring(pos1, pos2);
  },
  top: function(obj){
    var that = this;
    return (parseInt(obj.css('top'))+((1-that.scale(obj))*that.originHeight(obj))/2)*2;
  },
  left: function(obj){
    var that = this;
    return (parseInt(obj.css('left'))+((1-that.scale(obj))*that.originWidth(obj))/2)*2;
  },
  originWidth: function(obj){
    var that = this;
    return parseInt(obj.css('width'));
  },
  originHeight: function(obj){
    var that = this;
    return parseInt(obj.css('width'));
  },
  width: function(obj){
    var that = this;
    return parseInt(obj.css('width'))*2*that.scale(obj);
  },
  height: function(obj){
    var that = this;
    return parseInt(obj.css('height'))*2*that.scale(obj);
  }
}

$('#create-poster').on('click', function(){
  var _posterObj = $posterObj.get(0),
    _left =  originPos.left($imgObj),
    _top = originPos.top($imgObj),
    _width = originPos.width($imgObj),
    _height = originPos.height($imgObj);

  var _img = new Image();
  _imgCode = $code.get(0);

  msg.showPhoto();
  ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);  
  ctx.drawImage(_rotateImg, _left, _top, _width, _height);
  ctx.drawImage(_posterObj, 0, 0, CANVASWIDTH, CANVASHEIGHT);
  ctx.drawImage(_imgCode, codePos[index].x, codePos[index].y, codePos[index].size, codePos[index].size);
  _img.src = canvas.toDataURL("image/png");

  _img.onload = function(){

    $.post(URLupload, {
      strStudentUid: urlExt.getQuery('strStudentUid'),
      diaryWeek: urlExt.getQuery('diaryWeek'),
      diaryScene: urlExt.getQuery('diaryScene'),
      diaryType: urlExt.getQuery('diaryType'),
      diaryPeriod: urlExt.getQuery('diaryPeriod'),
      width: 600,
      height: 900,
      id: id, 
      picData: _img.src
    }, function(res) {
      if (res && res.errNo == 0) {
        $imgModal.find('div').html(_img);
        posterStatus('preview');
        msg.hidePhoto();
        id = res.data.id;
      }else{
        msg.hidePhoto();
        alert('海报上传失败... 请重新生成');
      }
    });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//input预览
var _rotateImg = new Image(),
  $status = $('.load');

$('#cameraInput').on('change',function(){
  selectFileImage(this);
});

function selectFileImage(fileObj) {  
  var file = fileObj.files['0'];  
  var Orientation = null;  
    
  if (file) {  
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (!rFilter.test(file.type)) {  
      alert("请选择jpeg、png格式的图片");  
      return;  
    }  
    msg.showPhoto();
    if (!$status.hasClass('edit')) {
      $status.addClass('edit');
    }

    EXIF.getData(file, function() {  
      EXIF.getAllTags(this);   
      Orientation = EXIF.getTag(this, 'Orientation');
    });  
      
    var oReader = new FileReader();  
    oReader.onload = function(e) {
      var image = new Image();  
      image.src = e.target.result;  

      $imgObj.attr('src', this.result);

      setTimeout(function(){
        msg.hidePhoto();
      }, 1000);

      image.onload = function() {  
        var expectWidth = this.naturalWidth;  
        var expectHeight = this.naturalHeight;  
          
        if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {  
          expectWidth = 800;  
          expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;  
        } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {  
          expectHeight = 1200;  
          expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;  
        }  
        var canvas = document.createElement("canvas");  
        var ctx = canvas.getContext("2d");  
        canvas.width = expectWidth;  
        canvas.height = expectHeight;  
        ctx.drawImage(this, 0, 0, expectWidth, expectHeight);  
        var base64 = null;

        if (checkUA.isIOS) {  
          if(Orientation != "" && Orientation != 1){  
            switch(Orientation){  
              case 6:
                rotateImg(this,'left',canvas);  
                break;  
              case 8:
                rotateImg(this,'right',canvas);  
                break;  
              case 3:
                rotateImg(this,'right',canvas);  
                rotateImg(this,'right',canvas);  
                break;  
            }     
          }  
        }else{
          var ctx = canvas.getContext('2d');  
          canvas.width = this.width;  
          canvas.height = this.height;
          ctx.drawImage(this, 0, 0, this.width, this.height);  
        }  
            
        base64 = canvas.toDataURL("image/jpeg", 0.8);  
        _rotateImg.src = base64;
      };  
    };  
    oReader.readAsDataURL(file);
  }  
}

function rotateImg(img, direction,canvas) {  
  var min_step = 0;  
  var max_step = 3;  
  if (img == null)return;  

  var height = img.height;  
  var width = img.width;  
  var step = 2;  
  if (step == null) {  
    step = min_step;  
  }  
  if (direction == 'right') {  
    step++;  
    step > max_step && (step = min_step);  
  } else {  
    step--;  
    step < min_step && (step = max_step);  
  }  
  var degree = step * 90 * Math.PI / 180;  
  var ctx = canvas.getContext('2d');  
  switch (step) {  
    case 0:  
      canvas.width = width;  
      canvas.height = height;  
      ctx.drawImage(img, 0, 0);  
      break;  
    case 1:  
      canvas.width = height;  
      canvas.height = width;  
      ctx.rotate(degree);  
      ctx.drawImage(img, 0, -height);  
      break;  
    case 2:  
      canvas.width = width;  
      canvas.height = height;  
      ctx.rotate(degree);  
      ctx.drawImage(img, -width, -height);  
      break;  
    case 3:  
      canvas.width = height;  
      canvas.height = width;  
      ctx.rotate(degree);  
      ctx.drawImage(img, -width, 0);  
      break;  
  }  
} 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//切换场景
$('.poster-template li').on('click', function(event) {
  event.preventDefault();

  var $this = $(this);

  if ($this.hasClass('disable')) {
    msg.showModal();
    return;
  }

  var _src1 = $this.find('img').attr('src');
  var _src2 = $posterObj.attr('src');

  if (_src1 != _src2) {
    index = $this.index();
    $posterObj.attr('src', _src1);
    changeCodePos(index);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// alert提示
var $wgt_overlay = $('.wgt_overlay');
var $photo = $('.wgt_dialog.photo');
var $modal = $('.wgt_dialog.modal');

var msg = {
  showPhoto: function(){
    $wgt_overlay.show();
    $photo.show();
  },
  hidePhoto: function(){
    $wgt_overlay.hide();
    $photo.hide();
  },
  showModal: function(){
    $wgt_overlay.show();
    $modal.show();
  },
  hideModal: function(){
    $wgt_overlay.hide();
    $modal.hide();
  }
};

$modal.on('click', 'a', function(event) {
  event.preventDefault();
  msg.hideModal();
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//设置二维码坐标
function changeCodePos(index){
  $code.css({
    top: codePos[index].top,
    left: codePos[index].left
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//切换编辑与预览
function posterStatus(active){
  switch (active){
    case 'edit':
      $('[cmd="preview"]').hide();
      break;
    case 'preview':
      $('[cmd="preview"]').show();
      break;
  }
}

$('#edit').on('click', function(){
  posterStatus('edit');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//非要一屏幕显示

var paddingHeight = 28,
  windowHeight = $(window).height(),
  fixHeight = $('.camera-btn').height(),
  posterOriginHeight = $('.poster-area').height(),
  poster = 25,
  modal = 8;

var modalHeight = (windowHeight - fixHeight - paddingHeight)*(modal/(poster + modal));
var posterHeight = (windowHeight - fixHeight - paddingHeight)*(poster/(poster + modal));

$('.poster-template ul img').each(function(i, v){
  v.style.height =  modalHeight + 'px';
})
$('.poster-area').css({
  transform: 'scale('+ posterHeight/posterOriginHeight +')',
  marginBottom: (posterHeight - posterOriginHeight) + 'px'
});

