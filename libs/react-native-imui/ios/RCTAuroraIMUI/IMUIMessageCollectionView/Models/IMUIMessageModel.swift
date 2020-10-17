//
//  MessageModel.swift
//  IMUIChat
//
//  Created by oshumini on 2017/2/24.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit


@objc public enum IMUIMessageType: Int {
  case text
  case image
  case voice
  case video
  case location
  case notification
  case redpacket
  case transfer
  case url
    case card
  case account_notice
  case redpacketOpen
  case unknown
  case custom
}


@objc public enum IMUIMessageStatus: UInt {
  // Sending message status
  case failed
  case sending
  case success
  
  // received message status
  case mediaDownloading
  case mediaDownloadFail
}

//
//public enum IMUIMessageReceiveStatus {
//  case failed
//  case sending
//  case success
//}


public protocol IMUIMessageDataSource {
  func messageArray(with offset:NSNumber, limit:NSNumber) -> [IMUIMessageModelProtocol]
  
}


// MARK: - IMUIMessageModelProtocol

/**
 *  The class `IMUIMessageModel` is a concrete class for message model objects that represent a single user message
 *  The message can be text \ voice \ image \ video \ message
 *  It implements `IMUIMessageModelProtocol` protocal
 *
 */
open class IMUIMessageModel: NSObject, IMUIMessageModelProtocol {
  
  @objc public var duration: CGFloat
    let screenW = UIScreen.main.bounds.size.width
    let screenH = UIScreen.main.bounds.size.height
  
  open var msgId = {
    return ""
  }()

  open var messageStatus: IMUIMessageStatus
  
  open var fromUser: IMUIUserProtocol
    
    open var customDict:NSMutableDictionary
  
  open var isOutGoing: Bool = true
  open var isShowAvatar: Bool = true
  open var time: String
    open var tStamp: String
  
  open var timeString: String {
    return time
  }
  
    open var timeStamp: String {
        return tStamp
    }
    
    
  open var isNeedShowTime: Bool  {
    if timeString != "" {
      return true
    } else {
      return false
    }
  }
  
  open var status: IMUIMessageStatus
  open var type: IMUIMessageType
  
  open var layout: IMUIMessageCellLayoutProtocal {
    return cellLayout!
  }
  open var cellLayout: IMUIMessageCellLayoutProtocal?
  
  open func text() -> String {
    return ""
  }
  
  open func mediaFilePath() -> String {
    return ""
  }
    
  open func calculateBubbleContentSize() -> CGSize {
    var bubbleContentSize: CGSize!
    
    switch type {
    case .image:
        var imgWidth:Float = Float(screenW * 0.4);
        let imgW = self.customDict.object(forKey: "imageWidth") as! NSString
        if imgWidth > imgW.floatValue  {
            imgWidth = imgW.floatValue
        }
        let imgH = self.customDict.object(forKey: "imageHeight") as! NSString
        let imgPercent:Float = imgH.floatValue / imgW.floatValue
        var imgHeight:Float = imgWidth * imgPercent
        if imgHeight > Float(screenH*0.5) {
            imgHeight = Float(screenH*0.5)
        }
        bubbleContentSize = CGSize(width:  CGFloat(imgWidth), height: CGFloat(imgHeight))
        break
    case .text:
        let tmpLabel = YYLabel()
        tmpLabel.setupYYText(self.text(), andUnunderlineColor: UIColor.white)
        tmpLabel.font = IMUITextMessageCell.inComingTextFont
//        bubbleContentSize = tmpLabel.getTheLabelBubble(CGSize(width: IMUIMessageCellLayout.bubbleMaxWidth, height: CGFloat(MAXFLOAT)))
        bubbleContentSize = tmpLabel.getTheLabelBubble(CGSize(width: IMUIMessageCellLayout.bubbleMaxWidth, height: CGFloat(MAXFLOAT)))
        print("bubbleContentSize: \(bubbleContentSize)")
        
//      if isOutGoing {
//        bubbleContentSize = self.text().sizeWithConstrainedWidth(with: IMUIMessageCellLayout.bubbleMaxWidth, font: IMUITextMessageCell.outGoingTextFont)
//      } else {
//        bubbleContentSize = self.text().sizeWithConstrainedWidth(with: IMUIMessageCellLayout.bubbleMaxWidth, font: IMUITextMessageCell.inComingTextFont)
//      }
      break
    case .voice:
        let strDuration:NSString = self.customDict.object(forKey: "duration") as! NSString
        var widthF :CGFloat = 0
        if strDuration.floatValue > 10 {
            widthF = 40 + 10*8 + CGFloat(strDuration.floatValue - 10) * (screenW / 240)
        }else{
            widthF = 40 + CGFloat(strDuration.floatValue * 8)
        }
    
      bubbleContentSize = CGSize(width: widthF, height: 40)
      break
    case .video:
      bubbleContentSize = CGSize(width: 120, height: 160)
      break
    case .location:
        let locationW = UIScreen.main.bounds.width*0.625
        let strTitle = self.customDict.object(forKey: "title") as! String
        let tmpSize = heightWithFont(font: UIFont.systemFont(ofSize: (screenW * 13 / 375)), fixedWidth: (locationW-15), text: strTitle)
      bubbleContentSize = CGSize(width: locationW, height: UIScreen.main.bounds.width*0.625*0.5+tmpSize.height+15 )
      break
    case .notification:
        let strTitle = self.customDict.object(forKey: "tipMsg") as! String
        let tmpSize = heightWithFont(font: UIFont.systemFont(ofSize:  12), fixedWidth: (screenW*0.8), text: strTitle)
        bubbleContentSize = CGSize(width: UIScreen.main.bounds.width, height: tmpSize.height+10)
        isShowAvatar = false
        break
    case .redpacket:
        bubbleContentSize = CGSize(width: UIScreen.main.bounds.width*0.65, height: UIScreen.main.bounds.width*0.65*0.35)
        break
    case .transfer:
        bubbleContentSize = CGSize(width: UIScreen.main.bounds.width*0.65, height: UIScreen.main.bounds.width*0.65*0.35)
        break
    case .url:
        bubbleContentSize = CGSize(width: 100, height: 100)
        break
    case .account_notice:
        bubbleContentSize = CGSize(width: 200, height: 40)
        break
    case .redpacketOpen:
        bubbleContentSize = CGSize(width: UIScreen.main.bounds.width, height: 40)
        isShowAvatar = false
        break
    case .card:
        bubbleContentSize = CGSize(width: UIScreen.main.bounds.width*0.65, height: UIScreen.main.bounds.width*0.65*0.35)
        break
    case .unknown:
        bubbleContentSize = CGSize(width: UIScreen.main.bounds.width, height: 40)
        isShowAvatar = false
        break
    case .custom:
        var tmpWidth:Float = Float(screenW * 0.4);
        var tmpHeight:Float = Float(screenW * 0.4);
        let strWidth = self.customDict.object(forKey: "Width") as! NSString
        let strHeight = self.customDict.object(forKey: "Height") as! NSString
        if strWidth.floatValue > 0  {
            tmpWidth = strWidth.floatValue
        }
        if strHeight.floatValue > 0  {
            tmpHeight = strHeight.floatValue
        }
        bubbleContentSize = CGSize(width:  CGFloat(tmpWidth), height: CGFloat(tmpHeight))
        break
    default:
         bubbleContentSize = CGSize(width:  CGFloat(200), height: CGFloat(130))
      break
    }
    return bubbleContentSize
  }
    func heightWithFont(font : UIFont, fixedWidth : CGFloat, text : String) -> CGSize {
        
        guard text.count > 0 && fixedWidth > 0 else {
            
            return CGSize.zero
        }
        
        let size = CGSize(width:fixedWidth, height:CGFloat(MAXFLOAT))
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: [NSAttributedString.Key.font : font], context:nil)
        
        return rect.size
    }
  
  public init(msgId: String, messageStatus: IMUIMessageStatus, fromUser: IMUIUserProtocol, isOutGoing: Bool, time: String, status: IMUIMessageStatus, type: IMUIMessageType, cellLayout: IMUIMessageCellLayoutProtocal? ,customDict: NSMutableDictionary, timeStamp: String) {
    self.msgId = msgId
    self.fromUser = fromUser
    self.isOutGoing = isOutGoing
    self.time = time
    self.status = status
    self.type = type
    self.messageStatus = messageStatus
    self.customDict = customDict
    self.duration = 0.0
    self.tStamp = timeStamp
    
    super.init()
    
    if let layout = cellLayout {
      self.cellLayout = layout
    } else {
      let bubbleSize = self.calculateBubbleContentSize()
        self.cellLayout = IMUIMessageCellLayout(isOutGoingMessage: isOutGoing, isNeedShowTime: isNeedShowTime, bubbleContentSize: bubbleSize, bubbleContentInsets: UIEdgeInsets.zero, showAvatar:isShowAvatar)
    }
  }
  
  open var resizableBubbleImage: UIImage {
    var bubbleImg: UIImage?
    if isOutGoing {
      bubbleImg = UIImage.imuiImage(with: "outGoing_bubble")
        bubbleImg = bubbleImg?.resizableImage(withCapInsets: UIEdgeInsets(top: 24, left: 10, bottom: 9, right: 15), resizingMode: .tile)
    } else {
      bubbleImg = UIImage.imuiImage(with: "inComing_bubble")
        bubbleImg = bubbleImg?.resizableImage(withCapInsets: UIEdgeInsets(top: 24, left: 15, bottom: 9, right: 10), resizingMode: .tile)
    }
    
    return bubbleImg!
  }
  
}
