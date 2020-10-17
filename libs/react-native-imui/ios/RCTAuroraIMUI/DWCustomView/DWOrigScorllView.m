//
//  DWOrigScorllView.m
//  DWTestProject
//
//  Created by Dowin on 2017/9/8.
//  Copyright © 2017年 Dowin. All rights reserved.
//

#import "DWOrigScorllView.h"
#import "DWActionSheetView.h"
#import "UIView+Extend.h"
//#import "DWContentScrollView.h"


#define margin 20


@interface DWOrigScorllView()<UIScrollViewDelegate,DWActionSheetViewDelegate,UIGestureRecognizerDelegate>{
    NSInteger count;
    NSInteger showIndex;
    CGFloat fristContentX;
    UIButton *downBtn;
    UITapGestureRecognizer *tapGest;
    UILongPressGestureRecognizer *longGest;
//    UIPanGestureRecognizer *panGest;
    CGFloat beginDragX;
    CGFloat beginPanX;
    CGFloat beginPanY;
}
@property (strong, nonatomic) UIScrollView *scrollView;
@property (copy, nonatomic) NSMutableArray *imgArr;
@property (strong, nonatomic) DWOrigImageView *firstImageView;
@property (strong, nonatomic) DWOrigImageView *midImageView;
@property (strong, nonatomic) DWOrigImageView *lastImageView;
@property (strong, nonatomic) DWOrigImageView *codeImageView;
@property (copy, nonatomic) NSString *strScanResult;
@property (strong, nonatomic) UIView *coverView;


@end

@implementation DWOrigScorllView

- (void)dealloc{
    [self removeGestureRecognizer:tapGest];
    [self removeGestureRecognizer:longGest];
//    [_scrollView removeGestureRecognizer:panGest];

}



+ (instancetype)scrollViewWithDataArr:(NSArray *)dataArr andIndex:(NSInteger )index showDownBtnTime:(NSTimeInterval)time {
    DWOrigScorllView *scroll = [[DWOrigScorllView alloc]init];
    [scroll setupWithDataArr:dataArr andIndex:index showDownBtnTime:time ];
    return scroll;
}

- (void)setupWithDataArr:(NSArray *)arr andIndex:(NSInteger )index showDownBtnTime:(NSTimeInterval)time {
    _imgArr = [arr copy];
    count = _imgArr.count;
    if (_imgArr.count == 1) {
        _scrollView.contentSize = CGSizeMake(screenW, [UIScreen mainScreen].bounds.size.height);
        _firstImageView = [DWOrigImageView origImgViewWithDict:_imgArr[0]];
        _firstImageView.frame = CGRectMake(0, 0, screenW, screenH);
        [_scrollView addSubview:_firstImageView];
    }else if (_imgArr.count == 2){
        if (index == 0) {
            fristContentX = 0;
        }else{
            fristContentX = screenW+margin;
        }
        _scrollView.contentSize = CGSizeMake(screenW*2+margin, [UIScreen mainScreen].bounds.size.height);
        _firstImageView = [DWOrigImageView origImgViewWithDict:_imgArr[0]];
        _firstImageView.frame = CGRectMake(0, 0, screenW, screenH);
        [_scrollView addSubview:_firstImageView];
        
        _midImageView = [DWOrigImageView origImgViewWithDict:_imgArr[1]];
        _midImageView.frame = CGRectMake(screenW+margin, 0, screenW, screenH);
        [_scrollView addSubview:_midImageView];
        _scrollView.contentOffset = CGPointMake(fristContentX, 0);

        
    }else if (_imgArr.count > 2){
        _scrollView.contentSize = CGSizeMake((screenW+margin)*2+screenW, [UIScreen mainScreen].bounds.size.height);
        NSInteger fristIndex = 0;
        NSInteger midIndex = 1;
        NSInteger lastIndex = 2;
        if (index == 0) {
            fristContentX = 0;
        }else if(index == (_imgArr.count-1)){
            fristIndex = count - 3;
            midIndex = count - 2;
            lastIndex = count - 1;
            fristContentX = (screenW+margin)*2;
        }else{
            fristIndex = index - 1;
            midIndex = index;
            lastIndex = index + 1;
            fristContentX = screenW+margin;
        }
        
        _firstImageView = [DWOrigImageView origImgViewWithDict:_imgArr[fristIndex]];
        _firstImageView.frame = CGRectMake(0, 0, screenW, screenH);
        [_scrollView addSubview:_firstImageView];
        _midImageView = [DWOrigImageView origImgViewWithDict:_imgArr[midIndex]];
        _midImageView.frame = CGRectMake(screenW+margin, 0, screenW, screenH);
        [_scrollView addSubview:_midImageView];
        
        _lastImageView = [DWOrigImageView origImgViewWithDict:_imgArr[lastIndex]];
        _lastImageView.frame = CGRectMake((screenW+margin)*2, 0, screenW, screenH);
        [_scrollView addSubview:_lastImageView];
        
        
        _scrollView.contentOffset = CGPointMake(fristContentX, 0);
    }
    showIndex = index;
    [self performSelector:@selector(showBtnDelayMethod) withObject:nil afterDelay:time];
    [self setScrolViewAnimation];
}

- (void)setScrolViewAnimation{
    NSMutableDictionary *tmpDict = self.imgArr[showIndex];
    NSString *strRect = [tmpDict objectForKey:@"rect"];
    if (strRect.length) {
        CGRect rect = CGRectFromString(strRect);
        CGFloat scale = rect.size.width/screenW;
        _scrollView.transform = CGAffineTransformMakeScale(scale, scale);
        CGFloat rectY = rect.origin.y - (_scrollView.height - rect.size.height)*0.5;
        _scrollView.x = rect.origin.x;
        _scrollView.y = rectY;
        [self performSelector:@selector(clickShowScrollView) withObject:nil afterDelay:0.05];
    }
}

- (void)clickShowScrollView{
    [UIView animateWithDuration:0.3 animations:^{
        _scrollView.transform = CGAffineTransformMakeScale(1.0, 1.0);
        _scrollView.x = 0;
        _scrollView.y = 0;
    }];
}

- (void)showBtnDelayMethod{
    downBtn.hidden = NO;
}


- (instancetype)init{
    if (self = [super init]) {
        self.backgroundColor = [UIColor clearColor];
        self.userInteractionEnabled = YES;
        [self addContentView];
    }
    return self;
}

- (void)addContentView{
    _coverView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, screenW, screenH)];
    _coverView.backgroundColor = [UIColor blackColor];
    [self addSubview:_coverView];
    
    _scrollView = [[UIScrollView alloc]initWithFrame:CGRectMake(0, 0, screenW, screenH)];
    _scrollView.delegate = self;
    _scrollView.showsHorizontalScrollIndicator = NO;
    [self addSubview:_scrollView];
    
    tapGest = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(clickTapGest)];
    [self addGestureRecognizer:tapGest];
    
    longGest = [[UILongPressGestureRecognizer alloc]initWithTarget:self action:@selector(clickLongGest:)];
    [self addGestureRecognizer:longGest];
    
    
//    panGest = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pan:)];
//    panGest.delegate = self;
//    [_scrollView addGestureRecognizer:panGest];
    
    
    CGFloat btnWH = 35;
    CGFloat btnX = screenW - btnWH - 20;
    CGFloat btnY = screenH - btnWH - 20;
    downBtn = [[UIButton alloc]initWithFrame:CGRectMake(btnX, btnY, btnWH, btnWH)];
    [downBtn setBackgroundImage:[UIImage imageNamed:@"download"] forState:UIControlStateNormal];
    [downBtn addTarget:self action:@selector(clickDownLoadBtn) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:downBtn];
    downBtn.hidden = YES;
    [self performSelector:@selector(delayMethod) withObject:nil  afterDelay:5.0];
}



//点击
- (void)clickTapGest{
    NSMutableDictionary *tmpDict = self.imgArr[showIndex];
    NSString *strRect = [tmpDict objectForKey:@"rect"];
    NSNumber *isEditNum = [tmpDict objectForKey:@"isEdit"];
    if ((strRect.length)&& (!isEditNum.boolValue)) {
        CGRect rect = CGRectFromString(strRect);
        CGFloat scale = rect.size.width/screenW;
        CGFloat tmpY = rect.origin.y - (screenH * scale - rect.size.height)*0.5;
        if ((tmpY > screenH) || (tmpY+rect.size.height <0)) {
            [UIView animateWithDuration:0.3 animations:^{
                self.alpha = 0;
            }];
        }else{
            [UIView animateWithDuration:0.3 animations:^{
                _scrollView.transform = CGAffineTransformMakeScale(scale, scale);
                _scrollView.x = rect.origin.x;
                _scrollView.y = tmpY;
                _coverView.alpha = 0;
            }];
        }
    }else{
        [UIView animateWithDuration:0.3 animations:^{
            self.alpha = 0;
        }];
    }
    [self performSelector:@selector(afterTapGest) withObject:nil afterDelay:0.3];
}

- (void)afterTapGest{
    if ([self.delegate respondsToSelector:@selector(origImageViewClickTap)]) {
        [self.delegate origImageViewClickTap];
    }
}

//长按
- (void)clickLongGest:(UILongPressGestureRecognizer *)gest{
    if (gest.state == UIGestureRecognizerStateBegan){
        if (_scrollView.contentOffset.x == screenW+margin){//中间
            [self qrCodeWithImage:_midImageView];
        }else if (_scrollView.contentOffset.x == 0){
            [self qrCodeWithImage:_firstImageView];
        }else if(_scrollView.contentOffset.x == (screenW+margin)*2){
            [self qrCodeWithImage:_lastImageView];
        }
    }
}

//先不要拖拽手势
/*
- (void)pan:(UIPanGestureRecognizer *)pan
{
    CGPoint transP2 = [pan locationInView:self];
    if (pan.state == UIGestureRecognizerStateBegan){
        beginPanX = transP2.x;
        beginPanY = transP2.y;
    }
    
    CGFloat tmpHH = transP2.y - beginPanY;
    CGFloat tmpScale =  1 - (1/screenH * tmpHH);
    if (tmpScale < 0.2) {
        tmpScale = 0.2;
    }
    if (tmpScale > 1) {
        tmpScale = 1;
    }
    
    _scrollView.transform = CGAffineTransformMakeScale(tmpScale, tmpScale);
    //    NSLog(@"W:%f   H:%f    tmpScale:%f",_scrollView.width,_scrollView.height,tmpScale);
    _scrollView.x = 0 + transP2.x - beginPanX + (screenW-_scrollView.width)*0.5;
    _scrollView.y = 0 + transP2.y - beginPanY + (screenH-_scrollView.height)*0.1;
    _coverView.alpha = tmpScale-0.1;
    
    // 复位
    [pan setTranslation:CGPointZero inView:_scrollView];
    
    //  NSLog(@"%@",NSStringFromCGPoint(curP));
    if (pan.state == UIGestureRecognizerStateEnded) {
        if (_scrollView.width < screenW * 0.7) {
            [self clickTapGest];
        }else{
            [UIView animateWithDuration:0.3 animations:^{
                //                _scrollView.transform = CGAffineTransformMakeScale(1.0, 1.0);
                _scrollView.transform = CGAffineTransformIdentity;
                _scrollView.x = 0;
                _scrollView.y = 0;
                _coverView.alpha = 1;
            }];
        }
    }
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer{
    NSLog(@"ShouldBegin:%@",gestureRecognizer);
    if ([gestureRecognizer isKindOfClass:[UIPanGestureRecognizer class]]) {
        CGPoint translation = [(UIPanGestureRecognizer*)gestureRecognizer translationInView:self];
        if ((fabs(translation.y) > fabs(translation.x)) && (_firstImageView.imgView.width <= screenW) && (_midImageView.imgView.width <= screenW) && (_lastImageView.imgView.width <= screenW) && (translation.y > 0))    {//上下
            return YES;
        }else{
            return NO;
        }
    }
    return YES;
}



- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
    if ([gestureRecognizer isKindOfClass:[UIPanGestureRecognizer class]] && (![otherGestureRecognizer.view isKindOfClass:NSClassFromString(@"DWContentScrollView")])) {
        CGPoint translation = [(UIPanGestureRecognizer*)gestureRecognizer translationInView:self];
        if ((fabs(translation.y) > fabs(translation.x)) || _scrollView.width < screenW){//上下
            return NO;
        }
    }
    if ([otherGestureRecognizer.view isKindOfClass:NSClassFromString(@"DWContentScrollView")]) {
        DWContentScrollView *tmpScroll = (DWContentScrollView *)otherGestureRecognizer.view;
        if (tmpScroll.contentOffset.y > 0) {
            return NO;
        }else{
            return YES;
        }
    }


    return YES;
}

*/

- (void)qrCodeWithImage:(DWOrigImageView *)orgImgView{
    _codeImageView = orgImgView;
    NSMutableArray *titles = [NSMutableArray arrayWithObjects:@"保存图片", nil];
    UIImage *image = [self imageSizeWithScreenImage:orgImgView.imgView.image];

    //1. 初始化扫描仪，设置设别类型和识别质量
    CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:@{CIDetectorAccuracy: CIDetectorAccuracyHigh}];
    //2. 扫描获取的特征组
    NSArray *features = [detector featuresInImage:[CIImage imageWithCGImage:image.CGImage]];
    if (features.count) {
        //3. 获取扫描结果
        CIQRCodeFeature *feature = [features objectAtIndex:0];
        NSString *scannedResult = feature.messageString;
        [titles addObject:@"识别图中二维码"];
        _strScanResult = scannedResult;
    }else{
        _strScanResult = @"";
    }
    DWActionSheetView *alertSheetView = [[DWActionSheetView alloc] initWithTitle:nil delegate:self cancelButtonTitle:@"取消" destructiveButtonTitle:nil otherButtonTitles:titles];
    [alertSheetView xxy_show];
}

//压缩图片
- (UIImage *)imageSizeWithScreenImage:(UIImage *)image{
    CGFloat imageWidth = image.size.width;
    CGFloat imageHeight = image.size.height;
    CGFloat screenWidth = screenW;
    CGFloat screenHeight = screenH;
    
    if (imageWidth <= screenWidth && imageHeight <= screenHeight) {
        return image;
    }
    
    CGFloat max = MAX(imageWidth, imageHeight);
    CGFloat scale = max / (screenHeight * 2.0);
    
    CGSize size = CGSizeMake(imageWidth / scale, imageHeight / scale);
//    UIGraphicsBeginImageContext(size);
    UIGraphicsBeginImageContextWithOptions(size, YES, 1.0);
    [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return newImage;
    
    return nil;
}


- (void)delayMethod{
    [UIView animateWithDuration:0.5 animations:^{
        downBtn.alpha -= 1;
    } completion:^(BOOL finished) {
        downBtn.hidden = YES;
        downBtn.alpha = 1;
    }];
}

- (void)clickDownLoadBtn{//保存图片
    if (_scrollView.contentOffset.x == screenW+margin){//中间
        [_midImageView saveImage];
    }else if (_scrollView.contentOffset.x == 0){
        [_firstImageView saveImage];
    }else if(_scrollView.contentOffset.x == (screenW+margin)*2){
        [_lastImageView saveImage];
    }
}


#pragma mark -- scrollviewDelgate

// 当开始滚动视图时，执行该方法。一次有效滑动（开始滑动，滑动一小段距离，只要手指不松开，只算一次滑动），只执行一次。
- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView{
    beginDragX = scrollView.contentOffset.x;
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset{
     [self changeScrollViewOffset:scrollView];
}

- (void)scrollViewWillBeginDecelerating:(UIScrollView *)scrollView{
    [self changeScrollViewOffset:scrollView];
}

- (void)changeScrollViewOffset:(UIScrollView *)scrollView{
    if (count > 2) {
        if ((scrollView.contentOffset.x - beginDragX)>0) {//向右
            if (scrollView.contentOffset.x < screenW*0.2) {
                [scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
            }else if ((scrollView.contentOffset.x < screenW+margin+screenW*0.2)&&(scrollView.contentOffset.x > screenW*0.2 )) {
                [scrollView setContentOffset:CGPointMake(screenW+margin, 0) animated:YES];
            }else{
                [scrollView setContentOffset:CGPointMake((screenW+margin)*2, 0) animated:YES];
            }
        }else{//向左
            if(scrollView.contentOffset.x < screenW*0.8+margin) {
                [scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
            }else if (scrollView.contentOffset.x < ((screenW+margin)*2 - screenW*0.2) && (scrollView.contentOffset.x > (screenW+margin-screenW*0.2 ))) {
                [scrollView setContentOffset:CGPointMake(screenW+margin, 0) animated:YES];
            }else{
                [scrollView setContentOffset:CGPointMake((screenW+margin)*2, 0) animated:YES];
            }
        }
    }else if(count == 2){
        if ((scrollView.contentOffset.x - beginDragX)>0) {//向右
            if (scrollView.contentOffset.x < screenW*0.2) {
                [scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
            }else{
                [scrollView setContentOffset:CGPointMake(screenW+margin, 0) animated:YES];
            }
        }else{//向左
            if(scrollView.contentOffset.x < screenW*0.8+margin) {
                [scrollView setContentOffset:CGPointMake(0, 0) animated:YES];
            }else{
                [scrollView setContentOffset:CGPointMake(screenW+margin, 0) animated:YES];
            }
        }
    }
}

- (void)scrollViewDidEndScrollingAnimation:(UIScrollView *)scrollView{
    if (count > 3) {
        if ((scrollView.contentOffset.x == screenW+margin) && (fristContentX != scrollView.contentOffset.x)){//中间
            if (showIndex == 0) {
                showIndex += 1;
                [_firstImageView restoreView];
            }else{
                showIndex -= 1;
                [_lastImageView restoreView];
            }
            fristContentX = scrollView.contentOffset.x;
            
        }else if ((scrollView.contentOffset.x == 0) && (fristContentX != scrollView.contentOffset.x)){
            showIndex -= 1;
            if (showIndex != 0) {
                [_midImageView setupImgViewWithDict:_imgArr[showIndex]];
                [scrollView setContentOffset:CGPointMake(screenW+margin, 0) animated:NO];
                [_firstImageView setupImgViewWithDict:_imgArr[showIndex-1]];
                [_lastImageView setupImgViewWithDict:_imgArr[showIndex+1]];
            }
            fristContentX = scrollView.contentOffset.x;
            [_midImageView restoreView];
        }else if((scrollView.contentOffset.x == (screenW+margin)*2) && (fristContentX != scrollView.contentOffset.x)){
            
            showIndex += 1;
            if (showIndex != (_imgArr.count-1)) {
                [_midImageView setupImgViewWithDict:_imgArr[showIndex]];
                [scrollView setContentOffset:CGPointMake(screenW+margin, 0) animated:NO];
                [_firstImageView setupImgViewWithDict:_imgArr[showIndex-1]];
                [_lastImageView setupImgViewWithDict:_imgArr[showIndex+1]];
            }
            fristContentX = scrollView.contentOffset.x;
            [_midImageView restoreView];
        }
    }else if (count == 2){
        if ((scrollView.contentOffset.x == screenW+margin) && (fristContentX != scrollView.contentOffset.x)){//第二
            fristContentX = scrollView.contentOffset.x;
            [_firstImageView restoreView];
            showIndex = 1;
            
        }else if ((scrollView.contentOffset.x == 0) && (fristContentX != scrollView.contentOffset.x)){//第一
            
            fristContentX = scrollView.contentOffset.x;
            [_midImageView restoreView];
            showIndex = 0;
        }
    }
    else if (count == 3){
        if ((scrollView.contentOffset.x == screenW+margin) && (fristContentX != scrollView.contentOffset.x)){//第二
            showIndex = 1;
            fristContentX = scrollView.contentOffset.x;
            [_firstImageView restoreView];
            [_lastImageView restoreView];
            
        }else if ((scrollView.contentOffset.x == 0) && (fristContentX != scrollView.contentOffset.x)){//第一
            showIndex = 0;
            fristContentX = scrollView.contentOffset.x;
            [_midImageView restoreView];
        }else if((scrollView.contentOffset.x == (screenW+margin)*2) && (fristContentX != scrollView.contentOffset.x)){
            showIndex = 2;
            fristContentX = scrollView.contentOffset.x;
            [_midImageView restoreView];
        }
    }
}

#pragma mark - XXYActionSheetViewDelegate
- (void)actionSheet:(DWActionSheetView *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex{
    if (buttonIndex != actionSheet.cancelButtonIndex){
        if (buttonIndex == 0) {//保存图片
            [_codeImageView saveImage];
        }else if(buttonIndex == 1){//识别二维码
            if ([self.delegate respondsToSelector:@selector(origImageViewClickScannedImg:)]) {
                [self.delegate origImageViewClickScannedImg:_strScanResult];
            }
        }
    }
}

@end
