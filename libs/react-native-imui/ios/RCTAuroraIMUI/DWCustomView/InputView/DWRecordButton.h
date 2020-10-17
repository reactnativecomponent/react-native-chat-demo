//
//  DWRecordButton.h
//  RNNeteaseIm
//
//  Created by Dowin on 2017/6/27.
//  Copyright © 2017年 Dowin. All rights reserved.
//

#import <UIKit/UIKit.h>
@class DWRecordButton;

@interface DWRecordButton : UIButton

@property (copy, nonatomic) NSArray *textArr;
- (void)setButtonStateWithRecording;
- (void)setButtonStateWithNormal;
- (void)setButtonStateWithCancel;

@end
