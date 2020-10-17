//
//  IMUIMessageListViewManager.m
//  imuiDemo
//
//  Created by oshumini on 2017/5/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RCTMessageListView.h"
#import <RCTAuroraIMUI/RCTAuroraIMUI-Swift.h>

@interface RCTMessageListViewManager : RCTViewManager <IMUIMessageMessageCollectionViewDelegate>

//@property (nonatomic, copy) RCTBubblingEventBlock messageListEventCallBack;
@property (strong, nonatomic)RCTMessageListView *messageList;

/// Tells the delegate that user tap message cell
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that user tap message bubble
- (void)messageCollectionViewWithTapCellView:(NSString * )tapCellView;
- (void)messageCollectionViewWithLongTapCellViewModel:(id <IMUIMessageModelProtocol> _Nonnull)model;
- (void)messageCollectionViewWithLongTapAvatarPressWithModel:(id <IMUIMessageModelProtocol> _Nonnull)model;
- (void)messageCollectionViewWithDidTapMessageBubbleInCell:(UICollectionViewCell * _Nonnull)didTapMessageBubbleInCell;

- (void)messageCollectionViewWithOpenMessageBubbleUrl:(NSString *)url;


- (void)messageCollectionViewWithDidShowMenuStr:(NSString *)strMenu model:(id <IMUIMessageModelProtocol> _Nonnull)model;
- (void)messageCollectionViewWithReloadMoreData:(NSString *)data;
- (void)messageCollectionViewWithChangeAutoScroll:(BOOL *)isAutoScroll;
//- (void)messageCollectionViewWithDidTapImageMessageBubbleInCell:(CGRect)rect model:(id <IMUIMessageModelProtocol> _Nonnull)model;

/// Tells the delegate that user tap header image in message cell
- (void)messageCollectionViewWithDidTapHeaderImageInCell:(UICollectionViewCell * _Nonnull)didTapHeaderImageInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that user tap statusView in message cell
- (void)messageCollectionViewWithDidTapStatusViewInCell:(UICollectionViewCell * _Nonnull)didTapStatusViewInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that the message cell will show in screen
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ willDisplayMessageCell:(UICollectionViewCell * _Nonnull)willDisplayMessageCell forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that message cell end displaying
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ didEndDisplaying:(UICollectionViewCell * _Nonnull)didEndDisplaying forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate when messageCollection beginDragging
- (void)messageCollectionView:(UICollectionView * _Nonnull)willBeginDragging;

- (void)messageCollectionViewWithDidTapValidationWithModel:(id <IMUIMessageModelProtocol> _Nonnull)model;


@end

@implementation RCTMessageListViewManager

RCT_EXPORT_VIEW_PROPERTY(initalData, NSArray)

RCT_EXPORT_VIEW_PROPERTY(onAvatarClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMsgClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMsgOpenUrlClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDealWithMenuClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStatusViewClick, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onBeginDragMessageList, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClickLoadMessages, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClickChangeAutoScroll, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClickLongTapCell, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClickScanImageView, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClickSendValidation, RCTBubblingEventBlock)

//RCT_EXPORT_VIEW_PROPERTY(onClickTapImageMessageBubble, RCTBubblingEventBlock)

RCT_EXPORT_MODULE()
- (UIView *)view
{
//  let bundle = Bundle.imuiBundle()
//  view = bundle.loadNibNamed("IMUIMessageCollectionView", owner: self, options: nil)?.first as! UIView
//  NSBundle *bundle = [NSBundle bundleForClass: [RCTMessageListView class]];
    NSURL *url = [[NSBundle mainBundle] URLForResource:@"NIMKitEmoticon.bundle"
                                             withExtension:nil];
        NSBundle *bundle = [NSBundle bundleWithURL:url];
  _messageList = [[bundle loadNibNamed:@"RCTMessageListView" owner:self options: nil] objectAtIndex:0];
  _messageList.messageList.delegate = self;
    
  _messageList.delegate = self;
  
  
  return _messageList;
  
}

RCT_CUSTOM_VIEW_PROPERTY(sendBubble, NSDictionary, RCTMessageListView) {
  NSDictionary *bubbleDic = [RCTConvert NSDictionary: json];
  NSString *bubbleName = bubbleDic[@"imageName"];
  
  if (bubbleName == nil) { return; }
  if (bubbleDic[@"padding"] == nil) { return; }
  
  NSNumber *top = bubbleDic[@"padding"][@"top"];
  NSNumber *right = bubbleDic[@"padding"][@"right"];
  NSNumber *left = bubbleDic[@"padding"][@"left"];
  NSNumber *bottom = bubbleDic[@"padding"][@"bottom"];
  
  UIImage *bubbleImg = [UIImage imageNamed:bubbleName];
  bubbleImg = [bubbleImg resizableImageWithCapInsets: UIEdgeInsetsMake([top floatValue], [left floatValue], [bottom floatValue], [right floatValue]) resizingMode: UIImageResizingModeTile];
  RCTMessageModel.outgoingBubbleImage = bubbleImg;
}

RCT_CUSTOM_VIEW_PROPERTY(receiveBubble, NSDictionary, RCTMessageListView) {
  NSDictionary *bubbleDic = [RCTConvert NSDictionary: json];
  NSString *bubbleName = bubbleDic[@"imageName"];
  
  if (bubbleName == nil) { return; }
  if (bubbleDic[@"padding"] == nil) { return; }
  
  NSNumber *top = bubbleDic[@"padding"][@"top"];
  NSNumber *right = bubbleDic[@"padding"][@"right"];
  NSNumber *left = bubbleDic[@"padding"][@"left"];
  NSNumber *bottom = bubbleDic[@"padding"][@"bottom"];
  
  UIImage *bubbleImg = [UIImage imageNamed:bubbleName];
  bubbleImg = [bubbleImg resizableImageWithCapInsets: UIEdgeInsetsMake([top floatValue], [left floatValue], [bottom floatValue], [right floatValue]) resizingMode: UIImageResizingModeTile];
  RCTMessageModel.incommingBubbleImage = bubbleImg;
  
}


RCT_CUSTOM_VIEW_PROPERTY(sendBubbleTextColor, NSString, RCTMessageListView) {
  NSString *colorString = [RCTConvert NSString: json];
  UIColor *color = [UIColor hexStringToUIColorWithHex:colorString];
  if (color != nil) {
    IMUITextMessageCell.outGoingTextColor = color;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(receiveBubbleTextColor, NSString, RCTMessageListView) {
  NSString *colorString = [RCTConvert NSString: json];
  UIColor *color = [UIColor hexStringToUIColorWithHex:@"colorString"];
  if (color != nil) {
    IMUITextMessageCell.inComingTextColor = color;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(sendBubbleTextSize, NSNumber, RCTMessageListView) {
  NSNumber *textSize = [RCTConvert NSNumber: json];
  IMUITextMessageCell.outGoingTextFont = [UIFont systemFontOfSize:[textSize floatValue]];
}

RCT_CUSTOM_VIEW_PROPERTY(receiveBubbleTextSize, NSNumber, RCTMessageListView) {
  NSNumber *textSize = [RCTConvert NSNumber: json];
  IMUITextMessageCell.inComingTextFont = [UIFont systemFontOfSize:[textSize floatValue]];
}

RCT_CUSTOM_VIEW_PROPERTY(dateTextSize, NSNumber, RCTMessageListView) {
  NSNumber *dateTextSize = [RCTConvert NSNumber: json];
  IMUIMessageCellLayout.timeStringFont = [UIFont systemFontOfSize: [dateTextSize floatValue]];
  
}

RCT_CUSTOM_VIEW_PROPERTY(dateTextColor, NSString, RCTMessageListView) {
  NSString *colorString = [RCTConvert NSString: json];
  UIColor *color = [UIColor hexStringToUIColorWithHex:@"colorString"];
  if (color != nil) {
    IMUIMessageCellLayout.timeStringColor = color;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(avatarSize, NSDictionary, RCTMessageListView) {
  NSDictionary *avatarSize = [RCTConvert NSDictionary: json];
  NSNumber *width = avatarSize[@"width"];
  NSNumber *height = avatarSize[@"height"];
  IMUIMessageCellLayout.avatarSize = CGSizeMake([width floatValue], [height floatValue]);
}

RCT_CUSTOM_VIEW_PROPERTY(isShowDisplayName, BOOL, RCTMessageListView) {
  BOOL needShowDisPlayName = [RCTConvert BOOL: json];
  IMUIMessageCellLayout.isNeedShowInComingName = needShowDisPlayName;
  IMUIMessageCellLayout.isNeedShowOutGoingName = needShowDisPlayName;
}

RCT_CUSTOM_VIEW_PROPERTY(isShowOutgoingDisplayName, BOOL, RCTMessageListView) {
  BOOL needShowDisPlayName = [RCTConvert BOOL: json];
  IMUIMessageCellLayout.isNeedShowOutGoingName = needShowDisPlayName;
}

RCT_CUSTOM_VIEW_PROPERTY(isShowIncommingDisplayName, BOOL, RCTMessageListView) {
  BOOL needShowDisPlayName = [RCTConvert BOOL: json];
  IMUIMessageCellLayout.isNeedShowInComingName = needShowDisPlayName;
}

RCT_CUSTOM_VIEW_PROPERTY(sendBubblePadding, NSDictionary, RCTMessageListView) {
  NSDictionary *bubblePadding = [RCTConvert NSDictionary: json];
  NSNumber *left = bubblePadding[@"left"];
  NSNumber *top = bubblePadding[@"top"];
  NSNumber *right = bubblePadding[@"right"];
  NSNumber *bottom = bubblePadding[@"bottom"];
  MyMessageCellLayout.outgoingPadding = UIEdgeInsetsMake([top floatValue], [left floatValue], [bottom floatValue], [right floatValue]);
}

RCT_CUSTOM_VIEW_PROPERTY(receiveBubblePadding, NSDictionary, RCTMessageListView) {
  NSDictionary *bubblePadding = [RCTConvert NSDictionary: json];
  NSNumber *left = bubblePadding[@"left"];
  NSNumber *top = bubblePadding[@"top"];
  NSNumber *right = bubblePadding[@"right"];
  NSNumber *bottom = bubblePadding[@"bottom"];
  MyMessageCellLayout.incommingPadding = UIEdgeInsetsMake([top floatValue], [left floatValue], [bottom floatValue], [right floatValue]);
}

- (RCTMessageModel *)convertMessageDicToModel:(NSMutableDictionary *)message {
  return [[RCTMessageModel alloc] initWithMessageDic: message];
}

// - MARK: IMUIMessageCollectionViewDelegate

//- (void)sendEventWithType:(NSString *)type model:(id)model {
//  if(!_messageList.onEventCallBack) { return; }
//  
//  NSMutableDictionary *event = @{}.mutableCopy;
//  RCTMessageModel *message = model;
//  NSDictionary *msgDic = message.messageDictionary;
//  event[@"message"] = msgDic;
//  event[@"type"] = type;
//  _messageList.onEventCallBack(event);/Users/HuminiOS/Desktop/myproject/reactNative/testheiheihei/index.ios.js
//}

//- (void)sendEventWithType:(NSString *)type {
//  if(!_messageList.onEventCallBack) { return; }
//  
//  NSMutableDictionary *event = @{}.mutableCopy;
//  event[@"type"] = type;
//  _messageList.onEventCallBack(event);
//}

/// Tells the delegate that user tap message bubble
- (void)messageCollectionViewWithDidTapMessageBubbleInCell:(UICollectionViewCell *)didTapMessageBubbleInCell model:(id)model {

    if(!_messageList.onMsgClick) { return; }
    RCTMessageModel *message = model;
    NSDictionary *messageDic = message.messageDictionary;
    _messageList.onMsgClick((@{@"message": messageDic}));
}

- (void)messageCollectionViewWithTapCellView:(NSString *)tapCellView{//隐藏键盘
    if(!_messageList.onBeginDragMessageList) { return; }
    _messageList.onBeginDragMessageList(@{});
}

- (void)messageCollectionViewWithOpenMessageBubbleUrl:(NSString *)url{
    if(!_messageList.onMsgOpenUrlClick) { return; }
    _messageList.onMsgOpenUrlClick((@{@"url": url}));
}

- (void)messageCollectionViewWithLongTapCellViewModel:(id <IMUIMessageModelProtocol> _Nonnull)model{
    if(!_messageList.onClickLongTapCell) { return; }
    RCTMessageModel *message = model;
    NSDictionary *messageDic = message.messageDictionary;
    _messageList.onClickLongTapCell((@{@"message": messageDic}));
    
}
//长按头像
- (void)messageCollectionViewWithLongTapAvatarPressWithModel:(id <IMUIMessageModelProtocol> _Nonnull)model{
    RCTMessageModel *message = model;
    NSDictionary *messageDic = message.messageDictionary;
    NSDictionary *fromUser = [messageDic objectForKey:@"fromUser"];
    NSString *strName = [NSString stringWithFormat:@"%@",[fromUser objectForKey:@"name"]];
    NSString *strUserID = [NSString stringWithFormat:@"%@",[fromUser objectForKey:@"_id"]];
    NSDictionary *personDict = [NSDictionary dictionaryWithObjects:@[strName,strUserID,@"Yes"] forKeys:@[@"name",@"userId",@"isLongGest"]];
    [[NSNotificationCenter defaultCenter]postNotificationName:@"GetAtPersonNotification" object:personDict];
    
    
}

- (void)messageCollectionViewWithDidShowMenuStr:(NSString *)strMenu model:(id<IMUIMessageModelProtocol>)model{
    if(!_messageList.onDealWithMenuClick) { return; }
    RCTMessageModel *message = model;
    NSDictionary *messageDic = message.messageDictionary;
    _messageList.onDealWithMenuClick((@{@"message": messageDic,@"strMenu":strMenu}));
}

/// Tells the delegate that user tap message cell
//self.delegate?.messageCollectionView(didTapMessageBubbleInCell: self, model: self.message!)
- (void)messageCollectionView:(UICollectionView *)_ forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id)model {
}

/// Tells the delegate that user tap header image in message cell
- (void)messageCollectionViewWithDidTapHeaderImageInCell:(UICollectionViewCell * _Nonnull)didTapHeaderImageInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model {

  if(!_messageList.onAvatarClick) { return; }
  RCTMessageModel *message = model;
  NSDictionary *messageDic = message.messageDictionary;
  _messageList.onAvatarClick(@{@"message": messageDic});
}
/// Tells the delegate that user tap statusView in message cell
- (void)messageCollectionViewWithDidTapStatusViewInCell:(UICollectionViewCell * _Nonnull)didTapStatusViewInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model {

  if(!_messageList.onStatusViewClick) { return; }
  RCTMessageModel *message = model;
  NSDictionary *messageDic = message.messageDictionary;
  _messageList.onStatusViewClick((@{@"message": messageDic}));
}

/// Tells the delegate that the message cell will show in screen
- (void)messageCollectionView:(UICollectionView * _Nonnull)aaa willDisplayMessageCell:(UICollectionViewCell * _Nonnull)willDisplayMessageCell forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model {
  
}
/// Tells the delegate that message cell end displaying
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ didEndDisplaying:(UICollectionViewCell * _Nonnull)didEndDisplaying forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model {
  
}
/// Tells the delegate when messageCollection beginDragging
- (void)messageCollectionView:(UICollectionView * _Nonnull)willBeginDragging {
  if(!_messageList.onBeginDragMessageList) { return; }
  
  _messageList.onBeginDragMessageList(@{});
}

- (void)messageCollectionViewWithReloadMoreData:(NSString *)data{//刷新数据
    if(!_messageList.onClickLoadMessages) { return; }
    
    _messageList.onClickLoadMessages(@{});

}

- (void)messageCollectionViewWithChangeAutoScroll:(BOOL *)isAutoScroll{//改变自动滚动状态
    if(!_messageList.onClickChangeAutoScroll) { return; }
    _messageList.onClickChangeAutoScroll(@{ @"isAutoScroll": [NSNumber numberWithBool:isAutoScroll]});
}

-(void)onClickScanImageView:(NSString *)strResult{
    if (!_messageList.onClickScanImageView) { return; }
    _messageList.onClickScanImageView(@{ @"result": strResult});
}

- (void)messageCollectionViewWithDidTapValidationWithModel:(id<IMUIMessageModelProtocol>)model{
    if(!_messageList.onClickSendValidation) { return; }
    _messageList.onClickSendValidation(@{@"message": @""});
}


//- (void)messageCollectionViewWithDidTapImageMessageBubbleInCell:(CGRect)rect model:(id<IMUIMessageModelProtocol> _Nonnull)model{
//    if (!_messageList.onClickTapImageMessageBubble) {return;}
//    RCTMessageModel *message = model;
//    NSMutableDictionary *messageDic = message.messageDictionary;
//    NSString *strRect = NSStringFromCGRect(rect);
//    [messageDic setObject:strRect forKey:@"rect"];
//    _messageList.onClickTapImageMessageBubble(@{@"message": messageDic});
//}


//- (void)onPullToRefreshMessageList {
//    
//    NSLog(@"1233333");
//  if(!_messageList.onPullToRefresh) { return; }
//  
//  _messageList.onPullToRefresh(@{});
//}
@end
