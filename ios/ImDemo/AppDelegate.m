/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <NIMSDK/NIMSDK.h>
#import "RCCManager.h"
#import "NTESSDKConfigDelegate.h"
#import "DWCustomAttachmentDecoder.h"

@interface AppDelegate ()

@property (nonatomic,strong) NTESSDKConfigDelegate *sdkConfigDelegate;

@end
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  
  //在注册 NIMSDK appKey 之前先进行配置信息的注册，如是否使用新路径,是否要忽略某些通知，是否需要多端同步未读数
  
  self.sdkConfigDelegate = [[NTESSDKConfigDelegate alloc] init];
  [[NIMSDKConfig sharedConfig] setDelegate:self.sdkConfigDelegate];
  [[NIMSDKConfig sharedConfig] setShouldSyncUnreadCount:YES];
  
  //appkey 是应用的标识，不同应用之间的数据（用户、消息、群组等）是完全隔离的。
  //如需打网易云信 Demo 包，请勿修改 appkey ，开发自己的应用时，请替换为自己的 appkey 。
  //并请对应更换 Demo 代码中的获取好友列表、个人信息等网易云信 SDK 未提供的接口。
  [[NIMSDK sharedSDK] registerWithAppID:@"8cafb31bb1c3750349340dec765df1c5" cerName:@"推送证书名称"];
    //注册自定义消息的解析器
  [NIMCustomObject registerCustomDecoder:[DWCustomAttachmentDecoder new]];
  [self registerAPNs];
  
  return YES;
}
#pragma mark - misc
- (void)registerAPNs
{
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  
  UIUserNotificationType types = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types
                                                                           categories:nil];
  [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
}
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [[NIMSDK sharedSDK] updateApnsToken:deviceToken];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo{
  NSLog(@"fail to get :%@",userInfo);
}
- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"fail to get apns token :%@",error);
}
- (void)applicationDidEnterBackground:(UIApplication *)application {
  NSInteger count = [[[NIMSDK sharedSDK] conversationManager] allUnreadCount];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:count];
}
@end
