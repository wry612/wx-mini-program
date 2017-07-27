var app = getApp()
var apiUrlPrefix = app.globalData.apiUrlPrefix
var loginApi = apiUrlPrefix+'account/login'
var fundsApi = apiUrlPrefix+'account/fundAllQry'
var holdingApi = apiUrlPrefix+'trade/stockQry'
var payApi = apiUrlPrefix+'trade/entrust'
Page({
  data:{
    // text:"这是一个页面"
    loginText:"登录",
    bindText:"绑定",
    checkbox:{
        name:'bindAccount',
        checked:false,
        value:'绑定账号'
    },
    loginHidden:false,
    checkHidden:true,
    codeTime: 60,
    sendCode:"发送验证码",
    clearIntervalFlag:0,
    forgetPassword:'忘记密码请联系客服重置',
    numberText:'400-928-2200',
    company:'大泰信息技术有限公司 版权所有',
    copyright:'Copyright @2014-2016',
    rights:'All Rights Reserved',
    fund:{},
    holding:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    if(!app.globalData.login){
        wx.setNavigationBarTitle({
          title: '登录'
        })
    }else{
      this.setData({
        loginHidden:true
      })
      this.fundAllQuery()
      this.holdingQuery()
    }    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  formSubmit:function(e){
    var that = this
    var value = e.detail.value
    app.globalData.userId = value.account
    var param = {'password':value.password}
    app.fetchApi(loginApi,param,function(data,err){
      var code = data.head.code
      if(code=='0'){
        wx.setNavigationBarTitle({
          title: '我的'
        })
        app.globalData.sid = data.body.sid
        app.globalData.login = true
        that.setData({
            loginHidden: true
        }) 
        that.fundAllQuery()
        that.holdingQuery()  
      }else{
        console.error('登录失败')
      }    
    })    
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
  fundAllQuery:function(){
    var that = this
    app.fetchApi(fundsApi,{sid:app.globalData.sid},function(data,err){
      console.log(data)
      var code = data.head.code
      if(code=='0'){
        that.setData({
          fund:data.body
        })
        console.error('客户资金查询成功')
      }else{
        console.error('客户资金查询失败')
      }
    })
  },
  holdingQuery:function(){
    var that = this
    app.fetchApi(holdingApi,{sid:app.globalData.sid},function(data,err){
      var code = data.head.code
      if(code=='0'){
        that.setData({
          holding:data.body
        })
        console.error('持仓查询成功')
      }else{
        console.error('持仓查询失败')
      }
    })
  },
  phoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.numberText
    })
  },
  payHolding:function(e){
    var index = e.target.id
    var that = this
    var param = {
      sid:app.globalData.sid,
      entrust_amount: that.data.holding[index].enable_amount,
      entrust_price: that.data.holding[index].last_price,
      action: "2",
      otc_code:that.data.holding[index].otc_code
    }
    app.fetchApi(payApi,param,function(data,err){
      var code = data.head.code
      if(code=='0'){
        that.holdingQuery()
       console.log('平仓成功')
      
      }else{
        console.error('平仓失败')
      }
    })
  },
  reset:function(){
     app.fetchApi('https://192.168.150.63/puerapi/v2/trade/entrustWithdraw',{sid:app.globalData.sid,entrust_no:'14449'},function(data,err){
      var code = data.head.code
      if(code=='0'){
       console.log('撤单成功')
      }else{
        console.error('撤单失败')
      }
    })
  }
})