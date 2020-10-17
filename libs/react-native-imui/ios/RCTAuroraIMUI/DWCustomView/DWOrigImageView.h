//
//  DWOrigImageView.h
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/9/8.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MyCacheImageView.h"
//@class DWContentScrollView;

#define screenW [UIScreen mainScreen].bounds.size.width
#define screenH [UIScreen mainScreen].bounds.size.height



@interface DWOrigImageView : UIView
@property (strong, nonatomic) MyCacheImageView *imgView;
@property (strong, nonatomic) UIScrollView *contentScrollView;
+ (instancetype)origImgViewWithDict:(NSDictionary *)dict;
- (void)setupImgViewWithDict:(NSDictionary *)dict;
- (void)restoreView;//复原ImageView
- (void)saveImage;
@end
