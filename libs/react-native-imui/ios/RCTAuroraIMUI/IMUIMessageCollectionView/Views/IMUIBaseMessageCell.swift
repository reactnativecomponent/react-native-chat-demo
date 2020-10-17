//
//  IMUIBaseMessageCell.swift
//  IMUIChat
//
//  Created by oshumini on 2017/3/2.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit


enum IMUIMessageCellType {
  case incoming
  case outgoing
}

open class IMUIBaseMessageCell: UICollectionViewCell, IMUIMessageCellProtocal,MenuPopOverViewDelegate,UIAlertViewDelegate {
  @objc public var bubbleView: IMUIMessageBubbleView
  lazy var avatarImage = MyCacheImageView()
    lazy var timeBackView = UIView()
  lazy var timeLabel = UILabel()
  lazy var nameLabel = UILabel()
    lazy var durationLabel = UILabel()
    lazy var isPlayedView = UIView() //录音是否播放过
  weak var statusView: UIView?
   @objc public var cellType:String?
   @objc public var cellMsgId:String?
    
  @objc weak var delegate: IMUIMessageMessageCollectionViewDelegate?
  var message: IMUIMessageModelProtocol?
    var cellGesture = UITapGestureRecognizer.init()
   var bubbleGesture = UITapGestureRecognizer.init()
   var longPress = UILongPressGestureRecognizer.init()
  override init(frame: CGRect) {

    bubbleView = IMUIMessageBubbleView(frame: CGRect.zero)
    super.init(frame: frame)
    
    self.contentView.addSubview(self.bubbleView)
    self.contentView.addSubview(self.avatarImage)
    self.contentView.addSubview(self.timeBackView)
    self.timeBackView.addSubview(self.timeLabel)
    self.contentView.addSubview(self.nameLabel)
    self.contentView.addSubview(self.durationLabel)
    self.contentView.addSubview(self.isPlayedView)
//    let bubbleGesture = UITapGestureRecognizer(target: self, action: #selector(self.tapBubbleView))
//    let longPressBubbleGesture = UILongPressGestureRecognizer(target: self, action: #selector(self.longTapBubbleView))
//    bubbleGesture.numberOfTapsRequired = 1
//    self.bubbleView.isUserInteractionEnabled = true
//    self.bubbleView.addGestureRecognizer(bubbleGesture)
//    self.bubbleView.addGestureRecognizer(longPressBubbleGesture)
    
    self.cellGesture.addTarget(self, action: #selector(self.tapCellView))
    self.bubbleGesture.addTarget(self, action: #selector(self.tapBubbleView))
    self.bubbleGesture.cancelsTouchesInView = false
    self.longPress.addTarget(self, action: #selector(self.longTapBubbleView(sender:)))
    self.bubbleView.isUserInteractionEnabled = true
    self.bubbleView.addGestureRecognizer(self.bubbleGesture)
    self.bubbleView.addGestureRecognizer(self.longPress)
    self.bubbleGesture.numberOfTapsRequired = 1
    self.addGestureRecognizer(self.cellGesture)
    
    let avatarGesture = UITapGestureRecognizer(target: self, action: #selector(self.tapHeaderImage))
    avatarGesture.numberOfTapsRequired = 1
    avatarImage.isUserInteractionEnabled = true
    avatarImage.addGestureRecognizer(avatarGesture)
    
    let longAvatarPress = UILongPressGestureRecognizer(target: self, action: #selector(self.longTapAvatarPress(sender:)))
    avatarImage.addGestureRecognizer(longAvatarPress)
    nameLabel.font = IMUIMessageCellLayout.nameLabelTextFont
    durationLabel.font = UIFont.systemFont(ofSize: 14)
    durationLabel.textColor = UIColor.init(red: 157/255.0, green: 157/255.0, blue: 158/255.0, alpha: 1)
    
    isPlayedView.backgroundColor = UIColor.init(red: 216/255.0, green: 38/255.0, blue: 23/255.0, alpha: 1)
    isPlayedView.clipsToBounds = true
    isPlayedView.layer.cornerRadius = 3
    
    self.setupSubViews()

  }
  
  fileprivate func setupSubViews() {
    timeLabel.textAlignment = .center
    timeLabel.textColor = UIColor.white
    timeLabel.font = IMUIMessageCellLayout.timeStringFont
    timeBackView.backgroundColor = UIColor.init(red: 206/255.0, green: 206/255.0, blue: 206/255.0, alpha: 1)
    timeBackView.layer.cornerRadius = 5
    timeBackView.clipsToBounds = true
  }
  
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func layoutCell(with layout: IMUIMessageCellLayoutProtocal, viewCache: IMUIReuseViewCache) {
    self.timeBackView.frame = layout.timeLabelFrame
    self.timeLabel.frame = self.timeBackView.bounds
    self.avatarImage.frame = layout.avatarFrame
    self.avatarImage.layer.cornerRadius = 5.0;
    self.avatarImage.layer.masksToBounds = true;
    self.bubbleView.frame = layout.bubbleFrame
    self.nameLabel.frame = layout.nameLabelFrame
    self.durationLabel.frame = layout.durationLabelFrame
    self.isPlayedView.frame = layout.isPlayedFrame
    self.removeStatusView(viewCache: viewCache)
    
    self.statusView = viewCache.statusViewCache.dequeue(layout: layout ) as? UIView
    self.contentView.addSubview(self.statusView!)
    self.addGestureForStatusView()
    self.nameLabel.textColor = UIColor.init(red: 157/255.0, green: 157/255.0, blue: 158/255.0, alpha: 1)
    self.statusView!.frame = layout.statusViewFrame
    
  }
  
  func addGestureForStatusView() {
    for recognizer in self.statusView?.gestureRecognizers ?? [] {
      self.statusView?.removeGestureRecognizer(recognizer)
    }
    
    let statusViewGesture = UITapGestureRecognizer(target: self, action: #selector(self.tapSatusView))
    statusViewGesture.numberOfTapsRequired = 1
    self.statusView?.isUserInteractionEnabled = true
    self.statusView?.addGestureRecognizer(statusViewGesture)
  }
  
  func removeStatusView(viewCache: IMUIReuseViewCache) {
    if let view = self.statusView {
      viewCache.statusViewCache.switchStatusViewToNotInUse(statusView: self.statusView as! IMUIMessageStatusViewProtocal)
      view.removeFromSuperview()
    } else {
      for view in self.contentView.subviews {
        if let _ = view as? IMUIMessageStatusViewProtocal {
          viewCache.statusViewCache.switchStatusViewToNotInUse(statusView: view as! IMUIMessageStatusViewProtocal)
          view.removeFromSuperview()
        }
      }
    }
  }
  
  func setupData(with message: IMUIMessageModelProtocol) {
//    self.avatarImage.image = message.fromUser.Avatar()
    self.avatarImage.setImageURL(message.fromUser.Avatar(), placeholderImage: "defaultHead")
    self.bubbleView.backgroundColor = UIColor.clear
    self.timeLabel.text = message.timeString
    let timeW = widthWithFont(font: IMUIMessageCellLayout.timeStringFont, text: message.timeString)
    let timeX = (UIScreen.main.bounds.size.width - timeW)*0.5
    var timeRect = self.timeBackView.frame;
    timeRect.size.width = timeW
    timeRect.origin.x = timeX
    self.timeBackView.frame = timeRect
    self.timeLabel.frame = self.timeBackView.bounds
    self.timeBackView.isHidden = true
    if self.timeBackView.frame.size.width > 0 {
        self.timeBackView.isHidden = false
    }
    self.nameLabel.text = message.fromUser.displayName()
    self.message = message
    if message.type == .notification || message.type == .redpacketOpen || message.type == .unknown{
        self.bubbleView.backgroundColor = UIColor.clear
    }else{
        self.bubbleView.setupBubbleImage(resizeBubbleImage: message.resizableBubbleImage)
    }
    if message.type == .image{
        cellType = "image"
        cellMsgId = self.message?.msgId
    }
    self.durationLabel.isHidden = true
    self.isPlayedView.isHidden = true
    
    let statusView = self.statusView as! IMUIMessageStatusViewProtocal
    self.statusView?.isHidden = false
    switch message.messageStatus {
      case .sending:
        statusView.layoutSendingStatus()
        break
      case .failed:
        statusView.layoutFailedStatus()
        break
      case .success:
        statusView.layoutSuccessStatus()
        self.statusView?.isHidden = true
        if message.type == .voice{//录音
            self.durationLabel.isHidden = false
            let tmpDict = message.customDict
            let strDuration = tmpDict.object(forKey: "duration") as! String
            let intDuration = (strDuration as NSString).intValue
            if intDuration > 60 {
                self.durationLabel.text = "60\""
            }else{
               self.durationLabel.text = strDuration+"\""
            }
            if message.isOutGoing {
                self.durationLabel.textAlignment = .right
            } else {
                self.durationLabel.textAlignment = .left
                let isPlayed = tmpDict.object(forKey: "isPlayed") as! Bool
                self.isPlayedView.isHidden = isPlayed
            }
        }
        break
      case .mediaDownloading:
        statusView.layoutMediaDownloading()
        break
      case .mediaDownloadFail:
        statusView.layoutMediaDownloadFail()
    }
    
    if message.isOutGoing {
      self.nameLabel.textAlignment = .right
    } else {
      self.nameLabel.textAlignment = .left
    }
  }
  
    func widthWithFont(font : UIFont,  text : String) -> CGFloat {
        
        guard text.characters.count > 0  else {
            
            return 0
        }
        let size = CGSize(width:CGFloat(MAXFLOAT), height:CGFloat(MAXFLOAT))
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: [NSAttributedString.Key.font : font], context:nil)
        
        return rect.size.width+10
    }
    
  func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache, delegate: IMUIMessageMessageCollectionViewDelegate?) {
    self.layoutCell(with: message.layout, viewCache: viewCache)
    self.setupData(with: message)
    self.delegate = delegate
  }
  
  @objc func tapBubbleView() {
    UIApplication.shared.keyWindow?.endEditing(true)
    if self.message?.type == .text {
//        self.delegate?.messageCollectionView?(tapCellView: "")
    }else if self.message?.type == .image {
        let strMsgID = (self.message?.msgId)! as NSString
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "ShowOrigImageNotification"), object: strMsgID)
//        self.delegate?.messageCollectionView?(didTapImageMessageBubbleInCell:rect, model: self.message! )
        self.delegate?.messageCollectionView?(didTapMessageBubbleInCell: self, model: self.message!)
        
    }else if self.message?.type == .video && message?.mediaFilePath() != "" {
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "PlayVideoNotification"), object: message?.mediaFilePath())
        self.delegate?.messageCollectionView?(didTapMessageBubbleInCell: self, model: self.message!)
        
    }else{
        self.delegate?.messageCollectionView?(didTapMessageBubbleInCell: self, model: self.message!)
    }
  }
    
   @objc func tapCellView(){//点击整个cell，隐藏键盘
        self.delegate?.messageCollectionView?(tapCellView: "")
//        UIApplication.shared.keyWindow?.endEditing(true)
    }
    
    
    
  @objc func longTapBubbleView(sender : UILongPressGestureRecognizer) {

    if sender.state == UIGestureRecognizer.State.began && self.message?.messageStatus != .sending{
        if self.message?.type == .notification || self.message?.type == .redpacketOpen || self.message?.type == .unknown {
            return
        }
        let items = NSMutableArray.init()
        if self.message?.type == .text {
            items.add("复制")
        }
        items.add("删除")
        let strTime:String = (self.message?.timeStamp)!
        let tmpStamp = (strTime as NSString).integerValue
        let now = Date()
        let timeInterval:TimeInterval = now.timeIntervalSince1970
        let nowTimeStamp = Int(timeInterval)
        if ((nowTimeStamp - tmpStamp < 120) && (self.message?.isOutGoing)!){
            items.add("撤回")
        }
        let popOver = MenuPopOverView()
        popOver.delegate = self as MenuPopOverViewDelegate
        popOver.presentPopover(from: self.bubbleView.bounds, in: self.bubbleView, withStrings: items as! [Any])
        let obj = "showMenu" as NSString
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "kClickLongTouchShowMenuNotification"), object: obj)
        self.delegate?.messageCollectionView?(longTapCellViewModel: self.message!)
    }
  }
    
    public func popoverView(_ popoverView: MenuPopOverView!, didSelectItem strIndex: String!) {
        self.delegate?.messageCollectionView?(didShowMenuStr:strIndex, model: self.message!)
    }
    
    public func popoverViewDidDismiss(_ popoverView: MenuPopOverView!) {
        let obj = "dismissMenu" as NSString
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "kClickLongTouchShowMenuNotification"), object: obj)
    }
    
  @objc func tapHeaderImage() {
    self.delegate?.messageCollectionView?(didTapHeaderImageInCell: self, model: self.message!)
  }
  //长按头像
   @objc func longTapAvatarPress(sender : UILongPressGestureRecognizer){
        if !(self.message?.isOutGoing)! {
            if sender.state == UIGestureRecognizer.State.began{
                self.delegate?.messageCollectionView?(longTapAvatarPressWithModel: self.message!)
               
            }
        }
    }
    
    
  @objc func tapSatusView() {
    self.delegate?.messageCollectionView?(didTapStatusViewInCell: self, model: self.message!)
//    let alter = UIAlertView.init(title: "重发该消息？", message: "", delegate: self, cancelButtonTitle: "取消", otherButtonTitles: "确定")
//    alter.show()
    
  }
  
//    public func alertView(_ alertView:UIAlertView, clickedButtonAt buttonIndex: Int){
//        if(buttonIndex==alertView.cancelButtonIndex){
//            print("取消")
//        }else{
//            self.delegate?.messageCollectionView?(didTapStatusViewInCell: self, model: self.message!)
//        }
//    }
    
  func didDisAppearCell() {
  }

    
    deinit {
        NotificationCenter.default.removeObserver(self)
        self.bubbleView.removeGestureRecognizer(self.bubbleGesture)
        self.bubbleView.removeGestureRecognizer(self.longPress)
        self.removeGestureRecognizer(self.cellGesture)
    }
    

}
