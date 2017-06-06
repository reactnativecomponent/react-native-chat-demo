## react-native-chat-demo
网易云信IM示例
## 如何使用
### 1.注册网易云信帐号
注册地址 [https://app.netease.im/regist](https://app.netease.im/regist)
### 2.修改配置
#### 2.1 ios (AppDelegate.m)
 ```
[[NIMSDK sharedSDK] registerWithAppID:@"云信appId" cerName:@"证书名称"];
 ```
##### 注意IOS需要安装cocoapods,进入`react-native-chat-demo/ios` 目录执行 `pod install`
#### 2.2 android (app/build.gradle)
 ```
  manifestPlaceholders = [
     "NIM_KEY": ""//云信appId
  ]
 ```
## 截图

|会话列表|聊天界面|会话详情|
|:--:|:--:|:--:|
|![](https://github.com/reactnativecomponent/react-native-chat-demo/blob/master/screenshots/chatList.png)|![](https://github.com/reactnativecomponent/react-native-chat-demo/blob/master/screenshots/chat.png)|![](https://github.com/reactnativecomponent/react-native-chat-demo/blob/master/screenshots/sessionDetail.png)|
|选择联系人|好友列表|好友详情|
|![](https://github.com/reactnativecomponent/react-native-chat-demo/blob/master/screenshots/selectUser.png)|![](https://github.com/reactnativecomponent/react-native-chat-demo/blob/master/screenshots/friendList.png)|![](https://github.com/reactnativecomponent/react-native-chat-demo/blob/master/screenshots/friendDetail.png)|

## 云信IM配置请看
[react-native-netease-im](https://github.com/reactnativecomponent/react-native-netease-im)

## 感谢
- [react-native-navigation](https://wix.github.io/react-native-navigation/#/)
- [im_rn](https://github.com/GoBelieveIO/im_rn)
- [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat)
