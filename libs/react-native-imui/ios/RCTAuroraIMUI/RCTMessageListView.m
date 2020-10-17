//
//  RCTMessageListView.m
//  imuiDemo
//
//  Created by oshumini on 2017/5/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTMessageListView.h"
#import <CoreGraphics/CoreGraphics.h>
#import <RCTAuroraIMUI/RCTAuroraIMUI-Swift.h>
#import "RCTAuroraIMUIModule.h"
#import "RNRecordTipsView.h"
#import "UIView+Extend.h"
#import "DWOrigScorllView.h"
#import "DWShowImageVC.h"
#import "DWRecoderCoveView.h"
#import "DWPlayVideoVC.h"

#define screenW [UIScreen mainScreen].bounds.size.width
#define screenH [UIScreen mainScreen].bounds.size.height



@interface RCTMessageListView ()<IMUIMessageMessageCollectionViewDelegate,UIScrollViewDelegate>{
    DWRecoderCoveView *coverView;
    RNRecordTipsView *recordView;
    BOOL isShowMenuing;
    
}
@property (assign, nonatomic) NSTimeInterval lastTime;
@property (copy, nonatomic) NSString *strLastMsgId;
@property (copy, nonatomic) NSMutableArray *tmpMessageArr;
@property (copy, nonatomic) NSMutableArray *imageArr;

@end

@implementation RCTMessageListView

- (void)setInitalData:(NSArray *)initalData{
    if (initalData.count) {
        NSMutableArray *modeArr = [NSMutableArray array];
        for (NSMutableDictionary *message in initalData) {
            NSTimeInterval msgTime = [[message objectForKey:@"timeString"] doubleValue];
            if ((!_lastTime)||(fabs(_lastTime-msgTime) > 180)) {
                _lastTime = msgTime;
                _strLastMsgId = [message objectForKey:@"msgId"];
                [message setObject:[NSNumber numberWithBool:YES] forKey:@"isShowTime"];
            }else{
                [message setObject:[NSNumber numberWithBool:NO] forKey:@"isShowTime"];
            }
            RCTMessageModel * messageModel = [self convertMessageDicToModel:message];
            [modeArr addObject:messageModel];
            [self appendImageMessage:message];
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.messageList fristAppendMessagesWith:modeArr];
        });
    }
}

- (NSMutableArray *)tmpMessageArr{
    if (_tmpMessageArr == nil) {
        _tmpMessageArr = [NSMutableArray array];
    }
    return _tmpMessageArr;
}

- (NSMutableArray *)imageArr{
    if (_imageArr == nil) {
        _imageArr = [NSMutableArray array];
    }
    return _imageArr;
}


- (instancetype)init {
  self = [super init];
  return self;
}

- (RCTMessageModel *)convertMessageDicToModel:(NSMutableDictionary *)message {
  return [[RCTMessageModel alloc] initWithMessageDic: message];
}

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame: frame];
  return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    self.frame = CGRectMake(0, 0, screenW, screenH-60-50);//60为导航栏高度，50为输入栏默认高度
      self.autoresizingMask = UIViewAutoresizingNone;
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(appendMessages:)
                                                 name:kAppendMessages object:nil];

      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(deleteMessage:)
                                                   name:kDeleteMessage object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(cleanAllMessages)
                                                   name:kCleanAllMessages object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(insertMessagesToTop:)
                                                 name:kInsertMessagesToTop object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(updateMessage:)
                                                 name:kUpdateMessge object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(scrollToBottom:)
                                                 name:kScrollToBottom object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickLongTouchShowMenu:) name:kClickLongTouchShowMenu object:nil];
    
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickRecordNotification:) name:RecordChangeNotification object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickRecordLevelNotification:) name:kRecordLevelNotification object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickRecordLongTimeNotification:) name:kRecordLongNotification object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickChangeHeight:) name:@"ChangeMessageListHeightNotification" object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickShowOrigImgView:) name:@"ShowOrigImageNotification" object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickScanOrigImgView:) name:@"DWOrigImageViewScanNotificatiom" object:nil];
      [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(clickScrollEnabled:) name:@"clickScrollEnabled" object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clickPlayVideo:) name:@"PlayVideoNotification" object:nil];
      
    [self addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew context:NULL];
    
    
//    UIRefreshControl *refreshControl = [[UIRefreshControl alloc] init];
////    [refreshControl addTarget:self action:@selector(refresh:) forControlEvents:UIControlEventValueChanged];
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//      [_messageList.messageCollectionView addSubview:refreshControl];
//      _messageList.messageCollectionView.alwaysBounceVertical = YES;
//    });
      [self addCoverView];
      
  }
  return self;
}


- (void)addCoverView{
    for (UIView *tmpView in [UIApplication sharedApplication].keyWindow.subviews) {
        if ([tmpView isKindOfClass:[DWRecoderCoveView class]]) {
            [tmpView removeFromSuperview];
        }
    }
    coverView = [[DWRecoderCoveView alloc]initWithFrame:CGRectMake(0, 0, screenW, screenH-50)];
    coverView.backgroundColor = [UIColor clearColor];
    
    CGFloat recordWH = 150;
    CGFloat recordX = (screenW - recordWH)*0.5;
    CGFloat recordY = (screenH - recordWH )*0.4;
    recordView = [[RNRecordTipsView alloc]initWithFrame:CGRectMake(recordX, recordY, recordWH, recordWH)];
    recordView.numFontSize = @"60";
    recordView.status = UIRecordSoundStatusRecoding;
    [coverView addSubview:recordView];
    coverView.hidden = YES;
    [[UIApplication sharedApplication].keyWindow addSubview:coverView];
//    NSLog(@"keyWindow:%zd",[UIApplication sharedApplication].keyWindow.subviews.count);
}



- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    UIViewController *topVC = [UIApplication sharedApplication].keyWindow.rootViewController;
    if (!topVC.presentedViewController) {
        if (object == self && [keyPath isEqualToString:@"bounds"]) {
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self.messageList scrollToBottomWith: NO];
            });
        }
    }
}


- (void)deleteMessage:(NSNotification *)notification{
    NSArray *messages = [[notification object] copy];
    for (NSMutableDictionary *message in messages) {
        NSString *strMsgId = [message objectForKey:@"msgId"];
        [self deleteImageMessage:message];
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.messageList deleteMessageWith:strMsgId];
        });
    }
}

- (void)cleanAllMessages{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.messageList cleanAllMessages];
    });
}

- (void)appendMessages:(NSNotification *) notification {
  NSArray *messages = [[notification object] copy];
  
  for (NSMutableDictionary *message in messages) {
      NSTimeInterval msgTime = [[message objectForKey:@"timeString"] doubleValue] ;
      if (![_strLastMsgId isEqualToString:[message objectForKey:@"msgId"]]) {
          if ((!_lastTime)||(fabs(_lastTime-msgTime) > 180)) {
              _lastTime = msgTime;
              _strLastMsgId = [message objectForKey:@"msgId"];
              [message setObject:[NSNumber numberWithBool:YES] forKey:@"isShowTime"];
          }else{
              [message setObject:[NSNumber numberWithBool:NO] forKey:@"isShowTime"];
          }
      }else{
          [message setObject:[NSNumber numberWithBool:YES] forKey:@"isShowTime"];
      }
      [self appendImageMessage:message];
    RCTMessageModel * messageModel = [self convertMessageDicToModel:message];
      if (isShowMenuing) {
          [self.tmpMessageArr addObject:messageModel];
      }else{
          dispatch_async(dispatch_get_main_queue(), ^{
              [self.messageList appendMessageWith: messageModel];
          });
      }
  }
}

- (void)insertMessagesToTop:(NSNotification *) notification {
    NSArray *messages = [[notification object] copy];
    NSMutableArray *messageModels = [NSMutableArray array];
    NSTimeInterval insertTime = 0;
    NSMutableArray *tmpIMGArr = [NSMutableArray array];
    for (NSMutableDictionary *message in messages) {
        NSTimeInterval msgTime = [[message objectForKey:@"timeString"] doubleValue];
        if ((!insertTime)||(fabs(insertTime - msgTime) >180)) {
            insertTime = msgTime;
            [message setObject:[NSNumber numberWithBool:YES] forKey:@"isShowTime"];
        }else{
            [message setObject:[NSNumber numberWithBool:NO] forKey:@"isShowTime"];
        }
        NSString *strType = [message objectForKey:@"msgType"];
        if ([strType isEqualToString: @"image"]) {
            NSMutableDictionary *imgDict = [message objectForKey:@"extend"];
            [imgDict setObject:[message objectForKey:@"msgId"] forKey:@"msgId"];
            [tmpIMGArr insertObject:imgDict atIndex:0];
        }
        RCTMessageModel * messageModel = [self convertMessageDicToModel: message];
        [messageModels insertObject:messageModel atIndex:0];
    }
    for (NSMutableDictionary *imgD in tmpIMGArr) {
        [self.imageArr insertObject:imgD atIndex:0];
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.messageList insertMessagesWith: messageModels];
    });
}
//添加图片message到数组
- (void)appendImageMessage:(NSMutableDictionary *)message{
    NSString *strType = [message objectForKey:@"msgType"];
    if ([strType isEqualToString: @"image"]) {
        NSString *strID = [message objectForKey:@"msgId"];
        NSMutableDictionary *imgDict = [message objectForKey:@"extend"];
        [imgDict setObject:strID forKey:@"msgId"];
        for (NSMutableDictionary *tmpDict in self.imageArr) {
            if ([[tmpDict objectForKey:@"msgId"] isEqualToString:strID]) {
                return;
            }
        }
        [self.imageArr addObject:imgDict];
    }
}
//从数组中删除图片
- (void)deleteImageMessage:(NSMutableDictionary *)message{
    NSMutableArray *tmpArr = [self.imageArr copy];
    NSString *strID = [message objectForKey:@"msgId"];
    for (NSInteger i=0; i<tmpArr.count; i++) {
        NSMutableDictionary *tmpDict = tmpArr[i];
        if ([[tmpDict objectForKey:@"msgId"] isEqualToString:strID]) {
            [self.imageArr removeObjectAtIndex:i];
            return;
        }
    }
}


- (void)updateMessage:(NSNotification *) notification {
    NSMutableDictionary *message = [notification object];
    NSString *tmpId = [message objectForKey:@"msgId"];
    if ( [tmpId isEqualToString:_strLastMsgId]) {
        [message setObject:[NSNumber numberWithBool:YES] forKey:@"isShowTime"];
    }else{
        [message setObject:[NSNumber numberWithBool:NO] forKey:@"isShowTime"];
    }
      RCTMessageModel * messageModel = [self convertMessageDicToModel: message];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.messageList updateMessageWith: messageModel];
    });
}

- (void)scrollToBottom:(NSNotification *) notification {
  BOOL animate = [[notification object] copy];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.messageList scrollToBottomWith:animate];
  });
}

- (void)clickRecordNotification:(NSNotification *)notification{
    NSString *strStatus = [[notification object] copy];
    dispatch_async(dispatch_get_main_queue(), ^{
        if ([strStatus isEqualToString:@"Start"]) {
            coverView.hidden = NO;
            recordView.time = @"60";
            recordView.status = UIRecordSoundStatusRecoding;
        }else if ([strStatus isEqualToString:@"Complete"]) {
            coverView.hidden = YES;
        }else if ([strStatus isEqualToString:@"Canceled"]) {
            coverView.hidden = YES;
        }else if ([strStatus isEqualToString:@"Continue"]) {
            recordView.status = UIRecordSoundStatusRecoding;
        }else if ([strStatus isEqualToString:@"Move"]) {
            recordView.status = UIRecordSoundStatusCancleSending;
        }else if ([strStatus isEqualToString:@"Short"]) {
            recordView.status = UIRecordSoundStatusRecordingShort;
//            sleep(1);
//            coverView.hidden = YES;
        }
    });
}

- (void)clickRecordLevelNotification:(NSNotification *)notification{
    NSDictionary *recordDict = [notification object];
    NSNumber *lowNum = [recordDict objectForKey:@"power"];
    CGFloat lowF = lowNum.floatValue;
    dispatch_async(dispatch_get_main_queue(), ^{
        recordView.level = lowF;
    });
    
}
                   
- (void)clickRecordLongTimeNotification:(NSNotification *)notification{
    NSNumber *longTime = [notification object];
    
    NSString *strTime = [NSString stringWithFormat:@"%zd",longTime.intValue];
    dispatch_async(dispatch_get_main_queue(), ^{
        recordView.time = strTime;
    });
}

- (void)clickChangeHeight:(NSNotification *)noti{
    NSDictionary *dict = noti.object;
    CGFloat height = [[dict objectForKey:@"listViewHeight"] floatValue] ;
    CGFloat tmpH = height - self.height;
    [UIView animateWithDuration:3 animations:^{
        self.height += tmpH;
    } completion:^(BOOL finished) {
         self.height = height;
    }];
}

- (void)clickLongTouchShowMenu:(NSNotification *)noti{
    NSString *isShowMenu = noti.object;
    if ([isShowMenu isEqualToString:@"showMenu"]) {
        isShowMenuing = YES;
    }else{
        isShowMenuing = NO;
        for (RCTMessageModel *model in _tmpMessageArr) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.messageList appendMessageWith: model];
            });
        }
        [_tmpMessageArr removeAllObjects];
    }
}

- (void)clickPlayVideo:(NSNotification *)noti{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *strPath = noti.object;
        UIWindow *win = [UIApplication sharedApplication].keyWindow;
        UIViewController *rootVC = win.rootViewController;
        DWPlayVideoVC *vc = [[DWPlayVideoVC alloc]init];
        vc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
        vc.strPath = strPath;
        [rootVC presentViewController:vc animated:YES completion:nil];
    });
}


- (void)clickShowOrigImgView:(NSNotification *)noti{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *strMsgID = noti.object;
        UIView *topView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject];
        if ([topView isKindOfClass:[DWRecoderCoveView class]]) {
            NSInteger count = [[UIApplication sharedApplication] keyWindow].subviews.count;
            topView = [[UIApplication sharedApplication] keyWindow].subviews[count - 2];
        }
        BOOL isEdit = (self.height >= screenH*0.7) ? NO : YES;
        NSMutableArray *rectArr = [NSMutableArray array];
        for (UIView *tmpView in self.messageList.messageCollectionView.subviews) {
            if ([tmpView isKindOfClass:[IMUIBaseMessageCell class]] ) {
                IMUIBaseMessageCell *cell = (IMUIBaseMessageCell *)tmpView;
                if ([cell.cellType isEqualToString:@"image"]) {
                    CGPoint imgPoint = [topView convertPoint:CGPointMake(0, 0) fromView:cell.bubbleView];
                    CGSize imgSize = cell.bubbleView.frame.size;
                    NSMutableDictionary *rectDict = [NSMutableDictionary dictionary];
                    [rectDict setObject:cell.cellMsgId forKey:@"msgId"];
                    [rectDict setObject:NSStringFromCGRect(CGRectMake(imgPoint.x, imgPoint.y, imgSize.width, imgSize.height)) forKey:@"rect"];
                    [rectArr addObject:rectDict];
                }
            }
        }
        
        if (_imageArr.count) {
            NSInteger index = 0;
            NSInteger imgIndex = 0;
            for (NSMutableDictionary *imgDict in _imageArr) {
                NSString *msgID = [imgDict objectForKey:@"msgId"];
                index ++;
                if ([strMsgID isEqualToString:msgID]) {
                    imgIndex = index;
                }
                [imgDict setObject:@"" forKey:@"rect"];
                for (NSMutableDictionary *tmpDict in rectArr) {
                    if ([msgID isEqualToString:[tmpDict objectForKey:@"msgId"]]) {
                        [imgDict setObject:[tmpDict objectForKey:@"rect"] forKey:@"rect"];
                        NSNumber *number = [NSNumber numberWithBool:isEdit];
                        [imgDict setObject:number forKey:@"isEdit"];
                        break;
                    }
                }
            }
            if (imgIndex > 0) {
                UIWindow *win = [UIApplication sharedApplication].keyWindow;
                UIViewController *rootVC = win.rootViewController;
                DWShowImageVC *vc = [[DWShowImageVC alloc]init];
                vc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
                vc.imageArr = _imageArr;
                vc.index = imgIndex;
                [rootVC presentViewController:vc animated:NO completion:nil];
            }
        }
    });
}

- (UIImage *)getScreenshots{
    CGRect screenShotRect = [[UIScreen mainScreen] bounds];
    UIGraphicsBeginImageContextWithOptions(screenShotRect.size, NO, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    BOOL hasTakenStatusBarScreenshot = NO;
    for (UIWindow *window in [[UIApplication sharedApplication] windows])
    {
        if (![window respondsToSelector:@selector(screen)] || [window screen] == [UIScreen mainScreen])
        {

            CGContextSaveGState(context);
            CGContextTranslateCTM(context, [window center].x, [window center].y);
            CGContextConcatCTM(context, [window transform]);
            CGContextTranslateCTM(context,
                                  -[window bounds].size.width * [[window layer] anchorPoint].x,
                                  -[window bounds].size.height * [[window layer] anchorPoint].y);
            
            
            // Render the layer hierarchy to the current context
            [[window layer] renderInContext:context];
            
            // Restore the context
            CGContextRestoreGState(context);
        }
        
        // Screenshot status bar if next window's window level > status bar window level
        NSArray *windows = [[UIApplication sharedApplication] windows];
        NSUInteger currentWindowIndex = [windows indexOfObject:window];
        if (windows.count > currentWindowIndex + 1)
        {
            UIWindow *nextWindow = [windows objectAtIndex:currentWindowIndex + 1];
            if ( nextWindow.windowLevel > UIWindowLevelStatusBar && !hasTakenStatusBarScreenshot)
            {
                [self mergeStatusBarToContext:context rect:screenShotRect];
                hasTakenStatusBarScreenshot = YES;
            }
        }
        else
        {
            if (!hasTakenStatusBarScreenshot)
            {
                [self mergeStatusBarToContext:context rect:screenShotRect];
                hasTakenStatusBarScreenshot = YES;
            }
        }
    }
    // Retrieve the screenshot image
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

- (void)mergeStatusBarToContext:(CGContextRef)context rect:(CGRect)rect{
    UIWindow *statusBarView = [[UIApplication sharedApplication] valueForKey:@"statusBarWindow"];
//    UIView *statusBarView = [UIView statusBarInstance_ComOpenThreadOTScreenshotHelper];
    CGContextSaveGState(context);
    CGContextTranslateCTM(context, [statusBarView center].x, [statusBarView center].y);
    CGContextConcatCTM(context, [statusBarView transform]);
    CGContextTranslateCTM(context,
                          -[statusBarView bounds].size.width * [[statusBarView layer] anchorPoint].x,
                          -[statusBarView bounds].size.height * [[statusBarView layer] anchorPoint].y);
    
    [[statusBarView layer] renderInContext:context];
    CGContextRestoreGState(context);
}



- (void)clickScanOrigImgView:(NSNotification *)noti{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *strResult = noti.object;
        if (_delegate != nil) {
            [_delegate onClickScanImageView:strResult];
        }
    });

}

- (void)clickScrollEnabled:(NSNotification *)noti{
    NSNumber *scrollNum = noti.object;
    self.messageList.messageCollectionView.scrollEnabled = [scrollNum boolValue];
}

- (void)awakeFromNib {
  [super awakeFromNib];

}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver: self];
  [self removeObserver:self forKeyPath:@"bounds"];

}


@end
