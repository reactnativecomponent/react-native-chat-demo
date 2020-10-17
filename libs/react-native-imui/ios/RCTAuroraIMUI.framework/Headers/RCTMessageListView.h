//
//  RCTMessageListView.h
//  imuiDemo
//
//  Created by oshumini on 2017/5/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//


#import <UIKit/UIKit.h>
#import <RCTAuroraIMUI/RCTAuroraIMUI-Swift.h>

#import <React/RCTComponent.h>

@protocol RCTMessageListDelegate <NSObject>
@optional
//- (void)onPullToRefreshMessageList;
- (void)onClickScanImageView:(NSString *)strResult;

@end

@interface RCTMessageListView : UIView
@property(weak, nonatomic) id<RCTMessageListDelegate> delegate;
@property(weak, nonatomic) IBOutlet IMUIMessageCollectionView *messageList;
//@property(strong, nonatomic)UIRefreshControl *refreshControl;

@property(nonatomic, copy) RCTBubblingEventBlock onAvatarClick;
@property(nonatomic, copy) RCTBubblingEventBlock onMsgClick;
@property(nonatomic, copy) RCTBubblingEventBlock onMsgOpenUrlClick;
@property(nonatomic, copy) RCTBubblingEventBlock onDealWithMenuClick;
@property(nonatomic, copy) RCTBubblingEventBlock onStatusViewClick;

@property(nonatomic, copy) RCTBubblingEventBlock onBeginDragMessageList;
@property (nonatomic, copy) RCTBubblingEventBlock onClickLoadMessages;
@property (nonatomic, copy) RCTBubblingEventBlock onClickChangeAutoScroll;
@property(nonatomic, copy) RCTBubblingEventBlock onClickLongTapCell;
@property(nonatomic, copy) RCTBubblingEventBlock onClickScanImageView;
@property(nonatomic, copy) RCTBubblingEventBlock onClickSendValidation;
//@property(nonatomic, copy) RCTBubblingEventBlock onClickTapImageMessageBubble;


@property (copy, nonatomic) NSArray *initalData;
// custom layout
@property(strong, nonatomic) NSDictionary *sendBubble;

@property(strong, nonatomic) NSDictionary *receiveBubble;

@property(strong, nonatomic) NSString *sendBubbleTextColor;

@property(strong, nonatomic) NSString *receiveBubbleTextColor;

@property(assign, nonatomic) NSNumber *sendBubbleTextSize;

@property(assign, nonatomic) NSNumber *receiveBubbleTextSize;

@property(assign, nonatomic) NSNumber *dateTextSize;

@property(strong, nonatomic) NSString *dateTextColor;

@property(strong, nonatomic) NSDictionary *avatarSize;

@property(assign, nonatomic)BOOL isshowDisplayName;

@property(assign, nonatomic)BOOL isShowOutgoingDisplayName;

@property(assign, nonatomic)BOOL isShowIncommingDisplayName;

@property(strong, nonatomic) NSDictionary *sendBubblePadding;

@property(strong, nonatomic) NSDictionary *receiveBubblePadding;

@end
