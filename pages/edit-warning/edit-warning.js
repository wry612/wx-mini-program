var app = getApp()
var getWarningUrl = 'http://192.168.150.63:8094/jmeapi/v3/warning/searchwarningset'
var goodsApi = 'https://appclient.jme.com:8092/jmeapphqapi/puer/hq/v1/realbysdk/1-false-'
var setWarningUrl = 'http://192.168.150.63:8094/jmeapi/v3/warning/editwarningset'
var warningDatas = {
  itemId: '600100',
  itemName: '六大茶山曼囡2015',
  lastpxge: '20.00',
  lastpxgeState: 'on',
  lastpxle: '40.00',
  lastpxleState: 'on',
  pxchangeratege: '10',
  pxchangerategeState: 'on',
  pxchangeratele: '10',
  pxchangerateleState: 'on'
}
Page({
  data: {
    // text:"这是一个页面"
    code: '',
    goodsDetails:{},
    warningData: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      code: options.warnId
    })
  },
  onShow: function () {
    // 页面显示
    this.quotationsQuery(this.data.code)
    this.warningQuery()
  },
  warningQuery: function () {
    this.setData({
      warningList: warningDatas
    })

    // var that = this
    // var pararm = {
    //   'accountNo':app.globalData.userId,
    //   'userType':'puer',
    //   'accountType':'main'
    // } 
    // app.fetchApi(getWarningUrl, pararm, function (data, err) {
    //   console.log(data)
    //   var code = data.head.code
    //   if (code == '0') {
    // var items = data.body.items
    // for (var i = 0; i < items.length; i++) {
    //   if (items[i].itemId == that.data.code){
    //     that.setData({
    //       warningList: items[i]
    //     })
    //     break
    //   }
    //     }
    //     
    //   } else {
    //     console.error('预警信息获取失败')
    //   }
    // })
  },
  quotationsQuery: function (prodCode) {
    var that = this
    var api = goodsApi + prodCode + '-'
    app.fetchApi(api, {}, function (data, err) {
      console.log(data)
      var code = data.head.code
      if (code == '0') {
        that.setData({
          goodsDetails: data.body[0]
        })
      } else {
        console.error('市场行情查询失败')
      }
    })
  },
  saveWarning: function () {
    var that = this
    //app.fetchApi(setWarningUrl, function(data, err){
    //提交数据
    console.log('save')
    wx.navigateBack()
    // })
  }
})