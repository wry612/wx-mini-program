//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.version = res.version
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
              data: {
                code: res.code
              },
              success:function(res){
                that.setData({
                  globalData:{
                    openId:res.data.openid,
                    secciosession:res.data.session_key
                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    apiUrlPrefix: 'https://192.168.150.63/puerapi/v2/',//'https://appclient.jme.com:8093/puerapi/v2/',
    userInfo: null,
    login: false,
    warningLogin:false,
    userWarningId:'',
    userId: '',
    userMobile:'',
    version: '',
    sid: '',
    warningSid:'',
    openId:'',
    sectionKey:'',
  },
  // ========== 应用程序全局方法 ==========
  fetchWarningApi: function (apiUrl, parameter, callback) {
    // return callback(null, top250)
    var that = this
    wx.request({
      url: apiUrl,
      data: parameter,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'appVer':that.globalData.version,
        'appId':'jmeapp',
        'appType': 'ios',
        'reqfrom': 'dtappios',
        'source':'wx',      
        'userId': that.globalData.userWarningId,
      },
      success(res) {
        callback(res.data)
      },
      fail(e) {
        console.log(e)
      }
    })
  },
   // ======== 应用程序全局方法 ==========
  fetchApi: function (apiUrl, parameter, callback) {
    // return callback(null, top250)
    var that = this
    wx.request({
      url: apiUrl,
      data: parameter,
      method: 'POST',
      header: {
        'content-type': 'application/json',     
        'appType': 'pc',
        'reqfrom': 'yxsys',
        'user_id': that.globalData.userId,        
        'appVer': that.globalData.version,
        //'sid': that.globalData.sid,
        "reqTime": "1459502478792"
      },
      success(res) {
        callback(res.data)
      },
      fail(e) {
        console.log(e)
      }
    })
  },
})