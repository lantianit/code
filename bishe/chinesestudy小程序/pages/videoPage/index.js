// 导入request请求工具方法
import {getBaseUrl, requestUtil} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBoldItem: 'detail', // 初始设置加粗的菜单项为“详情”
    baseUrl: '',
    scrollTop: 0,
    video: '',
    comments: [],
    commentInput: '',
    user: ''
  },
  onLoad: function (options) {
    const videoId = options.videoId;
    // 初始化获取视频详细信息
    this.getVideoDetail(videoId);
  },
  handleClick: function (e) {
    const clickedItem = e.currentTarget.dataset.item;
    this.setData({
        currentBoldItem: clickedItem, // 更新当前加粗的菜单项标识
        scrollTop: 0 // 每次点击菜单时可将滚动位置重置为顶部（可根据实际需求调整）
    });
},
  // 获取视频信息
  async getVideoDetail(videoId){
    const commentResult=await requestUtil({url: "/video/getVideoAndCommentByVideoId",data:{videoId}});
    const formatComments = commentResult.message.map(comment => {
      const date = new Date(comment.createTime);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);  // 月份从0开始计数，需要加1并补0
      const day = ('0' + date.getDate()).slice(-2);
      const hour = ('0' + date.getHours()).slice(-2);
      const minute = ('0' + date.getMinutes()).slice(-2);
      comment.createTime = `${year}年${month}月${day}日${hour}时${minute}分`;
      return comment;
    });
    const videoResult = await requestUtil({url: "/video/getVideoByVideoId",data:{videoId}});
    const baseUrl=getBaseUrl();
    this.setData({
      baseUrl,
      video: videoResult.message,
      comments: formatComments
    })
    console.log(this.data.video);
    console.log(this.data.comments);
  },
      // 发送评论的方法
      async sendComment() {
        const app = getApp();
        if (app.globalData.token === '') {
            wx.showToast({
              title: '请先登录',
              icon: 'none'
          });
          return;
        }
        await this.getUserByToken();
        const comment = this.data.commentInput;
        if (!comment) {
            wx.showToast({
                title: '请输入评论内容',
                icon: 'none'
            });
            return;
        }
        console.log("当前用户")
        console.log(this.data.user);
        const userId = this.data.user.userId;
        const videoId = this.data.video.videoId;
        const commentData = {
            videoId,
            userId,
            comment
        };
        try {
            const result = await requestUtil({
                url: '/video/addComment',
                method: 'POST',
                data: commentData
            });
            if (result) {
                // 评论发送成功后，刷新评论列表（重新获取评论数据）
                await this.getVideoDetail(videoId);
                wx.showToast({
                    title: '评论发送成功',
                    icon: 'success'
                });
            } else {
                wx.showToast({
                    title: '评论发送失败',
                    icon: 'none'
                });
            }
        } catch (error) {
            console.error('发送评论出错:', error);
            wx.showToast({
                title: '评论发送出现异常，请稍后再试',
                icon: 'none'
            });
        }
    },

    // 处理评论输入框内容变化的方法示例
    onCommentInput(e) {
        this.setData({
            commentInput: e.detail.value
        });
    },
    async getUserByToken() {
      const app = getApp();
      const token = app.globalData.token;
      const result = await requestUtil({
        url: '/user/getUserByToken',
        method: "GET",
        data: { token }
      });
      this.setData({
        user: result.message
      });
      console.log("用户是否赋值");
      console.log(this.data.user);
    },
})