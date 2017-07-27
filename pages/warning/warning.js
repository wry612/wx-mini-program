var app = getApp()
var loginApi = 'https://192.168.150.63/jmeapiua/v1/openservice/loginopenaccount'
var warningApi = 'https://192.168.150.63/jmeapi/v3/warning/searchwarningset'
var delUrl = 'http://'
Page({
  data: {
    // text:"这是一个页面"
    warningList: [],
    loginHidden:false,
    loginText:"登录",
    bindText:"绑定",
    checkbox:{
        name:'bindAccount',
        checked:false,
        value:'绑定账号'
    },
    checkHidden:true,
    codeTime: 60,
    sendCode:"发送验证码",
    clearIntervalFlag:0,
    forgetPassword:'忘记密码请联系客服重置',
    numberText:'400-928-2200',
    company:'大泰信息技术有限公司 版权所有',
    copyright:'Copyright @2014-2016',
    rights:'All Rights Reserved'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if(!app.globalData.login){
        wx.setNavigationBarTitle({
          title: '登录'
        })
    }else{
      this.setData({
        loginHidden:true
      })
      this.warningQuery()
    }
  },
  checkChange:function(){ 
    console.error(this.data.checkHidden)   
    this.setData({
        checkHidden :!this.data.checkHidden
    })
  },
  sendCode:function(){
    var that = this
    this.data.clearIntervalFlag = setInterval(function(){
      console.log(that.data)
        var text = that.data.codeTime--;
        text += 's'
        if(that.data.codeTime<0){
          clearInterval(that.data.clearIntervalFlag)
          that.data.codeTime = 60
          text = '重新发送验证码'
        }
        that.setData({
            sendCode :text
        })
      },1000)
  },
  formSubmit:function(e){
    var that = this
    var value = e.detail.value
    app.globalData.userId = value.account
    var param = {
      userMobile:value.account,
      'password':value.password
    }
    app.fetchWarningApi(loginApi,param,function(data,err){
      var code = data.head.code
      if(code=='0'){
        wx.setNavigationBarTitle({
          title: '预警'
        })
        app.globalData.warningSid = data.body.openAccountSid
        app.globalData.userWarningId = data.body.userId 
        app.globalData.login = true
        that.setData({
            loginHidden: true
        }) 
         that.warningQuery()
      }else{
        console.error('登录失败')
      }    
    })    
  },
  warningQuery: function () {
    var that = this
    var pararm = {
      sid:app.globalData.warningSid,
      'accountNo':app.globalData.userWarningId,
      'userType':'puer',
      'accountType':'main'
    } 
    app.fetchWarningApi(warningApi, pararm, function (data, err) {
      console.log(data)
      var code = data.head.code
      if (code == '0') {
        that.setData({
          warningList: data.body.items
        })
      } else {
        console.error('预警信息获取失败')
      }
    })
  },
  delete: function (e) {
    var id = e.target.id
    var index = 0;
    var list = this.data.warningList
    for (var i = 0; i < list.length; i++) {
      if (list[i].itemId.toString() == id) {
        index = i;
      }
    }
    list.splice(index, 1);
    //app.fetchApi(deleteUrl, function(err, data){
    //更新数据
    this.setData({ warningList: list })
    // })
  }
})