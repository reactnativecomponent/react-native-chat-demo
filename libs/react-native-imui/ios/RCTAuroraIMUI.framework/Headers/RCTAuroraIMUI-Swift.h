// Generated by Apple Swift version 5.3 (swiftlang-1200.0.29.2 clang-1200.0.30.1)
#ifndef RCTAURORAIMUI_SWIFT_H
#define RCTAURORAIMUI_SWIFT_H
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgcc-compat"

#if !defined(__has_include)
# define __has_include(x) 0
#endif
#if !defined(__has_attribute)
# define __has_attribute(x) 0
#endif
#if !defined(__has_feature)
# define __has_feature(x) 0
#endif
#if !defined(__has_warning)
# define __has_warning(x) 0
#endif

#if __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wauto-import"
#include <Foundation/Foundation.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus)
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if __has_attribute(ns_consumed)
# define SWIFT_RELEASES_ARGUMENT __attribute__((ns_consumed))
#else
# define SWIFT_RELEASES_ARGUMENT
#endif
#if __has_attribute(warn_unused_result)
# define SWIFT_WARN_UNUSED_RESULT __attribute__((warn_unused_result))
#else
# define SWIFT_WARN_UNUSED_RESULT
#endif
#if __has_attribute(noreturn)
# define SWIFT_NORETURN __attribute__((noreturn))
#else
# define SWIFT_NORETURN
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif
#if !defined(SWIFT_RESILIENT_CLASS)
# if __has_attribute(objc_class_stub)
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME) __attribute__((objc_class_stub))
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_class_stub)) SWIFT_CLASS_NAMED(SWIFT_NAME)
# else
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME)
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) SWIFT_CLASS_NAMED(SWIFT_NAME)
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM_ATTR)
# if defined(__has_attribute) && __has_attribute(enum_extensibility)
#  define SWIFT_ENUM_ATTR(_extensibility) __attribute__((enum_extensibility(_extensibility)))
# else
#  define SWIFT_ENUM_ATTR(_extensibility)
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name, _extensibility) enum _name : _type _name; enum SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# if __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) SWIFT_ENUM(_type, _name, _extensibility)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if !defined(SWIFT_UNAVAILABLE_MSG)
# define SWIFT_UNAVAILABLE_MSG(msg) __attribute__((unavailable(msg)))
#endif
#if !defined(SWIFT_AVAILABILITY)
# define SWIFT_AVAILABILITY(plat, ...) __attribute__((availability(plat, __VA_ARGS__)))
#endif
#if !defined(SWIFT_WEAK_IMPORT)
# define SWIFT_WEAK_IMPORT __attribute__((weak_import))
#endif
#if !defined(SWIFT_DEPRECATED)
# define SWIFT_DEPRECATED __attribute__((deprecated))
#endif
#if !defined(SWIFT_DEPRECATED_MSG)
# define SWIFT_DEPRECATED_MSG(...) __attribute__((deprecated(__VA_ARGS__)))
#endif
#if __has_feature(attribute_diagnose_if_objc)
# define SWIFT_DEPRECATED_OBJC(Msg) __attribute__((diagnose_if(1, Msg, "warning")))
#else
# define SWIFT_DEPRECATED_OBJC(Msg) SWIFT_DEPRECATED_MSG(Msg)
#endif
#if !defined(IBSegueAction)
# define IBSegueAction
#endif
#if __has_feature(modules)
#if __has_warning("-Watimport-in-framework-header")
#pragma clang diagnostic ignored "-Watimport-in-framework-header"
#endif
@import AVFoundation;
@import CoreGraphics;
@import Foundation;
@import ObjectiveC;
@import UIKit;
#endif

#import <RCTAuroraIMUI/RCTAuroraIMUI.h>

#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
#if __has_warning("-Wpragma-clang-attribute")
# pragma clang diagnostic ignored "-Wpragma-clang-attribute"
#endif
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wnullability"

#if __has_attribute(external_source_symbol)
# pragma push_macro("any")
# undef any
# pragma clang attribute push(__attribute__((external_source_symbol(language="Swift", defined_in="RCTAuroraIMUI",generated_declaration))), apply_to=any(function,enum,objc_interface,objc_category,objc_protocol))
# pragma pop_macro("any")
#endif



SWIFT_CLASS("_TtC13RCTAuroraIMUI21IMUIAudioPlayerHelper")
@interface IMUIAudioPlayerHelper : NSObject
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) IMUIAudioPlayerHelper * _Nonnull sharedInstance;)
+ (IMUIAudioPlayerHelper * _Nonnull)sharedInstance SWIFT_WARN_UNUSED_RESULT;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
- (void)stopAudio;
@end

@class AVAudioPlayer;

@interface IMUIAudioPlayerHelper (SWIFT_EXTENSION(RCTAuroraIMUI)) <AVAudioPlayerDelegate>
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer * _Nonnull)player successfully:(BOOL)flag;
@end

@class IMUIMessageBubbleView;
@class NSCoder;
@class MenuPopOverView;

SWIFT_CLASS("_TtC13RCTAuroraIMUI19IMUIBaseMessageCell")
@interface IMUIBaseMessageCell : UICollectionViewCell <MenuPopOverViewDelegate, UIAlertViewDelegate>
@property (nonatomic, strong) IMUIMessageBubbleView * _Nonnull bubbleView;
@property (nonatomic, copy) NSString * _Nullable cellType;
@property (nonatomic, copy) NSString * _Nullable cellMsgId;
- (nonnull instancetype)initWithFrame:(CGRect)frame SWIFT_UNAVAILABLE;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)popoverView:(MenuPopOverView * _Null_unspecified)popoverView didSelectItem:(NSString * _Null_unspecified)strIndex;
- (void)popoverViewDidDismiss:(MenuPopOverView * _Null_unspecified)popoverView;
@end


SWIFT_CLASS("_TtC13RCTAuroraIMUI23IMUIBaseMessageHeadCell")
@interface IMUIBaseMessageHeadCell : UICollectionViewCell
- (nonnull instancetype)initWithFrame:(CGRect)frame SWIFT_UNAVAILABLE;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
@end


SWIFT_CLASS("_TtC13RCTAuroraIMUI24IMUILiveVideoMessageCell")
@interface IMUILiveVideoMessageCell : IMUIBaseMessageCell
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder SWIFT_UNAVAILABLE;
- (void)layoutSubviews;
@end

@class UIImage;

SWIFT_CLASS("_TtC13RCTAuroraIMUI21IMUIMessageBubbleView")
@interface IMUIMessageBubbleView : UIImageView
- (nonnull instancetype)initWithFrame:(CGRect)frame SWIFT_UNAVAILABLE;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)layoutSubviews;
- (nonnull instancetype)initWithImage:(UIImage * _Nullable)image SWIFT_UNAVAILABLE;
- (nonnull instancetype)initWithImage:(UIImage * _Nullable)image highlightedImage:(UIImage * _Nullable)highlightedImage SWIFT_UNAVAILABLE;
@end

@protocol IMUIMessageStatusViewProtocal;

/// each IMUIMessageBaseCell need IMUIMessageCellLayoutProtocal to display message cell item
SWIFT_PROTOCOL("_TtP13RCTAuroraIMUI29IMUIMessageCellLayoutProtocal_")
@protocol IMUIMessageCellLayoutProtocal <NSObject>
/// return message cell height
@property (nonatomic, readonly) CGFloat cellHeight;
/// return avatar frame
@property (nonatomic, readonly) CGRect avatarFrame;
/// return time label frame in the layout
@property (nonatomic, readonly) CGRect timeLabelFrame;
/// return message bubble frame in the layout
@property (nonatomic, readonly) CGRect bubbleFrame;
/// return contents inset in message bubble
@property (nonatomic, readonly) UIEdgeInsets bubbleContentInset;
/// return IMUIMessageBaseCell content inset
@property (nonatomic, readonly) UIEdgeInsets cellContentInset;
/// return IMUIMessageBaseCell’s status View
@property (nonatomic, readonly, strong) id <IMUIMessageStatusViewProtocal> _Nonnull statusView;
/// return statusView’s frame
@property (nonatomic, readonly) CGRect statusViewFrame;
/// return nameLabel’s frame
@property (nonatomic, readonly) CGRect nameLabelFrame;
@property (nonatomic, readonly) CGRect durationLabelFrame;
@property (nonatomic, readonly) CGRect isPlayedFrame;
@end

@class UIColor;
@class UIFont;

/// The ‘IMUIMessageCellLayout’ is a concrete layout object comfort
/// ‘IMUIMessageCellLayoutProtocal’ protocol.
/// each IMUIMessageBaseCell need IMUIMessageCellLayoutProtocal to layout cell’s items
SWIFT_CLASS("_TtC13RCTAuroraIMUI21IMUIMessageCellLayout")
@interface IMUIMessageCellLayout : NSObject <IMUIMessageCellLayoutProtocal>
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGSize avatarSize;)
+ (CGSize)avatarSize SWIFT_WARN_UNUSED_RESULT;
+ (void)setAvatarSize:(CGSize)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIOffset avatarOffsetToCell;)
+ (UIOffset)avatarOffsetToCell SWIFT_WARN_UNUSED_RESULT;
+ (void)setAvatarOffsetToCell:(UIOffset)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGRect timeLabelFrame;)
+ (CGRect)timeLabelFrame SWIFT_WARN_UNUSED_RESULT;
+ (void)setTimeLabelFrame:(CGRect)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGSize nameLabelSize;)
+ (CGSize)nameLabelSize SWIFT_WARN_UNUSED_RESULT;
+ (void)setNameLabelSize:(CGSize)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIOffset nameLabelOffsetToAvatar;)
+ (UIOffset)nameLabelOffsetToAvatar SWIFT_WARN_UNUSED_RESULT;
+ (void)setNameLabelOffsetToAvatar:(UIOffset)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIOffset bubbleOffsetToAvatar;)
+ (UIOffset)bubbleOffsetToAvatar SWIFT_WARN_UNUSED_RESULT;
+ (void)setBubbleOffsetToAvatar:(UIOffset)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGFloat cellWidth;)
+ (CGFloat)cellWidth SWIFT_WARN_UNUSED_RESULT;
+ (void)setCellWidth:(CGFloat)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIEdgeInsets cellContentInset;)
+ (UIEdgeInsets)cellContentInset SWIFT_WARN_UNUSED_RESULT;
+ (void)setCellContentInset:(UIEdgeInsets)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGSize statusViewSize;)
+ (CGSize)statusViewSize SWIFT_WARN_UNUSED_RESULT;
+ (void)setStatusViewSize:(CGSize)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGSize durationLabelSize;)
+ (CGSize)durationLabelSize SWIFT_WARN_UNUSED_RESULT;
+ (void)setDurationLabelSize:(CGSize)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIOffset statusViewOffsetToBubble;)
+ (UIOffset)statusViewOffsetToBubble SWIFT_WARN_UNUSED_RESULT;
+ (void)setStatusViewOffsetToBubble:(UIOffset)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) CGFloat bubbleMaxWidth;)
+ (CGFloat)bubbleMaxWidth SWIFT_WARN_UNUSED_RESULT;
+ (void)setBubbleMaxWidth:(CGFloat)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) BOOL isNeedShowInComingName;)
+ (BOOL)isNeedShowInComingName SWIFT_WARN_UNUSED_RESULT;
+ (void)setIsNeedShowInComingName:(BOOL)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) BOOL isNeedShowOutGoingName;)
+ (BOOL)isNeedShowOutGoingName SWIFT_WARN_UNUSED_RESULT;
+ (void)setIsNeedShowOutGoingName:(BOOL)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIColor * _Nonnull nameLabelTextColor;)
+ (UIColor * _Nonnull)nameLabelTextColor SWIFT_WARN_UNUSED_RESULT;
+ (void)setNameLabelTextColor:(UIColor * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIFont * _Nonnull nameLabelTextFont;)
+ (UIFont * _Nonnull)nameLabelTextFont SWIFT_WARN_UNUSED_RESULT;
+ (void)setNameLabelTextFont:(UIFont * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIColor * _Nonnull timeStringColor;)
+ (UIColor * _Nonnull)timeStringColor SWIFT_WARN_UNUSED_RESULT;
+ (void)setTimeStringColor:(UIColor * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIFont * _Nonnull timeStringFont;)
+ (UIFont * _Nonnull)timeStringFont SWIFT_WARN_UNUSED_RESULT;
+ (void)setTimeStringFont:(UIFont * _Nonnull)value;
- (nonnull instancetype)initWithIsOutGoingMessage:(BOOL)isOutGoingMessage isNeedShowTime:(BOOL)isNeedShowTime bubbleContentSize:(CGSize)bubbleContentSize bubbleContentInsets:(UIEdgeInsets)bubbleContentInsets showAvatar:(BOOL)showAvatar OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, readonly) UIEdgeInsets bubbleContentInset;
@property (nonatomic, readonly) CGRect nameLabelFrame;
@property (nonatomic, readonly) CGRect avatarFrame;
@property (nonatomic, readonly) CGRect timeLabelFrame;
@property (nonatomic, readonly) CGFloat cellHeight;
@property (nonatomic, readonly) CGRect bubbleFrame;
@property (nonatomic, readonly) UIEdgeInsets cellContentInset;
@property (nonatomic, readonly, strong) id <IMUIMessageStatusViewProtocal> _Nonnull statusView;
@property (nonatomic, readonly) CGRect statusViewFrame;
@property (nonatomic, readonly) CGRect durationLabelFrame;
@property (nonatomic, readonly) CGRect isPlayedFrame;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


@class UICollectionView;
@protocol IMUIMessageMessageCollectionViewDelegate;
@class IMUIMessageModel;

SWIFT_CLASS("_TtC13RCTAuroraIMUI25IMUIMessageCollectionView")
@interface IMUIMessageCollectionView : UIView
@property (nonatomic, weak) IBOutlet UICollectionView * _Null_unspecified messageCollectionView;
@property (nonatomic, weak) id <IMUIMessageMessageCollectionViewDelegate> _Nullable delegate;
- (void)awakeFromNib;
- (nonnull instancetype)initWithFrame:(CGRect)frame SWIFT_UNAVAILABLE;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)layoutSubviews;
- (void)scrollToBottomWith:(BOOL)animated;
- (void)appendMessageWith:(IMUIMessageModel * _Nonnull)message;
- (void)fristAppendMessagesWith:(NSArray<IMUIMessageModel *> * _Nonnull)messages;
- (void)deleteMessageWith:(NSString * _Nonnull)messageId;
- (void)cleanAllMessages;
- (void)insertMessageWith:(IMUIMessageModel * _Nonnull)message;
- (void)insertMessagesWith:(NSArray<IMUIMessageModel *> * _Nonnull)messages;
- (void)updateMessageWith:(IMUIMessageModel * _Nonnull)message;
@end

@class UIScrollView;

@interface IMUIMessageCollectionView (SWIFT_EXTENSION(RCTAuroraIMUI)) <UIScrollViewDelegate>
- (void)scrollViewWillBeginDragging:(UIScrollView * _Nonnull)scrollView;
- (void)scrollViewDidScroll:(UIScrollView * _Nonnull)scrollView;
@end

@class UICollectionViewLayout;
@class UICollectionReusableView;

@interface IMUIMessageCollectionView (SWIFT_EXTENSION(RCTAuroraIMUI)) <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>
- (NSInteger)collectionView:(UICollectionView * _Nonnull)collectionView numberOfItemsInSection:(NSInteger)section SWIFT_WARN_UNUSED_RESULT;
- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView * _Nonnull)collectionView SWIFT_WARN_UNUSED_RESULT;
- (CGSize)collectionView:(UICollectionView * _Nonnull)collectionView layout:(UICollectionViewLayout * _Nonnull)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath * _Nonnull)indexPath SWIFT_WARN_UNUSED_RESULT;
- (CGSize)collectionView:(UICollectionView * _Nonnull)collectionView layout:(UICollectionViewLayout * _Nonnull)collectionViewLayout referenceSizeForFooterInSection:(NSInteger)section SWIFT_WARN_UNUSED_RESULT;
- (UICollectionViewCell * _Nonnull)collectionView:(UICollectionView * _Nonnull)collectionView cellForItemAtIndexPath:(NSIndexPath * _Nonnull)indexPath SWIFT_WARN_UNUSED_RESULT;
- (void)collectionView:(UICollectionView * _Nonnull)collectionView didSelectItemAtIndexPath:(NSIndexPath * _Nonnull)indexPath;
- (void)collectionView:(UICollectionView * _Nonnull)collectionView didEndDisplayingCell:(UICollectionViewCell * _Nonnull)didEndDisplaying forItemAtIndexPath:(NSIndexPath * _Nonnull)forItemAt;
- (CGSize)collectionView:(UICollectionView * _Nonnull)collectionView layout:(UICollectionViewLayout * _Nonnull)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section SWIFT_WARN_UNUSED_RESULT;
- (UICollectionReusableView * _Nonnull)collectionView:(UICollectionView * _Nonnull)collectionView viewForSupplementaryElementOfKind:(NSString * _Nonnull)kind atIndexPath:(NSIndexPath * _Nonnull)indexPath SWIFT_WARN_UNUSED_RESULT;
@end


SWIFT_PROTOCOL("_TtP13RCTAuroraIMUI29IMUIMessageStatusViewProtocal_")
@protocol IMUIMessageStatusViewProtocal <NSObject>
- (void)layoutFailedStatus;
- (void)layoutSendingStatus;
- (void)layoutSuccessStatus;
- (void)layoutMediaDownloading;
- (void)layoutMediaDownloadFail;
@property (nonatomic, readonly, copy) NSString * _Nonnull statusViewID;
@end


SWIFT_CLASS("_TtC13RCTAuroraIMUI28IMUIMessageDefaultStatusView")
@interface IMUIMessageDefaultStatusView : UIButton <IMUIMessageStatusViewProtocal>
- (void)layoutMediaDownloading;
- (void)layoutMediaDownloadFail;
@property (nonatomic, readonly, copy) NSString * _Nonnull statusViewID;
- (nonnull instancetype)initWithFrame:(CGRect)frame SWIFT_UNAVAILABLE;
@property (nonatomic) CGRect frame;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)layoutFailedStatus;
- (void)layoutSendingStatus;
- (void)layoutSuccessStatus;
@end

@protocol IMUIMessageModelProtocol;

/// The <code>IMUIMessageMessageCollectionViewDelegate</code> protocol defines the even callback delegate
SWIFT_PROTOCOL("_TtP13RCTAuroraIMUI40IMUIMessageMessageCollectionViewDelegate_")
@protocol IMUIMessageMessageCollectionViewDelegate <NSObject>
@optional
/// Tells the delegate that user tap message cell
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that user tap message bubble
- (void)messageCollectionViewWithDidTapMessageBubbleInCell:(UICollectionViewCell * _Nonnull)didTapMessageBubbleInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model;
- (void)messageCollectionViewWithDidShowMenuStr:(NSString * _Nonnull)didShowMenuStr model:(id <IMUIMessageModelProtocol> _Nonnull)model;
- (void)messageCollectionViewWithOpenMessageBubbleUrl:(NSString * _Nonnull)openMessageBubbleUrl;
- (void)messageCollectionViewWithReloadMoreData:(NSString * _Nonnull)reloadMoreData;
- (void)messageCollectionViewWithTapCellView:(NSString * _Nonnull)tapCellView;
- (void)messageCollectionViewWithLongTapCellViewModel:(id <IMUIMessageModelProtocol> _Nonnull)longTapCellViewModel;
- (void)messageCollectionViewWithLongTapAvatarPressWithModel:(id <IMUIMessageModelProtocol> _Nonnull)longTapAvatarPressWithModel;
- (void)messageCollectionViewWithChangeAutoScroll:(BOOL)changeAutoScroll;
/// Tells the delegate that user tap header image in message cell
- (void)messageCollectionViewWithDidTapHeaderImageInCell:(UICollectionViewCell * _Nonnull)didTapHeaderImageInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that user tap statusView in message cell
- (void)messageCollectionViewWithDidTapStatusViewInCell:(UICollectionViewCell * _Nonnull)didTapStatusViewInCell model:(id <IMUIMessageModelProtocol> _Nonnull)model;
- (void)messageCollectionViewWithDidTapValidationWithModel:(id <IMUIMessageModelProtocol> _Nonnull)didTapValidationWithModel;
/// Tells the delegate that the message cell will show in screen
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ willDisplayMessageCell:(UICollectionViewCell * _Nonnull)willDisplayMessageCell forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate that message cell end displaying
- (void)messageCollectionView:(UICollectionView * _Nonnull)_ didEndDisplaying:(UICollectionViewCell * _Nonnull)didEndDisplaying forItemAt:(NSIndexPath * _Nonnull)forItemAt model:(id <IMUIMessageModelProtocol> _Nonnull)model;
/// Tells the delegate when messageCollection beginDragging
- (void)messageCollectionView:(UICollectionView * _Nonnull)willBeginDragging;
- (void)messageCollectionViewWithDidScroll:(UICollectionView * _Nonnull)didScroll;
@end

@protocol IMUIUserProtocol;
enum IMUIMessageStatus : NSUInteger;
enum IMUIMessageType : NSInteger;
@class NSMutableDictionary;

/// The <code>IMUIMessageModelProtocol</code> protocol defines the common interface with message model objects
/// It declares the required and optional methods which model should implement it
SWIFT_PROTOCOL("_TtP13RCTAuroraIMUI24IMUIMessageModelProtocol_")
@protocol IMUIMessageModelProtocol <NSObject>
/// @required function
/// @return message id to identifies this message
@property (nonatomic, readonly, copy) NSString * _Nonnull msgId;
/// @required function
/// @return the user who sended this message
@property (nonatomic, readonly, strong) id <IMUIUserProtocol> _Nonnull fromUser;
/// @required function
/// @return the layout, <code>IMUIBaseMessageCell</code> will use it to layout message cell items
@property (nonatomic, readonly, strong) id <IMUIMessageCellLayoutProtocal> _Nonnull layout;
/// @required function
/// @return the bubble background image
/// @warning the image must be resizable
/// just like that: bubbleImg.resizableImage(withCapInsets: UIEdgeInsetsMake(24, 15, 9, 10), resizingMode: .tile)
@property (nonatomic, readonly, strong) UIImage * _Nonnull resizableBubbleImage;
/// @optional function
/// @return time lable string
@property (nonatomic, readonly, copy) NSString * _Nonnull timeString;
@property (nonatomic, readonly, copy) NSString * _Nonnull timeStamp;
/// text of message.
/// @return string
/// @optional function if message type is text implement message text in this function
- (NSString * _Nonnull)text SWIFT_WARN_UNUSED_RESULT;
/// If message type is photo, voice, video or file,
/// get file path through this method.
/// @return media file path
- (NSString * _Nonnull)mediaFilePath SWIFT_WARN_UNUSED_RESULT;
/// If message type is voice or video, get duration through this method.
/// @return duration of audio or video
@property (nonatomic, readonly) CGFloat duration;
/// @optional get function
/// return
@property (nonatomic, readonly) BOOL isOutGoing;
/// @optional get function
/// return get current message status
@property (nonatomic, readonly) enum IMUIMessageStatus messageStatus;
/// @optional get function
/// return message’s type
@property (nonatomic, readonly) enum IMUIMessageType type;
@property (nonatomic, readonly, strong) NSMutableDictionary * _Nonnull customDict;
@end


/// The class <code>IMUIMessageModel</code> is a concrete class for message model objects that represent a single user message
/// The message can be text \ voice \ image \ video \ message
/// It implements <code>IMUIMessageModelProtocol</code> protocal
SWIFT_CLASS("_TtC13RCTAuroraIMUI16IMUIMessageModel")
@interface IMUIMessageModel : NSObject <IMUIMessageModelProtocol>
@property (nonatomic) CGFloat duration;
@property (nonatomic, copy) NSString * _Nonnull msgId;
@property (nonatomic) enum IMUIMessageStatus messageStatus;
@property (nonatomic, strong) id <IMUIUserProtocol> _Nonnull fromUser;
@property (nonatomic, strong) NSMutableDictionary * _Nonnull customDict;
@property (nonatomic) BOOL isOutGoing;
@property (nonatomic, readonly, copy) NSString * _Nonnull timeString;
@property (nonatomic, readonly, copy) NSString * _Nonnull timeStamp;
@property (nonatomic) enum IMUIMessageType type;
@property (nonatomic, readonly, strong) id <IMUIMessageCellLayoutProtocal> _Nonnull layout;
- (NSString * _Nonnull)text SWIFT_WARN_UNUSED_RESULT;
- (NSString * _Nonnull)mediaFilePath SWIFT_WARN_UNUSED_RESULT;
@property (nonatomic, readonly, strong) UIImage * _Nonnull resizableBubbleImage;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


typedef SWIFT_ENUM(NSUInteger, IMUIMessageStatus, closed) {
  IMUIMessageStatusFailed = 0,
  IMUIMessageStatusSending = 1,
  IMUIMessageStatusSuccess = 2,
  IMUIMessageStatusMediaDownloading = 3,
  IMUIMessageStatusMediaDownloadFail = 4,
};


typedef SWIFT_ENUM(NSInteger, IMUIMessageType, closed) {
  IMUIMessageTypeText = 0,
  IMUIMessageTypeImage = 1,
  IMUIMessageTypeVoice = 2,
  IMUIMessageTypeVideo = 3,
  IMUIMessageTypeLocation = 4,
  IMUIMessageTypeNotification = 5,
  IMUIMessageTypeRedpacket = 6,
  IMUIMessageTypeTransfer = 7,
  IMUIMessageTypeUrl = 8,
  IMUIMessageTypeCard = 9,
  IMUIMessageTypeAccount_notice = 10,
  IMUIMessageTypeRedpacketOpen = 11,
  IMUIMessageTypeUnknown = 12,
  IMUIMessageTypeCustom = 13,
};


SWIFT_CLASS("_TtC13RCTAuroraIMUI19IMUITextMessageCell")
@interface IMUITextMessageCell : IMUIBaseMessageCell
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIColor * _Nonnull outGoingTextColor;)
+ (UIColor * _Nonnull)outGoingTextColor SWIFT_WARN_UNUSED_RESULT;
+ (void)setOutGoingTextColor:(UIColor * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIColor * _Nonnull inComingTextColor;)
+ (UIColor * _Nonnull)inComingTextColor SWIFT_WARN_UNUSED_RESULT;
+ (void)setInComingTextColor:(UIColor * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIFont * _Nonnull outGoingTextFont;)
+ (UIFont * _Nonnull)outGoingTextFont SWIFT_WARN_UNUSED_RESULT;
+ (void)setOutGoingTextFont:(UIFont * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIFont * _Nonnull inComingTextFont;)
+ (UIFont * _Nonnull)inComingTextFont SWIFT_WARN_UNUSED_RESULT;
+ (void)setInComingTextFont:(UIFont * _Nonnull)value;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)layoutSubviews;
@end


/// The <code>IMUIUserProtocol</code> protocol defines the common interface with user model objects
/// It declares the required methods which model should implement it
SWIFT_PROTOCOL("_TtP13RCTAuroraIMUI16IMUIUserProtocol_")
@protocol IMUIUserProtocol <NSObject>
/// return user id, to identifies this user
- (NSString * _Nonnull)userId SWIFT_WARN_UNUSED_RESULT;
/// return user displayName, which will display in IMUIBaseMessageCell.nameLabel
- (NSString * _Nonnull)displayName SWIFT_WARN_UNUSED_RESULT;
/// return user header image, which will display in IMUIBaseMessageCell.avatarImage
- (NSString * _Nonnull)Avatar SWIFT_WARN_UNUSED_RESULT;
@end


SWIFT_CLASS("_TtC13RCTAuroraIMUI20IMUIVoiceMessageCell")
@interface IMUIVoiceMessageCell : IMUIBaseMessageCell
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder SWIFT_UNAVAILABLE;
@end


SWIFT_CLASS("_TtC13RCTAuroraIMUI19MyMessageCellLayout")
@interface MyMessageCellLayout : IMUIMessageCellLayout
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIEdgeInsets outgoingPadding;)
+ (UIEdgeInsets)outgoingPadding SWIFT_WARN_UNUSED_RESULT;
+ (void)setOutgoingPadding:(UIEdgeInsets)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) UIEdgeInsets incommingPadding;)
+ (UIEdgeInsets)incommingPadding SWIFT_WARN_UNUSED_RESULT;
+ (void)setIncommingPadding:(UIEdgeInsets)value;
- (nonnull instancetype)initWithIsOutGoingMessage:(BOOL)isOutGoingMessage isNeedShowTime:(BOOL)isNeedShowTime bubbleContentSize:(CGSize)bubbleContentSize bubbleContentInsets:(UIEdgeInsets)bubbleContentInsets showAvatar:(BOOL)showAvatar SWIFT_UNAVAILABLE;
@property (nonatomic, readonly) UIEdgeInsets bubbleContentInset;
@end

@class RCTUser;

SWIFT_CLASS("_TtC13RCTAuroraIMUI15RCTMessageModel")
@interface RCTMessageModel : IMUIMessageModel
- (NSString * _Nonnull)mediaFilePath SWIFT_WARN_UNUSED_RESULT;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIImage * _Nonnull outgoingBubbleImage;)
+ (UIImage * _Nonnull)outgoingBubbleImage SWIFT_WARN_UNUSED_RESULT;
+ (void)setOutgoingBubbleImage:(UIImage * _Nonnull)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, strong) UIImage * _Nonnull incommingBubbleImage;)
+ (UIImage * _Nonnull)incommingBubbleImage SWIFT_WARN_UNUSED_RESULT;
+ (void)setIncommingBubbleImage:(UIImage * _Nonnull)value;
@property (nonatomic, readonly, strong) UIImage * _Nonnull resizableBubbleImage;
- (nonnull instancetype)initWithMsgId:(NSString * _Nonnull)msgId messageStatus:(enum IMUIMessageStatus)messageStatus fromUser:(RCTUser * _Nonnull)fromUser isOutGoing:(BOOL)isOutGoing time:(NSString * _Nonnull)time status:(enum IMUIMessageStatus)status type:(enum IMUIMessageType)type text:(NSString * _Nonnull)text mediaPath:(NSString * _Nonnull)mediaPath layout:(id <IMUIMessageCellLayoutProtocal> _Nullable)layout customDict:(NSMutableDictionary * _Nonnull)customDict timeStamp:(NSString * _Nonnull)timeStamp OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithMessageDic:(NSMutableDictionary * _Nonnull)messageDic;
- (NSString * _Nonnull)text SWIFT_WARN_UNUSED_RESULT;
@property (nonatomic, readonly, strong) NSMutableDictionary * _Nonnull messageDictionary;
@end


SWIFT_CLASS("_TtC13RCTAuroraIMUI7RCTUser")
@interface RCTUser : NSObject <IMUIUserProtocol>
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
- (NSString * _Nonnull)userId SWIFT_WARN_UNUSED_RESULT;
- (NSString * _Nonnull)displayName SWIFT_WARN_UNUSED_RESULT;
- (NSString * _Nonnull)Avatar SWIFT_WARN_UNUSED_RESULT;
@end


@interface UIColor (SWIFT_EXTENSION(RCTAuroraIMUI))
- (nonnull instancetype)initWithRed:(NSInteger)red green:(NSInteger)green blue:(NSInteger)blue;
- (nonnull instancetype)initWithNetHex:(NSInteger)netHex;
+ (UIColor * _Nonnull)hexStringToUIColorWithHex:(NSString * _Nonnull)hex SWIFT_WARN_UNUSED_RESULT;
@end




#if __has_attribute(external_source_symbol)
# pragma clang attribute pop
#endif
#pragma clang diagnostic pop
#endif