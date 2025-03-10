// 导入request请求工具方法
import {getBaseUrl, requestUtil} from "../../utils/requestUtil.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的分类数据
    leftMenuList:[],
    // 右侧的视频数据
    rightContent:[],
    baseUrl:'',
    // 被点击的左侧的菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },

  // 接口的返回数据
  Cates:[],

  // 获取左侧分类数组和右侧视频数据数组
  async getCates(){
    console.log("getCates")
    const result=await requestUtil({url: "/bigType/getBigTypeVideo"});
    const baseUrl=getBaseUrl();
    console.log("getCates:"+result)
    this.Cates=result.message;
    // 把接口的数据存入本地缓存
    wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

    console.log(this.Cates)
    let leftMenuList=this.Cates.map(v=>v.name);
    let rightContent=this.Cates[0].bigTypeVideoList;
    this.setData({
      leftMenuList,
      rightContent,
      baseUrl
    })
    console.log("leftMenuList")
    console.log(this.data.leftMenuList)
    console.log("rightContent")
    console.log(this.data.rightContent)
  },

  // 点击视频标题跳转到视频页面
  handleVideoJump(e){
    const {indexVideo} = e.currentTarget.dataset;
    console.log("indexVideo" + indexVideo)
    const app = getApp();
    app.globalData.indexVideo = indexVideo;
    wx.navigateTo({
      url: '/pages/videoPage/index'
    })
  },

  // 获取商品大类数据 从首页跳转过来的
  async getCates2(index){
    console.log("getCates")
    const result=await requestUtil({url: "/bigType/getBigTypeVideo"});
    const baseUrl=getBaseUrl();
    console.log("getCates:"+result)
    this.Cates=result.message;

    // 把接口的数据存入本地缓存
    wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})

    let leftMenuList=this.Cates.map(v=>v.name);
    let rightContent=this.Cates[index].bigTypeVideoList;
    this.setData({
      leftMenuList,
      rightContent,
      baseUrl,
      currentIndex:index
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e){
    let index=e.currentTarget.dataset.index;
    let rightContent=this.Cates[index].bigTypeVideoList;
  
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    const Cates=wx.getStorageSync('cates');
    if(!Cates){
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*10){
        this.getCates();
      }else{
        console.log("可以使用旧数据");
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.name);
        let rightContent=this.Cates[0].bigTypeVideoList;
        const baseUrl=getBaseUrl();
        this.setData({
          leftMenuList,
          rightContent,
          baseUrl
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")

    const app=getApp();
    var index=app.globalData.index;
    console.log("index:"+index)
    if(index!=-1){
      this.getCates2(index);
     
      // 用完后重置
      app.globalData.index=-1
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})