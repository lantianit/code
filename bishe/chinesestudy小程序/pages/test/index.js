Page({
  data: {
      imagePath: '' // 用于存储选择的图片路径
  },
  // 选择图片的方法
  chooseImage() {
      wx.chooseImage({
          count: 1, // 最多选择1张图片，可根据需求调整
          sizeType: ['original', 'compressed'], // 可选择原图或者压缩图
          sourceType: ['album', 'camera'], // 可从相册或者相机q选择图片
          success: (res) => {
              this.setData({
                  imagePath: res.tempFilePaths[0] // 获取选择的图片临时路径并存储
              });
          }
      });
  },
// 上传图片的方法
async uploadImage() {
  if (!this.data.imagePath) {
      return;
  }
  try {
      const result = await wx.uploadFile({
          url: 'http://127.0.0.1:8080/user/upload', // 后端接收图片上传的接口路径，根据实际情况调整
          filePath: this.data.imagePath, // 要上传的文件路径，即之前选择图片获取到的临时路径
          name: 'file', // 对应后端接收文件参数的名称，需和后端 @RequestPart("file") 对应
          header: {
              'Content-Type': 'multipart/form-data'
          },
          formData: {
            // 可以添加其他表单数据
            user: {
              nickName: this.data.nickName,
              loginName: this.data.registerUserName,
              password: this.data.registerPassword
          },
          },
          success: (res) => {
              const data = JSON.parse(res.data);
              if (data.code === 200) {
                  wx.showToast({
                      title: '图片上传成功',
                      icon: 'success'
                  });
              } else {
                  wx.showToast({
                      title: data.message,
                      icon: 'none'
                  });
              }
          },
          fail: (err) => {
              console.error('图片上传失败', err);
              wx.showToast({
                  title: '图片上传失败，请稍后重试',
                  icon: 'none'
              });
          }
      });
  } catch (err) {
      console.error('图片上传失败', err);
      wx.showToast({
          title: '图片上传失败，请稍后重试',
          icon: 'none'
      });
  }
},
  // 获取文件流及文件名的方法（需根据小程序实际文件系统API调整）
  async getFileStream(filePath) {
      return {
          stream: wx.getFileSystemManager().readFileSync(filePath),
          name: filePath.split('/').pop() // 简单获取文件名，可根据实际情况优化文件名处理逻辑
      };
  }
})