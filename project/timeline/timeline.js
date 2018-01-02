/**
 * @fileoverview 到课时间轴弹窗组件
 *
 * @example    // 典型的调用示例。
 * var onlineDialog = require('./timeline.js');
 * new onlineDialog({
 *  host: '[data-online]',
 *  studentUid: null,
 *  lessonId: null,
 *  classNames: 'online-dialog',
 *  tplPath: './onlineDialog.tpl',
 *  url: '/assistantdesk/student/getonlinestat'
 * });
 */

var Dialog = require('common:widget/ui/dialog/dialog.js'),
  JSmart = require('common:widget/lib/jsmart/jsmart.js'),
  safeCall = require('common:widget/util/safeCall.js');

function formateDate(time){
  var timestamp = new Date(time*1000);
  return (timestamp.getHours() < 10 ? ('0' + timestamp.getHours()) : timestamp.getHours()).toString()
   + ':' + (timestamp.getMinutes() < 10 ? ('0' + timestamp.getMinutes()) : timestamp.getMinutes()).toString()
   + ':' + (timestamp.getSeconds() < 10 ? ('0' + timestamp.getSeconds()) : timestamp.getSeconds()).toString();
}
function startPosition(data, scale){
  return (data.start - data.pre) * scale;
}
function linePosition(obj, data, scale){
  var left, right;
  left = (obj.bigin - data.pre) * scale;
  right = (obj.end - data.pre) * scale;
  return {
    left: left,
    width: right - left
  };
}

var onlineDialog = function(opt){
  this.tpl = new JSmart(__inline('./onlineDialog.tpl'));
  this.dialog = null;
  this.preview = null;
  this.option = {
    studentUid: null,
    lessonId: null,
    host: '[data-online]',
    classNames: 'online-dialog',
    tplPath: './onlineDialog.tpl',
    url: '/assistantdesk/student/getonlinestat'
  }

  if (opt && opt.tplExtra) {
    this.tplExtra = {};
    Object.assign(this.tplExtra, opt.tplExtra);
  }

  Object.assign(this.option, opt);

  safeCall(this.setTpl, null, this);
};

onlineDialog.prototype.setTpl= function() {
  safeCall(this.setDialog, null, this);
};

onlineDialog.prototype.setDialog = function() {
  var self = this;

  self.dialog = new Dialog({
    classNames: self.option.classNames,
    hasCloseBtn: true,
    title: "到课明细"
  });

  safeCall(self.bindEvent, null, self);
};

onlineDialog.prototype.bindEvent = function() {
  var self = this;

  $('body').on('click', self.option.host, function () {
    var $this = $(this);

    var _option = {
      studentUid: $this.data('studentuid') || self.option.studentUid,
      lessonId: $this.data('lessonid') || self.option.lessonId
    }

    Object.assign(self.option, _option);

    safeCall(self.sendPost, null, self);
  });

};

onlineDialog.prototype.sendPost = function() {
  var self = this,
  _params = {
    studentUid: self.option.studentUid,
    lessonId: self.option.lessonId 
  };

  $.post(self.option.url, _params, function(res){
    if (res && !res.errNo) {
      var data = res.data;
      var realLength = 500;
      var scale = realLength/(data.stop - data.pre);

      var lineHTML = '';
      $.each(data.timeLine, function(i, v){
        var positionData = linePosition(v, data, scale);
        lineHTML += '<i class="line" style="left:'+ positionData.left + 'px;width:' + positionData.width + 'px"></i>'
      });

      self.dialog.setContent({
        content: self.tpl.fetch({
          startLeft: startPosition(data, scale)+'px',
          line: lineHTML,
          data: data,
          pre : formateDate(data.pre),
          start : formateDate(data.start),
          stop : formateDate(data.stop)
        })
      }).show();
    }else{
      Dialog.alert({
        icon: 'ERROR',
        mainMsg: res.errStr
      });
    }
  })
};

module.exports = onlineDialog;