//
//  DWOrigImgView.m
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/29.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import "DWOrigImgView.h"
#import "UIView+Extend.h"
#import "MyCacheImageView.h"


@interface DWOrigImgView (){
    MyCacheImageView *imgView;
    UIPinchGestureRecognizer *pinchGest;
    UIPanGestureRecognizer *panGest;
    UITapGestureRecognizer *tapGest;
    CGRect orginFrame;
    UIButton *downBtn;
    
}

@end

@implementation DWOrigImgView

- (void)dealloc{
    [imgView removeGestureRecognizer:pinchGest];
    [imgView removeGestureRecognizer:panGest];
    [self removeGestureRecognizer:tapGest];
}

+ (instancetype)origImgViewWithDict:(NSDictionary *)dict{
    DWOrigImgView *orgView = [[DWOrigImgView alloc]init];
    [orgView setupImgViewWithDict:dict];
    return orgView;
}

- (void)setupImgViewWithDict:(NSDictionary *)dict{
    NSString *thumbPath = [dict objectForKey:@"thumbPath"];
    NSString *strUrl = [dict objectForKey:@"url"];
    UIImage *placeImg = [UIImage imageWithData:[NSData dataWithContentsOfFile:thumbPath]];
    [imgView setImageURL:strUrl placeImage:placeImg];
    NSNumber *numW = [dict objectForKey:@"imageWidth"];
    NSNumber *numH = [dict objectForKey:@"imageHeight"];
    CGFloat multiple = numW.floatValue / numH.floatValue;
    CGFloat imgW = screenW;
    CGFloat imgH = imgW / multiple;
    CGFloat imgY = 0;
    if (imgH < screenH) {
        imgY = (screenH-imgH)*0.5;
    }
    imgView.frame = CGRectMake(0, imgY, imgW, imgH);
    orginFrame = imgView.frame;
}


- (instancetype)initWithFrame:(CGRect)frame{
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor blackColor];
        self.userInteractionEnabled = YES;
        [self addContentView];
    }
    return self;
}

- (void)addContentView{
    imgView = [[MyCacheImageView alloc]init];
    imgView.contentMode = UIViewContentModeScaleAspectFit;
    imgView.userInteractionEnabled = YES;
    imgView.multipleTouchEnabled = YES;
    [self addSubview:imgView];
    pinchGest = [[UIPinchGestureRecognizer alloc]initWithTarget:self action:@selector(clickPinchView:)];
    [imgView addGestureRecognizer:pinchGest];
    panGest = [[UIPanGestureRecognizer alloc]initWithTarget:self action:@selector(clickPanView:)];
    [imgView addGestureRecognizer:panGest];
    
    tapGest = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(clickTapGest)];
    [self addGestureRecognizer:tapGest];
    
    CGFloat btnWH = 35;
    CGFloat btnX = screenW - btnWH - 20;
    CGFloat btnY = screenH - btnWH - 20;
    downBtn = [[UIButton alloc]initWithFrame:CGRectMake(btnX, btnY, btnWH, btnWH)];
    [downBtn setBackgroundImage:[UIImage imageNamed:@"download"] forState:UIControlStateNormal];
    [downBtn addTarget:self action:@selector(clickDownLoadBtn) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:downBtn];
    [self performSelector:@selector(delayMethod) withObject:nil  afterDelay:3.0];
    
}

- (void)delayMethod{
    [UIView animateWithDuration:0.5 animations:^{
        downBtn.alpha -= 1;
    } completion:^(BOOL finished) {
       downBtn.hidden = YES;
        downBtn.alpha = 1;
    }];
    
}

- (void)clickDownLoadBtn{
    UIImageWriteToSavedPhotosAlbum(imgView.image, self, @selector(image:didFinishSavingWithError:contextInfo:), NULL);
}

- (void)image: (UIImage *) image didFinishSavingWithError: (NSError *) error contextInfo: (void *) contextInfo{
    NSString *msg = nil ;
    if(error != NULL){
        msg = @"保存图片失败" ;
    }else{
        msg = @"保存图片成功" ;
    }
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:msg message:@"" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil];
    [alert show];
}


- (void)clickPinchView:(UIPinchGestureRecognizer *)gest{
    UIView *view = gest.view;
    if (gest.state == UIGestureRecognizerStateBegan || gest.state == UIGestureRecognizerStateChanged) {
        view.transform = CGAffineTransformScale(view.transform, gest.scale, gest.scale);
        gest.scale = 1;
    }
    if (gest.state == UIGestureRecognizerStateEnded) {
        if (view.frame.size.width < screenW) {
            CGFloat tmpW = screenW - view.width;
            CGFloat tmpH = orginFrame.size.height - view.height;
            [UIView animateWithDuration:0.3 animations:^{
                view.width += tmpW;
                view.height += tmpH;
                view.x -= tmpW*0.5;
                view.y -= tmpH*0.5;
                
            } completion:^(BOOL finished) {
                view.frame = orginFrame;
            }];
        }
        if (view.width > 1.5 * screenW) {
            CGFloat maxH = view.height - orginFrame.size.height*1.5;
            CGFloat maxW = view.width - screenW*1.5;
            [UIView animateWithDuration:0.3 animations:^{
                view.width -= maxW;
                view.height -= maxH;
                view.x += maxW*0.5;
                view.y += maxH*0.5;
            }];
        }
    }
}

- (void)clickPanView:(UIPanGestureRecognizer *)gest{
    UIView *view = gest.view;
    if (gest.state == UIGestureRecognizerStateBegan || gest.state == UIGestureRecognizerStateChanged) {
        CGPoint translation = [gest translationInView:view.superview];
        [view setCenter:(CGPoint){view.center.x + translation.x, view.center.y + translation.y}];
        [gest setTranslation:CGPointZero inView:view.superview];
    }
    if (gest.state == UIGestureRecognizerStateEnded) {
        if (view.x>0) {
            CGFloat tmpX = view.x;
            [UIView animateWithDuration:0.3 animations:^{
                view.x -= tmpX;
            } completion:^(BOOL finished) {
                view.x = 0;
            }];
        }else if((screenW-view.x)>view.width){
            CGFloat tmpx =  screenW - view.x - view.width;
            [UIView animateWithDuration:0.3 animations:^{
                view.x += tmpx;
            } completion:^(BOOL finished) {
                view.x = screenW - view.width;
            }];
        }
        if (view.height > screenH) {
            if ((view.height - screenH + view.y)<0) {
                CGFloat tmpH = screenH - view.height - view.y;
                [UIView animateWithDuration:0.3 animations:^{
                    view.y += tmpH;
                }];
            }else if (view.y > 0){
                CGFloat tmpH = view.y ;
                [UIView animateWithDuration:0.3 animations:^{
                    view.y -= tmpH;
                }];
            }
        }else{
            CGFloat tmpH = view.y - (screenH - view.height)*0.5;;
            [UIView animateWithDuration:0.3 animations:^{
                view.y -= tmpH;
            }];
        }
    }
}

- (void)clickTapGest{
    [self removeFromSuperview];
}

@end
