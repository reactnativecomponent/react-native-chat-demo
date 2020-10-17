//
//  IMUIMessageCellLayout.swift
//  IMUIChat
//
//  Created by oshumini on 2017/4/6.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import Foundation
import UIKit

/**
 *  The 'IMUIMessageCellLayout' is a concrete layout object comfort
 *  'IMUIMessageCellLayoutProtocal' protocol.
 *  each IMUIMessageBaseCell need IMUIMessageCellLayoutProtocal to layout cell's items
 */
open class IMUIMessageCellLayout: NSObject, IMUIMessageCellLayoutProtocal {

  @objc public static var avatarSize: CGSize = CGSize(width: 40, height: 40)//js那边可以设置
  
  @objc public static var avatarOffsetToCell: UIOffset = UIOffset(horizontal: 0, vertical: 10)
  
  @objc public static var timeLabelFrame: CGRect = CGRect.zero
  
  @objc public static var nameLabelSize: CGSize = CGSize(width: 200, height: 18)
  
  @objc public static var nameLabelOffsetToAvatar: UIOffset = UIOffset(horizontal: 4 , vertical: 0)
  
  @objc public static var bubbleOffsetToAvatar: UIOffset = UIOffset(horizontal: 4 , vertical: 0)
  
  @objc public static var cellWidth: CGFloat = 0
  
  @objc public static var cellContentInset: UIEdgeInsets = UIEdgeInsets(top: 5, left: 10, bottom:
    5, right: 10)
  
  @objc public static var statusViewSize: CGSize = CGSize(width: 30, height: 30)
    
  @objc public static var durationLabelSize: CGSize = CGSize(width: 50, height: 25)
  
  @objc public static var statusViewOffsetToBubble: UIOffset = UIOffset(horizontal: 12, vertical: 0)
  
//  public static var bubbleMaxWidth: CGFloat = 180.0
  @objc public static var bubbleMaxWidth: CGFloat = UIScreen.main.bounds.width*0.55
  @objc public static var isNeedShowInComingName = true
  @objc public static var isNeedShowOutGoingName = false
  
//  public static var isNeedShowInComingAvatar = true
//  public static var isNeedShowOutGoingAvatar = true
  
  @objc public static var nameLabelTextColor: UIColor = UIColor(netHex: 0x7587A8)
  @objc public static var nameLabelTextFont: UIFont = UIFont.systemFont(ofSize: 12)
  
  @objc public static var timeStringColor: UIColor = UIColor(netHex: 0x90A6C4)
  @objc public static var timeStringFont: UIFont = UIFont.systemFont(ofSize: 12)
  
  @objc public init(isOutGoingMessage: Bool,
                 isNeedShowTime: Bool,
              bubbleContentSize: CGSize,
            bubbleContentInsets: UIEdgeInsets,
            showAvatar: Bool) {
    self.isOutGoingMessage = isOutGoingMessage
    self.isNeedShowTime = isNeedShowTime
    self.bubbleContentSize = bubbleContentSize
    self.bubbleContentInsets = bubbleContentInsets
    self.isNeedShowInComingAvatar = showAvatar
    self.isNeedShowOutGoingAvatar = showAvatar
    
  }
  
  open var isOutGoingMessage: Bool
  
  open var isNeedShowTime: Bool
  open var isNeedShowInComingAvatar: Bool
  open var isNeedShowOutGoingAvatar: Bool
  
  open var bubbleContentSize: CGSize
  open var bubbleContentInsets: UIEdgeInsets
  
  open var bubbleSize: CGSize {
    let bubbleWidth = bubbleContentSize.width +
      bubbleContentInset.left +
      bubbleContentInset.right
    
    let bubbleHeight = bubbleContentSize.height +
      bubbleContentInset.top +
      bubbleContentInset.bottom
//    print("bubbleHeight:\(bubbleHeight)   :\(bubbleContentSize.height)  :\(bubbleContentInset.top)  :\(bubbleContentInset.bottom)")
    return CGSize(width: bubbleWidth, height: bubbleHeight)
  }
  
  open var bubbleContentFrame: CGRect {
    let bubbleContentPostion = CGPoint(x: bubbleContentInset.left,
                                       y: bubbleContentInset.top)
    return CGRect(origin: bubbleContentPostion, size: self.bubbleContentSize)
  }
  
  public var relativeAvatarOffsetToCell: UIOffset {
    
    if self.isOutGoingMessage {
      if self.isNeedShowOutGoingAvatar {
        return UIOffset(horizontal: -IMUIMessageCellLayout.avatarOffsetToCell.horizontal, vertical: IMUIMessageCellLayout.avatarOffsetToCell.vertical)
      } else {
        return UIOffset.zero
      }
      
    } else {
      if self.isNeedShowInComingAvatar {
        return IMUIMessageCellLayout.avatarOffsetToCell
      } else {
        return UIOffset.zero
      }
    }
  }
  
  public var relativeNameLabelOffsetToAvatar: UIOffset {
    if self.isOutGoingMessage {
      if IMUIMessageCellLayout.isNeedShowOutGoingName {
        return UIOffset(horizontal: -IMUIMessageCellLayout.nameLabelOffsetToAvatar.horizontal, vertical: IMUIMessageCellLayout.nameLabelOffsetToAvatar.vertical)
      } else {
        return UIOffset.zero
      }
      
    } else {
      if IMUIMessageCellLayout.isNeedShowInComingName && isNeedShowOutGoingAvatar{
        return IMUIMessageCellLayout.nameLabelOffsetToAvatar
      } else {
        return UIOffset.zero
      }
    }
  }
  
  public var relativeBubbleOffsetToAvatar: UIOffset {
    if self.isOutGoingMessage {
      return UIOffset(horizontal: -IMUIMessageCellLayout.bubbleOffsetToAvatar.horizontal, vertical: IMUIMessageCellLayout.bubbleOffsetToAvatar.vertical)
    } else {
      return IMUIMessageCellLayout.bubbleOffsetToAvatar
    }
  }

  public var relativeStatusViewOffsetToBubble: UIOffset {
    if self.isOutGoingMessage {
      return UIOffset(horizontal: -IMUIMessageCellLayout.statusViewOffsetToBubble.horizontal, vertical: IMUIMessageCellLayout.statusViewOffsetToBubble.vertical)
    } else {
      return IMUIMessageCellLayout.statusViewOffsetToBubble
    }
  }
  
  // MARK - IMUIMessageCellLayoutProtocal
  open var bubbleContentInset: UIEdgeInsets {
    return bubbleContentInsets
  }
  
  open var nameLabelFrame: CGRect {
    var nameLabelX: CGFloat
    let nameLabelY = avatarFrame.top + IMUIMessageCellLayout.nameLabelOffsetToAvatar.vertical
    if isOutGoingMessage {

      nameLabelX = IMUIMessageCellLayout.cellWidth -
        IMUIMessageCellLayout.nameLabelSize.width +
        relativeBubbleOffsetToAvatar.horizontal +
        relativeAvatarOffsetToCell.horizontal -
        avatarFrame.width +
        relativeNameLabelOffsetToAvatar.horizontal
      if (!IMUIMessageCellLayout.isNeedShowOutGoingName) || (!isNeedShowOutGoingAvatar){
        return CGRect(x: nameLabelX,
                      y: nameLabelY,
                      width: 0,
                      height: 0)
      }
      
    } else {
      nameLabelX = avatarFrame.right +
        relativeBubbleOffsetToAvatar.horizontal +
        relativeNameLabelOffsetToAvatar.horizontal
      
      if (!IMUIMessageCellLayout.isNeedShowInComingName) || (!isNeedShowOutGoingAvatar) {
        nameLabelX = avatarFrame.right +
          relativeBubbleOffsetToAvatar.horizontal +
          relativeNameLabelOffsetToAvatar.horizontal
        return CGRect(x: nameLabelX,
                      y: nameLabelY,
                      width: 0,
                      height: 0)
      }
    }
    
    return CGRect(x: nameLabelX,
                  y: nameLabelY,
                  width: IMUIMessageCellLayout.nameLabelSize.width,
                  height: IMUIMessageCellLayout.nameLabelSize.height)
  }
  
  open var avatarFrame: CGRect {
    
    var avatarX: CGFloat
    if self.isOutGoingMessage {
      
      avatarX = IMUIMessageCellLayout.cellWidth +
        relativeAvatarOffsetToCell.horizontal -
        IMUIMessageCellLayout.avatarSize.width -
        cellContentInset.right

    } else {
      avatarX = relativeAvatarOffsetToCell.horizontal +
        cellContentInset.left
    }
    
    let avatarY = relativeAvatarOffsetToCell.vertical +
      self.timeLabelFrame.size.height +
      cellContentInset.top
    
    
    if isOutGoingMessage {
      if !self.isNeedShowOutGoingAvatar {
        return CGRect(x: avatarX, y: avatarY, width: 0, height: 0)
      }
    } else {
      if !self.isNeedShowInComingAvatar {
        return CGRect(x: avatarX, y: avatarY, width: 0, height: 0)
      }
    }
    
    return CGRect(x: avatarX,
                  y: avatarY,
                  width: IMUIMessageCellLayout.avatarSize.width,
                  height: IMUIMessageCellLayout.avatarSize.height)
  }
  
  open var timeLabelFrame: CGRect {
    if self.isNeedShowTime {
      let timeWidth = IMUIMessageCellLayout.cellWidth -
        cellContentInset.left -
        cellContentInset.right

      return CGRect(x: cellContentInset.left,
                    y: cellContentInset.top,
                    width: timeWidth,
                    height: 20)
    } else {
      return CGRect.zero
    }
  }
  
  open var cellHeight: CGFloat {
    var cellHeight = IMUIMessageCellLayout.bubbleOffsetToAvatar.vertical +
      IMUIMessageCellLayout.timeLabelFrame.size.height +
      self.avatarFrame.origin.y +
      self.bubbleSize.height +
      cellContentInset.top +
      cellContentInset.bottom
    if self.isOutGoingMessage {
      if IMUIMessageCellLayout.isNeedShowOutGoingName  && isNeedShowOutGoingAvatar{
        cellHeight += IMUIMessageCellLayout.nameLabelSize.height + IMUIMessageCellLayout.nameLabelOffsetToAvatar.vertical
      }
    } else {
      if IMUIMessageCellLayout.isNeedShowInComingName  && isNeedShowInComingAvatar{
        cellHeight += IMUIMessageCellLayout.nameLabelSize.height + IMUIMessageCellLayout.nameLabelOffsetToAvatar.vertical
      }
    }
    return cellHeight
  }
  
  open var bubbleFrame: CGRect {
    var bubbleX:CGFloat
    
    if self.isOutGoingMessage {
      bubbleX = IMUIMessageCellLayout.cellWidth +
        relativeAvatarOffsetToCell.horizontal -
        avatarFrame.width +
        relativeBubbleOffsetToAvatar.horizontal -
        cellContentInset.right -
        self.bubbleSize.width
    }
    else {
      bubbleX = relativeAvatarOffsetToCell.horizontal +
        avatarFrame.width +
        relativeBubbleOffsetToAvatar.horizontal +
        cellContentInset.left
    }
    var bubbleY = relativeBubbleOffsetToAvatar.vertical +
      self.avatarFrame.top +
      IMUIMessageCellLayout.timeLabelFrame.size.height
    
    if isOutGoingMessage {
      if IMUIMessageCellLayout.isNeedShowOutGoingName && isNeedShowOutGoingAvatar{
        bubbleY += IMUIMessageCellLayout.nameLabelSize.height + IMUIMessageCellLayout.nameLabelOffsetToAvatar.vertical
      }
    } else {
      if IMUIMessageCellLayout.isNeedShowInComingName && isNeedShowInComingAvatar{
        bubbleY += IMUIMessageCellLayout.nameLabelSize.height + IMUIMessageCellLayout.nameLabelOffsetToAvatar.vertical
      }
    }
    if  !isNeedShowInComingAvatar {
        bubbleX = 0
        if isNeedShowTime{
            bubbleY = bubbleY+5
        }
    }
    return CGRect(x: bubbleX,
                  y: bubbleY,
                  width: bubbleSize.width,
                  height: bubbleSize.height)
  }
  
  open var cellContentInset: UIEdgeInsets {
    return IMUIMessageCellLayout.cellContentInset
  }
  
  open var statusView: IMUIMessageStatusViewProtocal {
    return IMUIMessageDefaultStatusView()
  }

  open var statusViewFrame: CGRect {
    
    var statusViewX: CGFloat = 0.0
    let statusViewY: CGFloat = bubbleFrame.origin.y +
    bubbleFrame.size.height/2 -
    IMUIMessageCellLayout.statusViewSize.height/2 -
    IMUIMessageCellLayout.statusViewOffsetToBubble.vertical
    
    if isOutGoingMessage {
      statusViewX = bubbleFrame.origin.x -
        IMUIMessageCellLayout.statusViewOffsetToBubble.horizontal -
        IMUIMessageCellLayout.statusViewSize.width
    } else {
      statusViewX = bubbleFrame.origin.x +
        bubbleFrame.size.width +
        IMUIMessageCellLayout.statusViewOffsetToBubble.horizontal
    }
    
    return CGRect(x: statusViewX,
                  y: statusViewY,
                  width: IMUIMessageCellLayout.statusViewSize.width,
                  height: IMUIMessageCellLayout.statusViewSize.height)
    
  }
    
    open var durationLabelFrame: CGRect {
        var durationX: CGFloat = 0.0
        let durationY: CGFloat = bubbleFrame.origin.y +
            bubbleFrame.size.height/2 -
            IMUIMessageCellLayout.durationLabelSize.height/2 + 5
        
        if isOutGoingMessage {
            durationX = bubbleFrame.origin.x - 5 - IMUIMessageCellLayout.durationLabelSize.width
        } else {
            durationX = bubbleFrame.origin.x + bubbleFrame.size.width + 5
        }
        
        return CGRect(x: durationX,
                      y: durationY,
                      width: IMUIMessageCellLayout.durationLabelSize.width,
                      height: IMUIMessageCellLayout.durationLabelSize.height)
        
    }
    
    open var isPlayedFrame: CGRect {
        var isPlayedX: CGFloat = 0.0
        let isPlayedY: CGFloat = bubbleFrame.origin.y +  2
        
        if isOutGoingMessage {
            isPlayedX = bubbleFrame.origin.x - 9
        } else {
            isPlayedX = bubbleFrame.origin.x + bubbleFrame.size.width + 5
        }
        
        return CGRect(x: isPlayedX,
                      y: isPlayedY,
                      width: 6,
                      height: 6)
        
    }
    
    
}
