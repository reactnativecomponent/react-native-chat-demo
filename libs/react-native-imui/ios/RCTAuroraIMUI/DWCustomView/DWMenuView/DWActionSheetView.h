//
//  DWActionSheetView.h
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/9/12.
//  Copyright © 2017年 HXHG. All rights reserved.
//

#import <UIKit/UIKit.h>

@class DWActionSheetView;


@protocol DWActionSheetViewDelegate <NSObject>

@optional

/**
 选中第几个
 */
- (void)actionSheet:(DWActionSheetView *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex;

/**
 即将消失

 */
- (void)actionSheet:(DWActionSheetView *)actionSheet willDismissWithButtonIndex:(NSInteger)buttonIndex;

/**
 已经消失

 */
- (void)actionSheet:(DWActionSheetView *)actionSheet didDismissWithButtonIndex:(NSInteger)buttonIndex;


@end

typedef void(^DWActionSheetViewBlock)(NSInteger index);

@interface DWActionSheetView : UIView

/**
 操作按钮个数
 */
@property (nonatomic, assign, readonly) NSInteger numberOfButtons;

/**
 取消按钮
 */
@property (nonatomic, assign, readonly) NSInteger cancelButtonIndex;


@property (nonatomic, assign, readonly) NSInteger destructiveButtonIndex;

/**
 声明代理
 */
@property (nonatomic, weak) id<DWActionSheetViewDelegate>actionSheetViewDelegate;

/**
 操作block
 */
@property (nonatomic, copy) DWActionSheetViewBlock acitonSheetBlock;


#pragma mark - methods

/**
 初始化 代理方法调用
 */
- (instancetype)initWithTitle:(NSString *)title delegate:(id<DWActionSheetViewDelegate>)actionSheetViewDelegate cancelButtonTitle:(NSString *)cancelButtonTitle destructiveButtonTitle:(NSString *)destructiveButtonTitle otherButtonTitles:(NSArray *)otherButtonTitles;

/**
 初始化   block方式调用
 
 @param title 提示语
 @param cancelButtonTitle 取消按钮
 @param destructiveButtonTitle 确定按钮
 @param otherButtons 其他操作 可以为nil
 @param actionSheetBlock 操作事件block

 */
- (instancetype)initWithTitle:(NSString *)title
            cancelButtonTitle:(NSString *)cancelButtonTitle
       destructiveButtonTitle:(NSString *)destructiveButtonTitle
            otherButtonTitles:(NSArray *)otherButtons
             actionSheetBlock:(DWActionSheetViewBlock)actionSheetBlock;

/**
 显示
 */
- (void)xxy_show;

/**
 点击操作按钮

 */
- (NSString *)xxy_buttonTitleAtIndex:(NSInteger)buttonIndex;

@end
