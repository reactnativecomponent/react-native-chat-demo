//
//  DWInputBarControl.h
//  DWInputViewDemo
//
//  Created by Dowin on 2017/7/3.
//  Copyright © 2017年 Dowin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DWRecordButton.h"
#import "HPGrowingTextView.h"
#import <React/RCTComponent.h>
#import "NIMInputEmoticonContainerView.h"

#define screenW [UIScreen mainScreen].bounds.size.width
#define screenH [UIScreen mainScreen].bounds.size.height
#define DESIGN_SIZE_750(length) (screenW*((length)/750.0)) //根据设计图算长度
#define expressionViewH 216
#define menuViewH 240

typedef enum{
    DWInputBarControlBtnTypeRecord = 1001,
    DWInputBarControlBtnTypeExpression,
    DWInputBarControlBtnTypeMenu
    
}DWInputBarControlBtnType;

@protocol DWInputBarControlDelegate <NSObject>

- (void)inputBarClickBtn:(UIButton *)btn;//点击按钮


@end

@interface DWInputBarControl : UIView
@property (assign, nonatomic) CGFloat toolH;
//@property (assign, nonatomic) CGFloat menuViewH;
@property (strong, nonatomic) NIMInputEmoticonContainerView *expressionView;
@property (strong, nonatomic) UIView *functionView;
@property (strong, nonatomic) UIView *toolView;
@property (strong, nonatomic) UIButton *showExpressionBtn;//显示表情按钮
@property (strong, nonatomic) UIButton *showMenuBtn;//显示菜单按钮
@property (strong, nonatomic) UIButton *showRecordeBtn;
@property (strong, nonatomic) HPGrowingTextView *inputGrowView;
@property (strong, nonatomic) DWRecordButton *recordBtn;
@property (assign, nonatomic) CGFloat defaultToolHeight;
@property (assign, nonatomic) CGFloat inputViewHeight;

@property (assign, nonatomic) id<DWInputBarControlDelegate> delegate;

@property (nonatomic, copy) RCTBubblingEventBlock onFeatureView;
@property (nonatomic, copy) RCTBubblingEventBlock onShowKeyboard;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeBarHeight;
@property (nonatomic, copy) RCTBubblingEventBlock onSendTextMessage;
@property (nonatomic, copy) RCTBubblingEventBlock onSendRecordMessage;
@property (nonatomic, copy) RCTBubblingEventBlock onClickMention;
@end
