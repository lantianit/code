import { requestUtil, getBaseUrl } from '../../utils/requestUtil.js';

Page({
  data: {
    baseUrl: '',
    user: '',
    loginStatus: '',
    thisToken: '',
  },

  // 提取公共逻辑到该函数，用于判断登录状态并执行相应操作
  checkLoginAndLoadData() {
    const app = getApp();
    const baseUrl = getBaseUrl();
    const loginStatus = app.globalData.isLoggedIn;
    this.setData({
      baseUrl,
    });
    if (!loginStatus) {
      console.log("准备跳转");
      wx.redirectTo({
        url: '/pages/login/login'
      });
    } else {
      this.loadUserData();
    }
  },

  async loadUserData() {
    // 先获取用户信息
    await this.getUserByToken();
    console.log("当前用户信息：");
    // 获取用户信息成功后再获取视频详情信息，传递正确的用户ID参数
    const userId = this.data.user.userId;
    await this.getVideoDetail(userId);
  },

  async getUserByToken() {
    const app = getApp();
    const token = app.globalData.token;
    console.log("当前的token是", token);
    const result = await requestUtil({
      url: '/user/getUserByToken',
      method: "GET",
      data: { token }
    });
    console.log("当前的result是");
    console.log(result);
    this.setData({
      user: result.message
    });
  },

  async onLoad() {
    this.checkLoginAndLoadData();
  },

  async onShow() {
    this.checkLoginAndLoadData();
  },

  async getVideoDetail(userId) {
    const userResult = await requestUtil({
      url: "/user/getUserById",
      data: { userId }
    });
    const user = userResult.data;
    console.log("userResult.data");
    console.log(userResult.data);
    this.setData({
      user: user
    });
    console.log("看一下当前的用户信息是否存在");
    console.log(this.data.user);
  },

  // 处理退出账号的函数
  handleLogout() {
    const app = getApp();
    // 将全局登录状态设置为false，表示已退出登录
    app.globalData.isLoggedIn = false;
    // 跳转到登录页面，可根据实际需求调整跳转方式和页面路径
    wx.redirectTo({
      url: '/pages/login/login'
    });
  }
})