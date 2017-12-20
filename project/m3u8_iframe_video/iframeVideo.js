/**
 * @fileoverview  跨域 m3u8 播放器
 * @version 1.0 | 2017-04-25 | ZhengYu    //初始版本。
 *
 * @method constructor(args)    // 构造函数：初始化日期选择器。
 *   @param args                // 参数：初始化参数(必选)。
 *     iframeSrc                // 参数：iframe 地址(必选)。
 *     videoSrc                 // 参数：m3u8 视频地址(必选)。
 *     iframeId                 // 参数：iframeID(可选)。
 *     iframeClass              // 参数：iframeClass(可选)。
 *     container                // 参数：初始化参数(可选)。
 *
 * @method createIframeDOM()    // 方法：返回 iframeDOM 字符串。
 *   @param No                  // 参数：无。
 *   @return {String}           // 返回：<iframe></iframe>。
 *
 * @method play()    // 方法：调用 iframe 里 video 的 play() 方法。
 *   @param No       // 参数：无。
 *   @return No      // 返回：无。
 *
 * @method pause()    // 方法：调用 iframe 里 video 的 pause() 方法。
 *   @param No        // 参数：无。
 *   @return No       // 返回：无。
 *
 * @method bindEvent(event, callback)   // 方法：获取 video 属性的值传入 callback 执行相关逻辑。
 *   @param event                       // 参数：获取 video 属性的值(必选)。
 *   @param callback                    // 参数：获取值后执行回调函数。
 *   @return No                         // 返回：无。
 *
 * @method on(event, callback)    // 方法：监听 video 事件。参考 w3c video 事件。
 *   @param event                 // 参数：监听 video 事件 onplay onerror 。
 *   @param callback              // 参数：触发相应事件执行的函数。
 *
 * @description  //附加说明
 *   1) 通过 iframe 的 search 传递视频地址，通过第三方框架hls解析 m3u8 视频，在支持 video 的浏览器上播放。
 *   2) 父窗口与 iframe 之间通信使用的方法是 postMessage 与 message.
 *
 * @example    // 典型的调用示例。
    iframeVideo = new IframeVideo({
      iframeSrc: 'http://xxxx.com/xx',
      videoSrc: 'http://xxx.m3u8',
      iframeId: "id",
      iframeClass: "class",
      container: "#balabala"
    });

    iframeVideo.play();
    iframeVideo.pause();
    iframeVideo.on('play', function(){
      // ...
    });
    iframeVideo.bindEvent('current', function(arg){
      dot(arg);    //视频打点
    });
 */

var $ = require('common:widget/lib/jquery/jquery.js');

function IframeVideo(args) {

  this.iframeSrc = args.iframeSrc || '';
  this.videoSrc = args.videoSrc || '';
  this.iframeId = args.iframeId || '';
  this.iframeClass = args.iframeClass || '';
  this.container = args.container || '';

  this.originHref = window.location.origin;
  this.listenStatus = false;
  this.eventObj = {};

  this.container && this.appendIframe();

};

IframeVideo.prototype = {
  createIframeDOM: function() {
    return '<iframe id="' + this.iframeId + '" src="' + this.iframeSrc + '"?"' + this.videoSrc + '" class="' + this.iframeClass + '"></iframe>';
  },
  appendIframe: function() {
    this.container && $(this.container).html(this.createIframeDOM());
  },
  //event事件
  play: function() {
    var that = this;
    window.frames[0].postMessage({
      type: 'event',
      eventName: 'play',
      originHref: that.originHref
    }, this.iframeSrc);
  },
  pause: function() {
    var that = this;

    window.frames[0].postMessage({
      type: 'event',
      eventName: 'pause',
      originHref: that.originHref
    }, this.iframeSrc);
  },
  //Listener事件
  on: function(event, callback) {
    var that = this;

    if ($.isFunction(callback)) {
      that.markEvent(event, callback);
    } else {
      return false;
    }

    window.frames[0].postMessage({
      type: 'listener',
      eventName: event,
      originHref: that.originHref
    }, that.iframeSrc);

    !that.listenStatus && that.listenerMessage();
  },
  //getValue事件
  bindEvent: function(event, callback) {
    var that = this;

    if ($.isFunction(callback)) {
      that.markEvent(event, callback);
    } else {
      return false;
    }

    window.frames[0].postMessage({
      type: 'getValue',
      eventName: event,
      originHref: that.originHref
    }, this.iframeSrc);

    !that.listenStatus && that.listenerMessage();
  },
  listenerMessage: function() {
    var that = this;
    this.listenStatus = true;

    window.addEventListener('message', function(event) {
      if (event.data.status) {
        that.executeEvent(event.data.event, event.data.value);
      }
    }, false);
  },
  removeListener: function() {
    this.listenStatus = false;

    window.removeEventListener('message');
  },
  //添加事件
  markEvent: function(event, callback) {
    this.eventObj[event] = callback;
  },
  //执行事件
  executeEvent: function(eventName, eventValue) {
    var callback = this.eventObj[eventName];

    callback(eventValue);
  }
}

module.exports = IframeVideo;
