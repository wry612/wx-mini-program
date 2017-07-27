var app = getApp()
var goodsApi = 'https://appclient.jme.com:8092/jmeapphqapi/puer/hq/v1/realbysdk/1-false-'
Page({
  data: {
    goodsDetails: {},
    tab1: 'tab-item-active',
    tab2: '',
    tab3: '',
    tab4: '',
    isZx: false,
    zxList: new Array()
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    var prodCode = options.prodCode
    console.info(prodCode)
    that.quotationsQuery(prodCode)
    that.isZixuan(prodCode)
  },
  isZixuan: function (prodCode) {
    var that = this
    wx.getStorage({
      key: 'zxGoods',
      success: function (res) {
        var data = res.data.zxList
        console.log(data)
        that.setData({
          zxList: data
        })
        if (data) {
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].prodCode == prodCode) {
                that.setData({
                  isZx: true
                })
                break
              }
            }
            console.log('自选商品读取成功')
          } else {
            that.setData({
              haveZx: false
            })
            console.error('没有自选商品')
          }
        }else{
           that.setData({
              zxList: []
            })
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
  changeChoose: function () {
    var data = this.data
    var code = this.data.goodsDetails.prodCode
    console.log(data)
    data.isZx = !this.data.isZx
    this.setZixuan(code, data.isZx)
  },
  setZixuan: function (code, zx) {
    var that = this
    if (zx) {console.error('持续添加')
      that.data.zxList.push({
        'prodCode': code
      })
    } else {
      var list = that.data.zxList
      for (var i = 0; i < list.length; i++) {
        if (list[i].prodCode == code) {
          that.data.zxList.splice(i, 1)
          break
        }
      }
    }
    console.log(that.data.zxList)
    wx.setStorage({
      key: 'zxGoods',
      data: {
        zxList: that.data.zxList
      },
      success: function (res) {
        that.setData({
          isZx: zx
        })
        console.log('添加自选成功')
      },
      fail: function (e) {
        console.log('添加自选失败')
      }
    })
  },
  chartChange: function (e) {
    console.log(e)
    var id = e.target.id;
    switch (id) {
      case 'chartMinute':
        this.setData({
          tab1: 'tab-item-active',
          tab2: '',
          tab3: '',
          tab4: ''
        })
        break;
      case 'chartDay':
        this.setData({
          tab1: '',
          tab2: 'tab-item-active',
          tab3: '',
          tab4: ''
        })
        break;
      case 'chartWeek':
        this.setData({
          tab1: '',
          tab2: '',
          tab3: 'tab-item-active',
          tab4: ''
        })
        break;
      case 'chartMonth':
        this.setData({
          tab1: '',
          tab2: '',
          tab3: '',
          tab4: 'tab-item-active'
        })
        break;
    }
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
  quotationsQuery: function (prodCode) {
    var that = this
    var api = goodsApi + prodCode + '-'
    app.fetchApi(api, {}, function (data, err) {
      console.log(data)
      var code = data.head.code
      if (code == '0') {
        var goods = data.body[0]
        goods.businessBalance = that.fixFund(goods.businessBalance)
        goods.businessAmount = that.fixFund(goods.businessAmount)
        goods.businessAmountIn = that.fixFund(goods.businessAmountIn)
        goods.businessAmountOut = that.fixFund(goods.businessAmountOut)
        goods.marketValue = that.fixFund(goods.marketValue)
        goods.circulationValue = that.fixFund(goods.circulationValue)
        that.setData({
          goodsDetails: goods
        })
      } else {
        console.error('市场行情查询失败')
      }
    })
  }
})
