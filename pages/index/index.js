//index.js
//获取应用实例
var app = getApp()
var marketApi = 'https://appclient.jme.com:8092/jmeapphqapi/puer/hq/v1/realbysdk/1-false-399001-'
var quotationsApi = 'https://appclient.jme.com:8092/jmeapphqapi/puer/hq/v1/realbysdk/1-false-'
Page({
  data: {
    // text:"这是一个页面"
    funds: {},
    quotations: [],
    listHeader: {
      name: '自选商品名称',
      price: '现价',
      rate: '涨幅'
    },
    sortImg: 'icon-sort.png',
    haveZx: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    that.marketQuery()
    that.getZixuan()
  },
  getZixuan: function () {
    var that = this
    wx.getStorage({
      key: 'zxGoods',
      success: function (res) {
        var data = res.data.zxList
        console.log(data)
        if (data) {
          if (data.length > 0) {
            var str = data[0].prodCode
            for (var i = 1; i < data.length; i++) {
              str += ',' + data[i].prodCode
            }
            str += '-'
            that.quotationsQuery(str)
            console.log('自选商品读取成功')
          } else {
            that.setData({
              haveZx: false
            })
            console.error('没有自选商品')
          }
        }

      },
      fail: function (e) {
        that.setData({
          haveZx: false
        })
        console.error('自选商品读取失败')
      }
    })
  },
  marketQuery: function () {
    var that = this
    var param = {}
    app.fetchApi(marketApi, {}, function (data, err) {
      console.log(data)
      var code = data.head.code
      if (code == '0') {
        var fundsData = data.body[0]
        var businessBalance = fundsData.businessBalance
        businessBalance = that.fixFund(businessBalance)
        fundsData.businessBalance = businessBalance
        that.setData({
          funds: fundsData
        })
      } else {
        console.error('市场行情查询失败')
      }
    })
  },
  fixFund: function (num) {
    if (num > 100000000) {
      var numStr = (num / 10000000).toFixed(2).toString()
      numStr.substring(0, numStr.indexOf('.'))
      numStr += '亿'
      return numStr
    } else if (num > 10000 && num < 1000000000) {
      var numStr = (num / 10000).toFixed(2).toString()
      numStr.substring(0, numStr.indexOf('.'))
      numStr += '万'
      return numStr
    } else {
      return num
    }
  },
  quotationsQuery: function (code) {
    var that = this
    var api = quotationsApi + code
    app.fetchApi(api, {}, function (data, err) {
      console.log(data)
      var code = data.head.code
      if (code == '0') {
        that.setData({
          quotations: data.body,
          haveZx: true
        })
      } else {
        that.setData({
          haveZx: false
        })
        console.error('自选商品查询失败')
      }
    })
  }
})
