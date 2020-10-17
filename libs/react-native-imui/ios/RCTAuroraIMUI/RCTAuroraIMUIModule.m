//
//  RCTAuroraIMUIModule.m
//  RCTAuroraIMUIModule
//
//  Created by oshumini on 2017/6/1.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import "RCTAuroraIMUIModule.h"

@interface RCTAuroraIMUIModule () {
}

@end

@implementation RCTAuroraIMUIModule
RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

+ (id)allocWithZone:(NSZone *)zone {
  static RCTAuroraIMUIModule *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (id)init {
  self = [super init];
  return self;
}

RCT_EXPORT_METHOD(appendMessages:(NSArray *)messages) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kAppendMessages object: messages];
}

RCT_EXPORT_METHOD(deleteMessage:(NSArray *)messages) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kDeleteMessage object: messages];
}
RCT_EXPORT_METHOD(cleanAllMessages) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kCleanAllMessages object: nil];
}


RCT_EXPORT_METHOD(updateMessage:(NSDictionary *)message) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kUpdateMessge object: message];
}

RCT_EXPORT_METHOD(insertMessagesToTop:(NSArray *)messages) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kInsertMessagesToTop object: messages];
}

RCT_EXPORT_METHOD(scrollToBottom:(BOOL) animate) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kScrollToBottom object: @(animate)];
}

RCT_EXPORT_METHOD(hidenFeatureView:(BOOL) animate) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kHidenFeatureView object: @(animate)];
}


RCT_EXPORT_METHOD(clickRecordLevel:(NSInteger )level) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kRecordLevelNotification object: [NSString stringWithFormat:@"%zd",level]];
}

RCT_EXPORT_METHOD(clickRecordTime:(NSInteger )time) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kRecordLongNotification object: [NSString stringWithFormat:@"%zd",time]];
}

RCT_EXPORT_METHOD(clickGetAtPerson:(NSDictionary *)person) {
    [[NSNotificationCenter defaultCenter] postNotificationName:GetAtPersonNotification object:person];
}
// 此方式没有作用
RCT_EXPORT_METHOD(clickLoadEmotionPages) {
//    [[NSNotificationCenter defaultCenter] postNotificationName:LoadPagesNotification object:nil];
}


RCT_EXPORT_METHOD(tapVoiceBubbleView:(NSString *)messageID) {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"tapVoiceBubbleViewNotification" object:messageID];
}

RCT_EXPORT_METHOD(stopPlayVoice) {
    [[NSNotificationCenter defaultCenter] postNotificationName:kStopPlayVoice object: nil];
}

RCT_EXPORT_METHOD(stopPlayActivity) {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"StopPlayActivity" object: nil];
}

RCT_EXPORT_METHOD(clickScrollEnabled:(BOOL)isScroll) {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"clickScrollEnabled" object: [NSNumber numberWithBool:isScroll]];
}

//RCT_EXPORT_METHOD(showOrigImage:(NSString *)msgID) {
//    [[NSNotificationCenter defaultCenter] postNotificationName:kShowOrigImageNotification object: msgID];
//}

@end
