//
//  MyMessageModel.swift
//  IMUIChat
//
//  Created by oshumini on 2017/3/5.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit



open class RCTMessageModel: IMUIMessageModel {
  static let kMsgKeyStatus = "status"
  static let kMsgStatusSuccess = "send_succeed"
  static let kMsgStatusSending = "send_going"
  static let kMsgStatusFail = "send_failed"
  static let kMsgStatusDownloadFail = "download_failed"
  static let kMsgStatusDownloading = "downloading"
  

  
  static let kMsgKeyMsgType = "msgType"
  static let kMsgTypeText = "text"
  static let kMsgTypeVoice = "voice"
  static let kMsgTypeVideo = "video"
  static let kMsgTypeImage = "image"
    static let kMsgTypeLocation = "location"
    static let kMsgTypeNotification = "notification"
    static let kMsgTypeRedpacket = "redpacket"
    static let kMsgTypeTransfer = "transfer"
    static let kMsgTypeUrl = "url"
    static let kMsgTypeAccountNotifce = "account_notice"
    static let kMsgTypeRedpacketOpen = "redpacketOpen"
    static let kMsgTypeCard = "card"
    static let kMsgTypeUnKnow = "unknown"
    static let kMsgTypeCustom = "custom"
    
    
  static let kMsgKeyMsgId = "msgId"
  static let kMsgKeyFromUser = "fromUser"
  static let kMsgKeyText = "text"
  static let kMsgKeyisOutgoing = "isOutgoing"
  static let kMsgKeyMediaFilePath = "mediaPath"
  static let kMsgKeyDuration = "duration"
  static let kUserKeyUerId = "_id"
  static let kUserKeyDisplayName = "name"
  static let kUserAvatarPath = "avatar"
    static let kMsgKeyExtend = "extend"
  
  static let ktimeString = "timeString"
    static let kisShowTime = "isShowTime"
  
  
  open var myTextMessage: String = ""
  
  var mediaPath: String = ""
    var coverUrl: String = ""
    var videoUrl: String = ""
  
  override open func mediaFilePath() -> String {
    return mediaPath
  }

  @objc static public var outgoingBubbleImage: UIImage = {
    var bubbleImg = UIImage.imuiImage(with: "outGoing_bubble")
    bubbleImg = bubbleImg?.resizableImage(withCapInsets: UIEdgeInsets(top: 24, left: 10, bottom: 9, right: 15), resizingMode: .tile)
    return bubbleImg!
  }()
  
  @objc static public var incommingBubbleImage: UIImage = {
    var bubbleImg = UIImage.imuiImage(with: "inComing_bubble")
    bubbleImg = bubbleImg?.resizableImage(withCapInsets: UIEdgeInsets(top: 24, left: 15, bottom: 9, right: 10), resizingMode: .tile)
    return bubbleImg!
  }()
  //时间戳转时间
  @objc static func timeStampToString(timeStamp:String)->String {
        
        let string = NSString(string: timeStamp)
        let timeSta:TimeInterval = string.doubleValue
        let nowDate = Date.init()
        let msgDate = NSDate(timeIntervalSince1970: timeSta)
        var result = ""
        let calendar = Calendar.current
        let components = [Calendar.Component.day,Calendar.Component.month,Calendar.Component.year,Calendar.Component.weekday,Calendar.Component.hour,Calendar.Component.minute] as Set<Calendar.Component>
        let nowDateComponents = calendar.dateComponents(components, from: nowDate)
        let msgDateComponents = calendar.dateComponents(components, from: msgDate as Date)
    
        var hour :Int = msgDateComponents.hour!
        let min :Int = msgDateComponents.minute!
        result = getPeriodOfTime(hour: hour, minute: min)
        var strMin = "\(min)"
        if min < 10 {
            strMin = "0\(min)"
        }
    
        if(hour > 12){
            hour = hour - 12
        }
        if(nowDateComponents.day == msgDateComponents.day){//同一天,显示时间
            result = result + " \(hour):" + strMin
        }
        else if(nowDateComponents.day == (msgDateComponents.day!+1)){//昨天
            result = "昨天 " + result + " \(hour):" + strMin
        }
        else if(nowDateComponents.day == (msgDateComponents.day!+2)){//前天
            result = "前天 " + result + " \(hour):" + strMin
        }
        else {
            let timeSta:TimeInterval = nowDate.timeIntervalSince(msgDate as Date)
            if (timeSta < (7 * 24*60*60)){//一周内
                let weeks = msgDateComponents.weekday
                let weekDay = weekdayStr(dayOfWeek:weeks!)
                result = weekDay + " " + result + " \(hour):" + strMin
            }else{
                result = "\(String(describing: msgDateComponents.year!))年\(String(describing:msgDateComponents.month!))月\(String(describing: msgDateComponents.day!))日 " + result + " \(hour):" + strMin
            }
        }
        return result
    }
    
  @objc  static func getPeriodOfTime(hour:Int, minute:Int)->String{
        let totalMin = hour * 60 + minute
        var showPeriodOfTime = ""
        if (totalMin > 0) && (totalMin <= 5*60){
            showPeriodOfTime = "凌晨"
        }
        else if (totalMin > 5*60) && (totalMin <= 12*60){
            showPeriodOfTime = "上午"
        }
        else if (totalMin > 12*60) && (totalMin <= 18*60){
            showPeriodOfTime = "下午"
        }
        else if ((totalMin > 5*60) && (totalMin <= (23 * 60 + 59))) || totalMin == 0{
            showPeriodOfTime = "晚上"
        }
        return showPeriodOfTime
    }
    
   @objc static func weekdayStr(dayOfWeek:Int)->String{
        let daysOfWeekDict:Dictionary<Int,String> = [1:"星期日", 2:"星期一", 3:"星期二", 4:"星期三", 5:"星期四", 6:"星期五", 7:"星期六"];
        return daysOfWeekDict[dayOfWeek]!
    }
    
    
  @objc override open var resizableBubbleImage: UIImage {
    // return defoult message bubble
    if isOutGoing {
      return RCTMessageModel.outgoingBubbleImage
    } else {
      return RCTMessageModel.incommingBubbleImage
    }
  }
  
 @objc public init(msgId: String, messageStatus: IMUIMessageStatus, fromUser: RCTUser, isOutGoing: Bool, time: String, status: IMUIMessageStatus, type: IMUIMessageType, text: String, mediaPath: String, layout: IMUIMessageCellLayoutProtocal?,customDict: NSMutableDictionary, timeStamp:String) {
    
    self.myTextMessage = text
    self.mediaPath = mediaPath
    
    super.init(msgId: msgId, messageStatus: messageStatus, fromUser: fromUser, isOutGoing: isOutGoing, time: time, status: status, type: type, cellLayout: layout ,customDict: customDict, timeStamp: timeStamp)
  }
  
  @objc public convenience init(messageDic: NSMutableDictionary) {
    
    let msgId = messageDic.object(forKey: RCTMessageModel.kMsgKeyMsgId) as! String
    let msgTypeString = messageDic.object(forKey: RCTMessageModel.kMsgKeyMsgType) as? String
    let statusString = messageDic.object(forKey: RCTMessageModel.kMsgKeyStatus) as? String
    let isOutgoing = messageDic.object(forKey: RCTMessageModel.kMsgKeyisOutgoing) as? Bool
    let timeString = messageDic.object(forKey: RCTMessageModel.ktimeString) as? String
    let timeStamp = messageDic.object(forKey: RCTMessageModel.ktimeString) as? String
    let isShowTime = messageDic.object(forKey: RCTMessageModel.kisShowTime) as? Bool
//    let isShowTime = true
    let needShowTime = isShowTime
    var strTime = ""
    var customDict: NSMutableDictionary = NSMutableDictionary()
    if needShowTime!{
        if let timeString = timeString {
            if timeString != "" {
                strTime = RCTMessageModel.timeStampToString(timeStamp:timeString)
            }
        }
    }

    var mediaPath = messageDic.object(forKey: RCTMessageModel.kMsgKeyMediaFilePath) as? String
    if let _ = mediaPath {
      
    } else {
      mediaPath = ""
    }
    
    var text = messageDic.object(forKey: RCTMessageModel.kMsgKeyText) as? String
    if let _ = text {
      
    } else {
      text = ""
    }
    
    var msgType: IMUIMessageType?
    // TODO: duration
    let userDic = messageDic.object(forKey: RCTMessageModel.kMsgKeyFromUser) as? NSDictionary
    let user = RCTUser(userDic: userDic!)
    
    var textLayout: MyMessageCellLayout?
    
    if let typeString = msgTypeString {
      if typeString == RCTMessageModel.kMsgTypeText {
        msgType = .text
        textLayout = MyMessageCellLayout(isOutGoingMessage: isOutgoing!,
                                       isNeedShowTime: needShowTime!,
                                       bubbleContentSize: RCTMessageModel.calculateTextContentSize(text: text!, isOutGoing: isOutgoing!), bubbleContentInsets: UIEdgeInsets.zero, showAvatar:true)
      }else if typeString == RCTMessageModel.kMsgTypeImage {
        msgType = .image
        customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
      }else if typeString == RCTMessageModel.kMsgTypeVoice {
        
        msgType = .voice
        customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
      }else if typeString == RCTMessageModel.kMsgTypeVideo {
        msgType = .video
        customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
      }else if typeString == RCTMessageModel.kMsgTypeLocation {
            msgType = .location
            customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
        }else if typeString == RCTMessageModel.kMsgTypeNotification {
            msgType = .notification
            customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
        }else if typeString == RCTMessageModel.kMsgTypeRedpacket {
            msgType = .redpacket
            customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
        }else if typeString == RCTMessageModel.kMsgTypeTransfer {
            msgType = .transfer
            customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
        }else if typeString == RCTMessageModel.kMsgTypeRedpacketOpen {
            msgType = .redpacketOpen
            customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
      }else if typeString == RCTMessageModel.kMsgTypeCard{
        msgType = .card
        customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
      }else if typeString == RCTMessageModel.kMsgTypeCustom{
        msgType = .custom
        customDict = messageDic.object(forKey: RCTMessageModel.kMsgKeyExtend) as! NSMutableDictionary
      }else{
            msgType = .unknown
        }
        
    }else{
        msgType = .unknown
    }
    
    var msgStatus = IMUIMessageStatus.success
    if let statusString = statusString {
      
      if statusString == RCTMessageModel.kMsgStatusSuccess {
        msgStatus = .success
      }
      
      if statusString == RCTMessageModel.kMsgStatusFail {
        msgStatus = .failed
      }
      
      if statusString == RCTMessageModel.kMsgStatusSending {
        msgStatus = .sending
      }
      
      if statusString == RCTMessageModel.kMsgStatusDownloadFail {
        msgStatus = .mediaDownloadFail
      }
      
      if statusString == RCTMessageModel.kMsgStatusDownloading {
        msgStatus = .mediaDownloading
      }
      
    }
    self.init(msgId: msgId, messageStatus: msgStatus, fromUser: user, isOutGoing: isOutgoing!, time: strTime, status: msgStatus, type: msgType!, text: text!, mediaPath: mediaPath!, layout:  textLayout ,customDict: customDict, timeStamp:timeStamp! )

  }
  
    convenience init(msgId: String, text: String, isOutGoing: Bool, user: RCTUser, customDict:NSMutableDictionary, timeStamp: String) {

    let myLayout = MyMessageCellLayout(isOutGoingMessage: isOutGoing,
                                       isNeedShowTime: false,
                                       bubbleContentSize: RCTMessageModel.calculateTextContentSize(text: text, isOutGoing: isOutGoing), bubbleContentInsets: UIEdgeInsets.zero,showAvatar:true)
    let msgId = "\(NSDate().timeIntervalSince1970 * 1000)"
    self.init(msgId: msgId, messageStatus: .failed, fromUser: user, isOutGoing: isOutGoing, time: "", status: .success, type: .text, text: text, mediaPath: "", layout:  myLayout ,customDict: customDict, timeStamp: timeStamp)
  }

  convenience init(msgId: String, voicePath: String, isOutGoing: Bool, user: RCTUser, customDict:NSMutableDictionary, timeStamp: String) {
    self.init(msgId: msgId, messageStatus: .sending, fromUser: user, isOutGoing: isOutGoing, time: "", status: .success, type: .voice, text: "", mediaPath: voicePath, layout:  nil, customDict: customDict, timeStamp: timeStamp)
  }
  
  convenience init(msgId: String, imagePath: String, isOutGoing: Bool, user: RCTUser, customDict:NSMutableDictionary, timeStamp: String) {
    self.init(msgId: msgId, messageStatus: .sending, fromUser: user, isOutGoing: isOutGoing, time: "", status: .success, type: .image, text: "", mediaPath: imagePath, layout:  nil, customDict: customDict, timeStamp: timeStamp)
  }
  
  convenience init(msgId: String, videoPath: String, isOutGoing: Bool, user: RCTUser, customDict:NSMutableDictionary, timeStamp: String) {
    self.init(msgId: msgId, messageStatus: .sending, fromUser: user, isOutGoing: isOutGoing, time: "", status: .success, type: .video, text: "", mediaPath: videoPath, layout:  nil, customDict: customDict, timeStamp: timeStamp)
  }
  
  override open func text() -> String {
    return self.myTextMessage
  }
  
  @objc static func calculateTextContentSize(text: String, isOutGoing: Bool) -> CGSize {
    let tmpLabel = YYLabel()
    tmpLabel.font = IMUITextMessageCell.inComingTextFont
 tmpLabel.setupYYText(text, andUnunderlineColor: UIColor.white)
//    return tmpLabel.sizeThatFits(CGSize(width: IMUIMessageCellLayout.bubbleMaxWidth, height: CGFloat(MAXFLOAT)))
    return tmpLabel.getTheLabelBubble(CGSize(width: IMUIMessageCellLayout.bubbleMaxWidth, height: CGFloat(MAXFLOAT)))
    
//    if isOutGoing {
//      return text.sizeWithConstrainedWidth(with: IMUIMessageCellLayout.bubbleMaxWidth, font: IMUITextMessageCell.outGoingTextFont)
//    } else {
//      return text.sizeWithConstrainedWidth(with: IMUIMessageCellLayout.bubbleMaxWidth, font: IMUITextMessageCell.inComingTextFont)
//    }
  }
  
   @objc public var messageDictionary: NSMutableDictionary {
    get {
      
      var messageDic = NSMutableDictionary()
      messageDic.setValue(self.msgId, forKey: RCTMessageModel.kMsgKeyMsgId)
      messageDic.setValue(self.isOutGoing, forKey: RCTMessageModel.kMsgKeyisOutgoing)

      switch self.type {
      case .text:
        messageDic.setValue(RCTMessageModel.kMsgTypeText, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.text(), forKey: RCTMessageModel.kMsgKeyText)
        break
      case .image:
        messageDic.setValue(RCTMessageModel.kMsgTypeImage, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.mediaPath, forKey: RCTMessageModel.kMsgKeyMediaFilePath)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .voice:
        messageDic.setValue(RCTMessageModel.kMsgTypeVoice, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.mediaPath, forKey: RCTMessageModel.kMsgKeyMediaFilePath)
        messageDic.setValue(self.duration, forKey: RCTMessageModel.kMsgKeyDuration)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .video:
        messageDic.setValue(RCTMessageModel.kMsgTypeVideo, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.mediaPath, forKey: RCTMessageModel.kMsgKeyMediaFilePath)
        messageDic.setValue(self.duration, forKey: RCTMessageModel.kMsgKeyDuration)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .location:
        messageDic.setValue(RCTMessageModel.kMsgTypeLocation, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .notification:
        messageDic.setValue(RCTMessageModel.kMsgTypeNotification, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .redpacket:
        messageDic.setValue(RCTMessageModel.kMsgTypeRedpacket, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .transfer:
        messageDic.setValue(RCTMessageModel.kMsgTypeTransfer, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .url:
        messageDic.setValue(RCTMessageModel.kMsgTypeUrl, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .account_notice:
        messageDic.setValue(RCTMessageModel.kMsgTypeAccountNotifce, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .redpacketOpen:
        messageDic.setValue(RCTMessageModel.kMsgTypeRedpacketOpen, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .card:
        messageDic.setValue(RCTMessageModel.kMsgTypeCard, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
      case .unknown:
        messageDic.setValue(RCTMessageModel.kMsgTypeUnKnow, forKey: RCTMessageModel.kMsgKeyMsgType)
        break
      case .custom:
        messageDic.setValue(RCTMessageModel.kMsgTypeCustom, forKey: RCTMessageModel.kMsgKeyMsgType)
        messageDic.setValue(self.customDict, forKey: RCTMessageModel.kMsgKeyExtend)
        break
        
      default:
        break
      }
      
      var msgStatus = ""
      switch self.status {
      case .success:
        msgStatus = RCTMessageModel.kMsgStatusSuccess
        break
      case .sending:
        msgStatus = RCTMessageModel.kMsgStatusSending
        break
      case .failed:
        msgStatus = RCTMessageModel.kMsgStatusFail
        break
      case .mediaDownloading:
        msgStatus = RCTMessageModel.kMsgStatusDownloading
        break
      case .mediaDownloadFail:
        msgStatus = RCTMessageModel.kMsgStatusDownloadFail
        break
      }
      
      messageDic.setValue(msgStatus, forKey: "status")
      let userDic = NSMutableDictionary()
      userDic.setValue(self.fromUser.userId(), forKey: "_id")
      userDic.setValue(self.fromUser.displayName(), forKey: "name")
      let user = self.fromUser as! RCTUser
      userDic.setValue(user.rAvatarFilePath, forKey: "avatar")
      
      messageDic.setValue(userDic, forKey: "fromUser")
      messageDic.setValue(self.msgId, forKey: "msgId")
      return messageDic
    }
  }
}



//MARK - IMUIMessageCellLayoutProtocal
public class MyMessageCellLayout: IMUIMessageCellLayout {

 @objc public static var outgoingPadding = UIEdgeInsets(top: 0, left: 8, bottom: 0, right: 14)
 @objc public static var incommingPadding = UIEdgeInsets(top: 0, left: 14, bottom: 0, right: 8)

  
    override init(isOutGoingMessage: Bool, isNeedShowTime: Bool, bubbleContentSize: CGSize, bubbleContentInsets: UIEdgeInsets, showAvatar: Bool) {
    
    super.init(isOutGoingMessage: isOutGoingMessage, isNeedShowTime: isNeedShowTime, bubbleContentSize: bubbleContentSize, bubbleContentInsets: bubbleContentInsets,showAvatar:showAvatar)
  }
  
  open override var bubbleContentInset: UIEdgeInsets {
    if isOutGoingMessage {
      return MyMessageCellLayout.outgoingPadding
    } else {
      return MyMessageCellLayout.incommingPadding
    }
  }
  
}


