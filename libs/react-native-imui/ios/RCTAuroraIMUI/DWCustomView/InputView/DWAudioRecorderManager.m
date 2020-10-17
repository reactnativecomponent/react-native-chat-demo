//
//  DWAudioRecorderManager.m
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/22.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import "DWAudioRecorderManager.h"
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

#define maxRecordTime 60

@interface DWAudioRecorderManager()<AVAudioRecorderDelegate>{
    CGFloat timeCount;
}

@property (nonatomic, strong) NSTimer *audioRecorderTimer;               // 录音音量计时器
@property (nonatomic, strong) NSMutableDictionary *audioRecorderSetting; // 录音设置
@property (nonatomic, strong) AVAudioRecorder *audioRecorder;            // 录音
@property (nonatomic, strong) AVAudioPlayer *audioPlayer;                // 播放
@property (nonatomic, assign) double audioRecorderTime;                  // 录音时长
@property (copy, nonatomic) NSString *filePath;
    
@end


@implementation DWAudioRecorderManager

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        // 参数设置 格式、采样率、录音通道、线性采样位数、录音质量
        self.audioRecorderSetting = [NSMutableDictionary dictionary];
        [self.audioRecorderSetting setValue:[NSNumber numberWithInt:kAudioFormatMPEG4AAC] forKey:AVFormatIDKey];
        [self.audioRecorderSetting setValue:[NSNumber numberWithInt:11025] forKey:AVSampleRateKey];
        [self.audioRecorderSetting setValue:[NSNumber numberWithInt:2] forKey:AVNumberOfChannelsKey];
        [self.audioRecorderSetting setValue:[NSNumber numberWithInt:16] forKey:AVLinearPCMBitDepthKey];
        [self.audioRecorderSetting setValue:[NSNumber numberWithInt:AVAudioQualityLow] forKey:AVEncoderAudioQualityKey];
    }
    return self;
}

/// 录音单例
+ (DWAudioRecorderManager *)shareManager
{
    static DWAudioRecorderManager *staticAudioRecorde;
    static dispatch_once_t once;
    dispatch_once(&once, ^{
        staticAudioRecorde = [[self alloc] init];
    });
    
    return staticAudioRecorde;
}

// 内存释放
- (void)dealloc
{
    // 内存释放前先停止录音，或音频播放
    [self audioStop];
    [self audioRecorderStop];
    
    // 内存释放
    if (self.audioRecorderTime)
    {
        [self.audioRecorderTimer invalidate];
        self.audioRecorderTimer = nil;
    }
    
    if (self.audioRecorderSetting)
    {
        self.audioRecorderSetting = nil;
    }
    
    if (self.audioRecorder)
    {
        self.audioRecorder = nil;
    }
    
    if (self.audioPlayer)
    {
        self.audioPlayer = nil;
    }
}

#pragma mark - 音频处理-录音

/// 开始录音
- (void)audioRecorderStartWithFilePath:(NSString *)filePath
{
    self.filePath = filePath;
    // 生成录音文件
    NSURL *urlAudioRecorder = [NSURL fileURLWithPath:filePath];
    self.audioRecorder = [[AVAudioRecorder alloc] initWithURL:urlAudioRecorder settings:self.audioRecorderSetting error:nil];
    
    // 开启音量检测
    [self.audioRecorder setMeteringEnabled:YES];
    [self.audioRecorder setDelegate:self];
    
    if (self.audioRecorder)
    {
        // 录音时设置audioSession属性，否则不兼容Ios7
        AVAudioSession *recordSession = [AVAudioSession sharedInstance];
        [recordSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
        [recordSession setActive:YES error:nil];
        
        if ([self.audioRecorder prepareToRecord])
        {
            [self.audioRecorder record];
            
            //录音音量显示 75*111
//            AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
//            UIView *view = [delegate window];
//            
//            self.imgView = [[UIView alloc] initWithFrame:CGRectMake((view.frame.size.width - 120) / 2, (view.frame.size.height - 120) / 2, 120, 120)];
//            [view addSubview:self.imgView];
//            [self.imgView.layer setCornerRadius:10.0];
//            [self.imgView.layer setBackgroundColor:[UIColor blackColor].CGColor];
//            [self.imgView setAlpha:0.8];
//            
//            self.audioRecorderVoiceImgView = [[UIImageView alloc] initWithFrame:CGRectMake((self.imgView.frame.size.width - 60) / 2, (self.imgView.frame.size.height - 660 * 111 / 75) / 2, 60, 660 * 111 / 75)];
//            [self.imgView addSubview:self.audioRecorderVoiceImgView];
//            [self.audioRecorderVoiceImgView setImage:[UIImage imageNamed:@"record_animate_01.png"]];
//            [self.audioRecorderVoiceImgView setBackgroundColor:[UIColor clearColor]];
            
            timeCount = 0;
            // 设置定时检测
            [self.audioRecorderTimer invalidate];
            self.audioRecorderTimer = nil;
            self.audioRecorderTimer = [NSTimer scheduledTimerWithTimeInterval:0.05 target:self selector:@selector(detectionVoice) userInfo:nil repeats:YES];
        }
    }
}

/// 录音音量显示
- (void)detectionVoice
{
    timeCount = timeCount + 0.05;
    NSLog(@"----timeCount:%f",timeCount);
//    NSTimeInterval recordTime = [self.audioRecorder currentTime];
//    NSLog(@"timeCount:%f  ----recordTime:%f",timeCount,recordTime);
    if (timeCount < maxRecordTime) {
        if (timeCount > 49) {
            [[NSNotificationCenter defaultCenter]postNotificationName:@"RecordLongNotification" object:@(maxRecordTime - timeCount)];
        }
        
        // 刷新音量数据
        [self.audioRecorder updateMeters];
        //    // 获取音量的平均值
        //    [self.audioRecorder averagePowerForChannel:0];
        //    // 音量的最大值
        //    [self.audioRecorder peakPowerForChannel:0];
        CGFloat lowPassResults = pow(10, (0.05 * [self.audioRecorder peakPowerForChannel:0]));
        NSNumber *lowNum = [NSNumber numberWithFloat:lowPassResults];
        [[NSNotificationCenter defaultCenter] postNotificationName:@"RecordLevelNotification" object:@{@"power":lowNum}];
    }else{
        [self audioRecorderStop];
    }
}

/// 停止录音
- (void)audioRecorderStop
{
    
    // 释放计时器
    [self.audioRecorderTimer invalidate];
    self.audioRecorderTimer = nil;
    if (self.audioRecorder)
    {
            // 获取录音时长
            self.audioRecorderTime = [self.audioRecorder currentTime];
            [self.audioRecorder stop];
            // 停止录音后释放掉
            self.audioRecorder = nil;
            if (self.audioRecorderTime < 2) {//时间小于2秒
                [[NSNotificationCenter defaultCenter]postNotificationName:@"RecordChangeNotification" object:@"Short"];
                if ([[NSFileManager defaultManager] fileExistsAtPath:self.filePath]) {
                    NSFileManager *fileMgr = [NSFileManager defaultManager];
                    NSError *err;
                    [fileMgr removeItemAtPath:self.filePath error:&err];
                }
            }else{
                [[NSNotificationCenter defaultCenter]postNotificationName:@"FinishAudioRecordNotification" object:self.filePath];
            }
    }

}

- (void)audioRecorderCancel{
    // 释放计时器
    [self.audioRecorderTimer invalidate];
    self.audioRecorderTimer = nil;
    if (self.audioRecorder){
        if ([self.audioRecorder isRecording]){
            [self.audioRecorder stop];
            self.audioRecorder = nil;

            if ([[NSFileManager defaultManager] fileExistsAtPath:self.filePath]) {
                NSFileManager *fileMgr = [NSFileManager defaultManager];
                NSError *err;
                [fileMgr removeItemAtPath:self.filePath error:&err];
            }
        }
    }
}



/// 录音时长
- (NSTimeInterval)durationAudioRecorderWithFilePath:(NSString *)filePath
{
    NSURL *urlFile = [NSURL fileURLWithPath:filePath];
    self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:urlFile error:nil];
    NSTimeInterval time = self.audioPlayer.duration;
    self.audioPlayer = nil;
    return time;
}

#pragma mark - 音频处理-播放/停止

/// 音频开始播放或停止
- (void)audioPlayWithFilePath:(NSString *)filePath
{
    if (self.audioPlayer)
    {
        // 判断当前与下一个是否相同
        // 相同时，点击时要么播放，要么停止
        // 不相同时，点击时停止播放当前的，开始播放下一个
        NSString *currentStr = [self.audioPlayer.url relativeString];
        
        /*
         NSString *currentName = [self getFileNameAndType:currentStr];
         NSString *nextName = [self getFileNameAndType:filePath];
         
         if ([currentName isEqualToString:nextName])
         {
         if ([self.audioPlayer isPlaying])
         {
         [self.audioPlayer stop];
         self.audioPlayer = nil;
         }
         else
         {
         self.audioPlayer = nil;
         [self audioPlayerPlay:filePath];
         }
         }
         else
         {
         [self audioPlayerStop];
         [self audioPlayerPlay:filePath];
         }
         */
        
        // currentStr包含字符"file://location/"，通过判断filePath是否为currentPath的子串，是则相同，否则不同
        NSRange range = [currentStr rangeOfString:filePath];
        if (range.location != NSNotFound)
        {
            if ([self.audioPlayer isPlaying])
            {
                [self.audioPlayer stop];
                self.audioPlayer = nil;
            }
            else
            {
                self.audioPlayer = nil;
                [self audioPlayerPlay:filePath];
            }
        }
        else
        {
            [self audioPlayerStop];
            [self audioPlayerPlay:filePath];
        }
    }
    else
    {
        [self audioPlayerPlay:filePath];
    }
    
}

/// 音频播放停止
- (void)audioStop
{
    [self audioPlayerStop];
}


/// 音频播放器开始播放
- (void)audioPlayerPlay:(NSString *)filePath
{
    // 判断将要播放文件是否存在
    BOOL isExist = [[NSFileManager defaultManager] fileExistsAtPath:filePath];
    if (!isExist)
    {
        return;
    }
    
    NSURL *urlFile = [NSURL fileURLWithPath:filePath];
    self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:urlFile error:nil];
    if (self.audioPlayer)
    {
        if ([self.audioPlayer prepareToPlay])
        {
            // 播放时，设置喇叭播放否则音量很小
            AVAudioSession *playSession = [AVAudioSession sharedInstance];
            [playSession setCategory:AVAudioSessionCategoryPlayback error:nil];
            [playSession setActive:YES error:nil];
            
            [self.audioPlayer play];
        }
    }
}

/// 音频播放器停止播放
- (void)audioPlayerStop
{
    if (self.audioPlayer)
    {
        if ([self.audioPlayer isPlaying])
        {
            [self.audioPlayer stop];
        }
        
        self.audioPlayer = nil;
    }
}

@end
