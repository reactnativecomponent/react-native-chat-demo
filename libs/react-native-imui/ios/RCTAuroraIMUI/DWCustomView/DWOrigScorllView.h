//
//  DWOrigScorllView.h
//  DWTestProject
//
//  Created by Dowin on 2017/9/8.
//  Copyright © 2017年 Dowin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DWOrigImageView.h"

@protocol DWOrigImageViewDelegate <NSObject>

@optional
- (void)origImageViewClickTap;
- (void)origImageViewClickScannedImg:(NSString *)strScan;

@end

@interface DWOrigScorllView : UIView
+ (instancetype)scrollViewWithDataArr:(NSArray *)dataArr andIndex:(NSInteger )index showDownBtnTime:(NSTimeInterval)time;
@property (weak, nonatomic) id<DWOrigImageViewDelegate> delegate;
@end
