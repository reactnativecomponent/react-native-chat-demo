//
//  UIImage+DWImageColor.m
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/9/12.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import "UIImage+DWImageColor.h"

@implementation UIImage (DWImageColor)

+ (UIImage *)DWImageWithColor:(UIColor *)color{
    CGRect rect = CGRectMake(0.0f, 0.0f, 1.0f, 1.0f);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);
    UIImage *theImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return theImage;
}

@end
