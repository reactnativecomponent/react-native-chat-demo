//
//  DWOrigImgView.h
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/29.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import <UIKit/UIKit.h>
#define screenW [UIScreen mainScreen].bounds.size.width
#define screenH [UIScreen mainScreen].bounds.size.height
@interface DWOrigImgView : UIView
+ (instancetype)origImgViewWithDict:(NSDictionary *)dict;
@end
