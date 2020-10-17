//
//  DWAudioRecorderManager.h
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/22.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>


@interface DWAudioRecorderManager : NSObject
/// 实例化单例
+ (DWAudioRecorderManager *)shareManager;


#pragma mark - 音频处理-录音

/// 开始录音
- (void)audioRecorderStartWithFilePath:(NSString *)filePath;

/// 停止录音
- (void)audioRecorderStop;

//取消录音
- (void)audioRecorderCancel;

/// 录音时长
- (NSTimeInterval)durationAudioRecorderWithFilePath:(NSString *)filePath;

#pragma mark - 音频处理-播放/停止

/// 音频开始播放或停止
- (void)audioPlayWithFilePath:(NSString *)filePath;

/// 音频播放停止
- (void)audioStop;


@end
