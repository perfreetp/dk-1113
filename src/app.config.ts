export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/chat/index',
    'pages/order/index',
    'pages/profile/index',
    'pages/publish/index',
    'pages/user-detail/index',
    'pages/chat-detail/index',
    'pages/order-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ff6b6b',
    navigationBarTitleText: '一小时朋友',
    navigationBarTextStyle: 'white',
    backgroundColor: '#fff5f5'
  },
  tabBar: {
    color: '#636e72',
    selectedColor: '#ff6b6b',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/chat/index',
        text: '会话'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
