//
//  DWRecordButton.m
//  RNNeteaseIm
//
//  Created by Dowin on 2017/6/27.
//  Copyright © 2017年 Dowin. All rights reserved.
//

#import "DWRecordButton.h"
#import <AVFoundation/AVFoundation.h>
#import "DWAudioRecorderManager.h"

#define kGetColor(r, g, b) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:1]

@interface DWRecordButton (){
    BOOL isTouchOut;
    BOOL isHasVoiceAuth;
    BOOL isBegin;//是否开始录音
}
@property (copy, nonatomic) NSString *strRecordPath;
@property (strong, nonatomic) UILongPressGestureRecognizer *btnTap;
@end


@implementation DWRecordButton

- (void)dealloc{
    [self removeGestureRecognizer:_btnTap];
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.hidden = YES;
        self.backgroundColor = kGetColor(247, 247, 247);
        
        [self setTitle:@"按住 说话" forState:UIControlStateNormal];
        [self setTitleColor:[UIColor darkGrayColor] forState:UIControlStateNormal];
        
        self.layer.cornerRadius = 5.0f;
        self.layer.borderWidth = 0.5;
        self.layer.borderColor = [UIColor colorWithWhite:0.6 alpha:1.0].CGColor;
        self.btnTap = [[UILongPressGestureRecognizer alloc]initWithTarget:self action:@selector(clickLongGest:)];
        self.btnTap.cancelsTouchesInView = NO;
        [self addGestureRecognizer:_btnTap];
//        [self addTarget:self action:@selector(recordTouchDown) forControlEvents:UIControlEventTouchDown];
//        [self addTarget:self action:@selector(recordTouchUpOutside) forControlEvents:UIControlEventTouchUpOutside];
//        [self addTarget:self action:@selector(recordTouchUpInside) forControlEvents:UIControlEventTouchUpInside];
//        [self addTarget:self action:@selector(recordTouchDragEnter) forControlEvents:UIControlEventTouchDragEnter];
//        [self addTarget:self action:@selector(recordTouchDragExit) forControlEvents:UIControlEventTouchDragExit];
        
    }
    return self;
}

- (void)setTextArr:(NSArray *)textArr{
    if (textArr) {
        NSString *fristText = [textArr firstObject];
        [self setTitle:fristText forState:UIControlStateNormal];
    }
    _textArr = textArr;
}


- (void)setButtonStateWithRecording
{
    self.backgroundColor = kGetColor(214, 215, 220); //214,215,220
    NSString *strSelect = (_textArr.count>1)?_textArr[1]:@"";
    [self setTitle:strSelect forState:UIControlStateNormal];
}

- (void)setButtonStateWithNormal
{
    self.backgroundColor = kGetColor(247, 247, 247);
    NSString *strNormal = (_textArr.count>0)?[_textArr firstObject]:@"";
    self.selected = NO;
    [self setTitle:strNormal forState:UIControlStateNormal];
}

- (void)setButtonStateWithCancel
{
    self.backgroundColor = kGetColor(214, 215, 220);
//    self.selected = NO;
    NSString *strCancel = (_textArr.count>2)?_textArr[2]:@"";
    [self setTitle:strCancel forState:UIControlStateNormal];
}

//长按
- (void)clickLongGest:(UILongPressGestureRecognizer *)gest{
    if (gest.state == UIGestureRecognizerStateBegan){
        isBegin = YES;
        [self recordTouchDown];
    }
}

#pragma mark -- 事件方法回调
//开始录音
- (void)recordTouchDown
{
    NSLog(@"开始录音");
    if ([self getVoiceAVAuthorizationStatus]) {
        isTouchOut = NO;
        if (!self.selected) {
            [[NSNotificationCenter defaultCenter]postNotificationName:@"RecordChangeNotification" object:@"Start"];
            self.selected = YES;
            [self setButtonStateWithRecording];
            _strRecordPath = [self getSaveRecordPath];
            [[DWAudioRecorderManager shareManager] audioRecorderStartWithFilePath:_strRecordPath ];
        }
    }
}
//取消录音
- (void)recordTouchUpOutside{
    if (isHasVoiceAuth) {
        NSLog(@"取消录音");
        [self setButtonStateWithNormal];
        [[DWAudioRecorderManager shareManager] audioRecorderCancel];
        [[NSNotificationCenter defaultCenter]postNotificationName:@"RecordChangeNotification" object:@"Canceled"];
    }
}
//完成录音
- (void)recordTouchUpInside{
    if (isHasVoiceAuth) {
        NSLog(@"完成录音");
        [self setButtonStateWithNormal];
        [[DWAudioRecorderManager shareManager] audioRecorderStop];
    }
}
//继续录音
- (void)recordTouchDragEnter{
    if (isHasVoiceAuth) {
        if (self.selected) {
            NSLog(@"继续录音");
            [self setButtonStateWithRecording];
            [[NSNotificationCenter defaultCenter]postNotificationName:@"RecordChangeNotification" object:@"Continue"];
        }
    }
}
//将要取消录音
- (void)recordTouchDragExit{
    if (isHasVoiceAuth) {
        if (self.selected) {
            NSLog(@"将要取消录音");
            [self setButtonStateWithCancel];
            [[NSNotificationCenter defaultCenter]postNotificationName:@"RecordChangeNotification" object:@"Move"];
        }
    }
}

#pragma mark  touch--
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touchesBegan~~~~~~~~~~~~~");
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touchesEnded~~~~~~~~~~~~~");
    if (isBegin) {
        isBegin = NO;
        UITouch *touch = [touches anyObject];
        CGPoint touchPoint = [touch locationInView:self];
        if (touchPoint.y > 0) {//结束
            [self recordTouchUpInside];
        }else{//取消
            [self recordTouchUpOutside];
        }
    }
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    NSLog(@"touchesMoved~~~~~~");
    if (isBegin) {
        UITouch *touch = [touches anyObject];
        CGPoint touchPoint = [touch locationInView:self];
        if ((touchPoint.y < 0) && (!isTouchOut)) {//移出按钮范围
            isTouchOut = YES;
            [self recordTouchDragExit];
        }else if((touchPoint.y > 0) && isTouchOut){//进入按钮范围
            isTouchOut = NO;
            [self recordTouchDragEnter];
        }
    }
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{//取消录音
    NSLog(@"touchesCancelled~~~~~~");
    if (isBegin) {
        [self recordTouchUpOutside];
    }
}

//判断录音权限
- (BOOL)getVoiceAVAuthorizationStatus{
    [AVCaptureDevice requestAccessForMediaType:
     AVMediaTypeAudio completionHandler:^(BOOL granted)
     {//麦克风权限
         if (granted) {
             isHasVoiceAuth = YES;
         }else{
             isHasVoiceAuth = NO;
             dispatch_async(dispatch_get_main_queue(), ^{
                 UIAlertView * alart = [[UIAlertView alloc]initWithTitle:@"温馨提示" message:@"请您设置允许APP访问您的麦克风\n设置>隐私>麦克风" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
                 [alart show];
             });
         }
     }];
    return isHasVoiceAuth;
}

//获取保存录音路径
- (NSString *)getSaveRecordPath{
    NSString *dirPath = NSTemporaryDirectory();
    NSTimeInterval interval = [[NSDate date] timeIntervalSince1970];
    NSString *recordName = [NSString stringWithFormat:@"%.0f.aac",interval];
    NSString *soundFilePath = [dirPath stringByAppendingPathComponent:recordName];
    return soundFilePath;
}


@end
