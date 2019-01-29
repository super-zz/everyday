drop (e) {
  e.preventDefault();
  // 判断是否是目标区域
  if (!(e.target && this.dragTarget.contains(e.target))) {
    this.$message('拖拽上传文件请释放到中间可编辑区域内~');
    return false;
  }

  const that = this;
  let dataTransfer = e.dataTransfer;
  getFile(dataTransfer);

  // 读取多个文件为异步操作
  async function getFile (dataTransfer) {
    let fileObj = {
      'image': [],
      'video': [],
      'audio': []
    };
    let items;
    let files;
    let file;
    let item;

    items = dataTransfer.items;
    files = dataTransfer.files;

    // 页面元素拖拽也会触发上传逻辑 暂时由此属性判断
    if (!files.length) {
      that.$message.error('仅支持图片，MP4视频，MP3音频拖拽上传~');
      return;
    }

    for (let i = 0, len = files.length; i < len; i++) {
      file = files[ i ];
      item = items && items[ i ];

      if (item && item.webkitGetAsEntry && item.webkitGetAsEntry().isDirectory) {
        await traverseDirectoryTree(item.webkitGetAsEntry(), fileObj);
      } else {
        that.addFileResult(file, fileObj);
      }
    }
    // 如果上传的文件或是文件夹都不符合上传类型则不触发上传逻辑
    if (that.handleComputedUploadNum(fileObj).totalFileNum === 0) {
      return false;
    }
    // 获取最终符合类型与大小等约束条件的拖拽文件对象，并处理上传逻辑
    that.handleDragUploadFiles(fileObj);
  }
  function traverseDirectoryTree (entry, fileObj) {
    return new Promise((resolve, reject) => {
      if (entry.isFile) {
        entry.file(function (file) {
          // 过滤文件类型 只允许 图片/视频/音频类型
          that.addFileResult(file, fileObj);
          resolve();
        }, function (e) {
          that.$message.error('文件读取失败' + e);
        });
      } else if (entry.isDirectory) {
        entry.createReader().readEntries(async function (entries) {
          let len = entries.length;
          let promises = [];

          for (let i = 0; i < len; i++) {
            promises.push(await traverseDirectoryTree(entries[ i ], fileObj));
          }
          // 全部读取成功之后回到上个函数体
          Promise.all(promises).then(() => {
            resolve();
          });
        });
      }
    });
  }
},
// 存储可上传文件
addFileResult (file, fileObj) {
  if (file.type.match(/^image\//i)) {
    this.beforeUploadVerify('image', file) && fileObj.image.push(file);
  } else if (file.type === 'video/mp4') {
    this.beforeUploadVerify('video', file) && fileObj.video.push(file);
  } else if (file.type === 'audio/mp3') {
    this.beforeUploadVerify('audio', file) && fileObj.audio.push(file);
  } else {
    this.$message.error(file.name + '导入失败! 仅支持图片，MP4视频，MP3音频拖拽上传~');
  }
},
// 拖拽上传前校验 (暂时只检验文件大小)
beforeUploadVerify (type, file) {
  let flag = false;
  switch (type) {
    case 'image':
      const imageType = (file.type === 'image/jpeg'
        || file.type === 'image/jpg'
        || file.type === 'image/png'
        || file.type === 'image/gif');
      const imageLimit = file.size / 1024 / 1024 <= 2;
      if (!imageType) {
        this.$message.error(file.name + '导入失败! 上传图片只能是 jpg/jpeg/png/gif 格式!');
        flag = false;
        break;
      }
      if (!imageLimit) {
        this.$message.error(file.name + '导入失败! 请选择2M以内的图片');
        flag = false;
        break;
      }
      flag = true;
      break;
    case 'video':
      const videoLimit = file.size / 1024 / 1024 <= 30;
      if (!videoLimit) {
        this.$message.error(file.name + '导入失败! 请选择30M以内的视频');
        flag = false;
        break;
      }
      flag = true;
      break;
    case 'audio':
      const audioLimit = file.size / 1024 / 1024 <= 30;
      if (!audioLimit) {
        this.$message.error(file.name + '导入失败! 请选择30M以内的音频');
        flag = false;
        break;
      }
      flag = true;
      break;
  }
  return flag;
},
// 计数image、video、audio各有多少个可上传的文件
handleComputedUploadNum (fileObj) {
  let imageFileNum = 0;
  let videoFileNum = 0;
  let audioFileNum = 0;
  let totalFileNum = 0;

  for (let key in fileObj) {
    let len = fileObj[key].length;
    if (!len) { continue; }
    if (key === 'image') {
      imageFileNum = len;
    } else if (key === 'video') {
      videoFileNum = len;
    } else if (key === 'audio') {
      audioFileNum = len;
    }
  }

  totalFileNum = imageFileNum + videoFileNum + audioFileNum;

  const _dragFileObj = {
    totalFileNum,
    imageFileNum,
    videoFileNum,
    audioFileNum
  };
  Object.assign(this.dragFileObj, _dragFileObj);

  return _dragFileObj;
},
// 处理拖拽上传 此函数只会在存在可上传文件时调用
handleDragUploadFiles (fileObj) {
  let promises = [];
  const { imageFileNum, videoFileNum, audioFileNum } = this.dragFileObj;

  bus.$emit('emitLoading', true);

  if (imageFileNum) {
    for (let i = 0; i < imageFileNum; i++) {
      promises.push(this.uploadImg(fileObj['image'][i]));
    }
  }
  if (videoFileNum) {
    for (let i = 0; i < videoFileNum; i++) {
      if (this.currentPage.source === 'hdkt') continue;
      promises.push(this.uploadMedia(fileObj['video'][i], 'video'));
    }
  }
  if (audioFileNum) {
    for (let i = 0; i < audioFileNum; i++) {
      if (this.currentPage.source === 'hdkt') continue;
      promises.push(this.uploadMedia(fileObj['audio'][i], 'audio'));
    }
  }

  Promise.all(promises).then(() => {
    // 加一个延迟 否则图片还没渲染完 loading就不见了
    setTimeout(() => {
      bus.$emit('emitLoading', false);
      this.$message.success(`成功上传了
        ${imageFileNum ? imageFileNum + '张图片文件 ' : ''}
        ${videoFileNum ? videoFileNum + '个视频文件 ' : ''}
        ${audioFileNum ? audioFileNum + '个音频文件 ' : ''}
        `);
    }, 200);
  });
},