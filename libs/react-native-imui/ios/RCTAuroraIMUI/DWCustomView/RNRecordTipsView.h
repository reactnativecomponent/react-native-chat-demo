//
//  RNRecordTipsView.h
//  RNRecordButton
//
//  Created by Dowin on 2017/6/28.
//  Copyright © 2017年 Dowin. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, UIRecordSoundStatus) {
    UIRecordSoundStatusRecoding = 0,//正在录音
    UIRecordSoundStatusCancleSending,//取消发送
    UIRecordSoundStatusRecordingShort,//录音时间过短
};

@interface RNRecordTipsView : UIView

@property (nonatomic,assign) CGFloat level;//音量
@property (nonatomic,assign) NSInteger status;
@property (copy, nonatomic) NSString *time;//倒计时
@property (copy, nonatomic) NSString *numFontSize;

@end
