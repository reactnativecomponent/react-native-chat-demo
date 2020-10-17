//
//  DWShowImageVC.m
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/9/11.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import "DWShowImageVC.h"
#import "DWOrigScorllView.h"
#import "UIView+Extend.h"

@interface DWShowImageVC ()<DWOrigImageViewDelegate>
@property (strong, nonatomic) DWOrigScorllView *scroll;
@property (strong, nonatomic) UIImageView *backImageView;
@end

@implementation DWShowImageVC


- (UIImageView *)backImageView{
    if (_backImageView == nil) {
        _backImageView = [[UIImageView alloc]initWithFrame:CGRectMake(0, 0, screenW, screenH)];
    }
    return _backImageView;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    UIWindow *screenWindow = [[UIApplication sharedApplication] keyWindow];
    [self.view addSubview:self.backImageView];
//    self.backImageView.image = self.backgroundImg;
    
    _scroll = [DWOrigScorllView scrollViewWithDataArr:_imageArr andIndex:(_index-1) showDownBtnTime:0.3 ];
    _scroll.delegate = self;
    _scroll.frame = CGRectMake(0, 0, screenW, screenH);
    screenWindow.windowLevel = UIWindowLevelAlert;
    [screenWindow addSubview:_scroll];
    
}

- (UIStatusBarStyle)preferredStatusBarStyle{
    return UIStatusBarStyleLightContent;
}

#pragma mark orgDelegate
- (void)origImageViewClickTap{
    [UIApplication sharedApplication].keyWindow.windowLevel = UIWindowLevelNormal;
    [_scroll removeFromSuperview];
    [self dismissViewControllerAnimated:NO completion:nil];
}

- (void)origImageViewClickScannedImg:(NSString *)strScan{
    [self dismissViewControllerAnimated:NO completion:^{
        [UIApplication sharedApplication].keyWindow.windowLevel = UIWindowLevelNormal;
        [_scroll removeFromSuperview];
         [[NSNotificationCenter defaultCenter]postNotificationName:@"DWOrigImageViewScanNotificatiom" object:strScan];
    }];
   
    
}

@end
