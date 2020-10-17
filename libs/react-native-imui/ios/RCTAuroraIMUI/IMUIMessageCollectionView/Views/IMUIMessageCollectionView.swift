//
//  IMUIMessageCollectionView.swift
//  IMUIChat
//
//  Created by oshumini on 2017/3/2.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit


open class IMUIMessageCollectionView: UIView {
    
  @IBOutlet var view: UIView!
  @IBOutlet open weak var messageCollectionView: UICollectionView!
    var isPull = false
    var isAutoScroll = true //自动刷新
    var isInsert = false //是不是插入数据
    var cellGesture = UITapGestureRecognizer.init() //点击collectionView隐藏
  var viewCache = IMUIReuseViewCache()
    var headView = IMUIBaseMessageHeadCell()
  
  // React Native Property ---->
  var action: Array<Any> {
    set {
      print("\(newValue)")
    }
    
    get {
      return []
    }
  }
  // React Native Property <----
  
  var chatDataManager = IMUIChatDataManager()
  @objc open weak var delegate: IMUIMessageMessageCollectionViewDelegate?
  
  open override func awakeFromNib() {
    super.awakeFromNib()
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    let bundle = Bundle.imuiBundle()
    view = bundle.loadNibNamed("IMUIMessageCollectionView", owner: self, options: nil)?.first as? UIView
    
    self.addSubview(view)
    view.frame = self.bounds
    self.chatDataManager = IMUIChatDataManager()
    self.setupMessageCollectionView()
    
  }
    
  required public init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    
    let bundle = Bundle.imuiBundle()
    view = bundle.loadNibNamed("IMUIMessageCollectionView", owner: self, options: nil)?.first as? UIView
    
    self.addSubview(view)
    view.frame = self.bounds
    self.chatDataManager = IMUIChatDataManager()
    self.setupMessageCollectionView()
  }
  
    
  override open func layoutSubviews() {
    super.layoutSubviews()
//    IMUIMessageCellLayout.cellWidth = self.imui_width
    IMUIMessageCellLayout.cellWidth = UIScreen.main.bounds.size.width
  }
  
  func setupMessageCollectionView() {

    self.messageCollectionView.delegate = self
    self.messageCollectionView.dataSource = self
    
//    self.messageCollectionView.register(IMUITextMessageCell.self, forCellWithReuseIdentifier: IMUITextMessageCell.self.description())
    self.messageCollectionView.register(IMUITextMessageCell.self, forCellWithReuseIdentifier: "messageText")
    self.messageCollectionView.register(IMUIImageMessageCell.self, forCellWithReuseIdentifier: IMUIImageMessageCell.self.description())
    self.messageCollectionView.register(IMUIVoiceMessageCell.self, forCellWithReuseIdentifier: IMUIVoiceMessageCell.self.description())
    self.messageCollectionView.register(IMUIVideoMessageCell.self, forCellWithReuseIdentifier: IMUIVideoMessageCell.self.description())
    self.messageCollectionView.register(IMUILocationMessageCell.self, forCellWithReuseIdentifier: IMUILocationMessageCell.self.description())
    self.messageCollectionView.register(IMUINotificationMessageCell.self, forCellWithReuseIdentifier: IMUINotificationMessageCell.self.description())
    self.messageCollectionView.register(IMUIRedPacketMessageCell.self, forCellWithReuseIdentifier: IMUIRedPacketMessageCell.self.description())
    self.messageCollectionView.register(IMUITransferMessageCell.self, forCellWithReuseIdentifier: IMUITransferMessageCell.self.description())
    self.messageCollectionView.register(IMUIRedPacketOpenMessageCell.self, forCellWithReuseIdentifier: IMUIRedPacketOpenMessageCell.self.description())
    self.messageCollectionView.register(IMUIUnKnownMessageCell.self, forCellWithReuseIdentifier: IMUIUnKnownMessageCell.self.description())
    self.messageCollectionView.register(IMUICustomMessageContentCell.self, forCellWithReuseIdentifier: IMUICustomMessageContentCell.self.description())
    self.messageCollectionView.register(IMUIBaseMessageHeadCell.self, forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: "headView")
    self.messageCollectionView.register(IMUICardMessageCell.self, forCellWithReuseIdentifier: IMUICardMessageCell.self.description())
    
    self.messageCollectionView.isScrollEnabled = true
    NotificationCenter.default.addObserver(self, selector: #selector(clickStopPlayActivity(notification:)), name: NSNotification.Name(rawValue: "StopPlayActivity"), object: nil)
    self.cellGesture.addTarget(self, action: #selector(self.tapCollectionView))
    self.messageCollectionView.addGestureRecognizer(self.cellGesture)
  }
  
    @objc func tapCollectionView(){//点击整个cell，隐藏键盘
        self.delegate?.messageCollectionView?(tapCellView: "")
    }

    
  open subscript(index: Int) -> IMUIMessageModelProtocol {
    return chatDataManager[index]
  }
  
  open subscript(msgId: String) -> IMUIMessageModelProtocol? {
    return chatDataManager[msgId]
  }
  
  open var messageCount: Int {
    return chatDataManager.count
  }
  
  @objc open func scrollToBottom(with animated: Bool) {
    if chatDataManager.count == 0 { return }
    let endIndex = IndexPath(item: chatDataManager.endIndex - 1, section: 0)
    self.messageCollectionView.scrollToItem(at: endIndex, at: .bottom, animated: animated)
  }
    
    open func scrollTo(index:Int) {
        let scrollIndex = IndexPath(item: index, section: 0)
        self.messageCollectionView.scrollToItem(at: scrollIndex, at: .top, animated: false)
    }
  
    
  @objc open func appendMessage(with message: IMUIMessageModel) {
    self.chatDataManager.appendMessage(with: message)
    self.messageCollectionView.reloadData()
//    self.scrollToBottom(with: true)
  }
    
    @objc open func fristAppendMessages(with messages: Array<IMUIMessageModel>) {
        for message in messages{
            self.chatDataManager.appendMessage(with: message)
        }
        self.messageCollectionView.reloadData()
        scrollToBottom(with: false)
        
    }
    

    @objc open func deleteMessage(with messageId: String) {
        self.chatDataManager.deleteMessage(with: messageId)
        self.messageCollectionView.reloadData()
//        self.scrollToBottom(with: true)
    }
   @objc open func cleanAllMessages() {
        self.chatDataManager.cleanCache()
        self.messageCollectionView.reloadData()
    }
  
  @objc open func insertMessage(with message: IMUIMessageModel) {
    self.chatDataManager.insertMessage(with: message)
    isInsert = true
    self.messageCollectionView.reloadData()
  }
  
  @objc open func insertMessages(with messages:[IMUIMessageModel]) {

    self.chatDataManager.insertMessages(with: messages)
    self.messageCollectionView.reloadData()
    let scrollIndex = messages.count
//    if scrollIndex>1 {
//        scrollIndex = scrollIndex
//    }
    isInsert = true
    self.scrollTo(index: scrollIndex)

  }
  
  @objc open func updateMessage(with message:IMUIMessageModel) {
    self.chatDataManager.updateMessage(with: message)
    if let index = chatDataManager.index(of: message) {
      let indexPath = IndexPath(item: index, section: 0)
      self.messageCollectionView.reloadItems(at: [indexPath])
    }
  }
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    //通知方法
    @objc func clickStopPlayActivity(notification: Notification){
        DispatchQueue.main.async(execute: {
            self.headView.stopActView()
        })
    }
}

// MARK: - UICollectionViewDelegate, UICollectionViewDataSource
extension IMUIMessageCollectionView: UICollectionViewDelegate, UICollectionViewDataSource,UICollectionViewDelegateFlowLayout {
  
  public func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {

    return self.chatDataManager.count
  }
  
  public func numberOfSections(in collectionView: UICollectionView) -> Int {
    collectionView.collectionViewLayout.invalidateLayout()
    return 1
  }
      
   public  func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: messageCollectionView.imui_width, height: chatDataManager[indexPath.item].layout.cellHeight)
    }
  
  public func collectionView(_ collectionView: UICollectionView,
                      layout collectionViewLayout: UICollectionViewLayout,
                      referenceSizeForFooterInSection section: Int) -> CGSize {
    return CGSize.zero
  }
  
  public func collectionView(_ collectionView: UICollectionView,
                      cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {

    var cellIdentify = ""
    let messageModel = self.chatDataManager[indexPath.item]
    
    switch messageModel.type {
    case .text:
//      cellIdentify = IMUITextMessageCell.self.description()
      cellIdentify = "messageText"
      break
    case .image:
      cellIdentify = IMUIImageMessageCell.self.description()
      break
    case .voice:
      cellIdentify = IMUIVoiceMessageCell.self.description()
      break
    case .video:
      cellIdentify = IMUIVideoMessageCell.self.description()
      break
    case .location:
        cellIdentify = IMUILocationMessageCell.self.description()
        break
    case .notification:
        cellIdentify = IMUINotificationMessageCell.self.description()
        break
    case .redpacket:
        cellIdentify = IMUIRedPacketMessageCell.self.description()
        break
    case .transfer:
        cellIdentify = IMUITransferMessageCell.self.description()
        break
    case .redpacketOpen:
        cellIdentify = IMUIRedPacketOpenMessageCell.self.description()
        break
        
    case .card:
        cellIdentify = IMUICardMessageCell.self.description()
        break

    case .unknown:
        cellIdentify = IMUIUnKnownMessageCell.self.description()
        break
    case .custom:
        cellIdentify = IMUICustomMessageContentCell.self.description()
        break
        
    default:
      break
    }
    
    let cell: IMUIMessageCellProtocal = collectionView.dequeueReusableCell(withReuseIdentifier: cellIdentify, for: indexPath) as! IMUIMessageCellProtocal
    
    cell.presentCell(with: messageModel, viewCache: viewCache, delegate: delegate)
    self.delegate?.messageCollectionView?(collectionView,
                                         willDisplayMessageCell: cell as! UICollectionViewCell,
                                         forItemAt: indexPath,
                                         model: messageModel)
    
    return cell as! UICollectionViewCell
  }
  
  public func collectionView(_ collectionView: UICollectionView,
                      didSelectItemAt indexPath: IndexPath) {
    let messageModel = self.chatDataManager[indexPath.item]
    
    self.delegate?.messageCollectionView?(collectionView, forItemAt: indexPath, model: messageModel)
  }


  public func collectionView(_ collectionView: UICollectionView, didEndDisplaying: UICollectionViewCell, forItemAt: IndexPath) {
    if forItemAt.item < (self.chatDataManager.count - 1) {
        let messageModel = self.chatDataManager[forItemAt.item]
        (didEndDisplaying as! IMUIMessageCellProtocal).didDisAppearCell()
        self.delegate?.messageCollectionView?(collectionView, didEndDisplaying: didEndDisplaying, forItemAt: forItemAt, model: messageModel)
    }
  }
    
    public   func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForHeaderInSection section: Int) -> CGSize {
        return CGSize(width: UIScreen.main.bounds.width, height: 30)
    }

    public func collectionView(_ collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, at indexPath: IndexPath) -> UICollectionReusableView {
        let headCell = collectionView.dequeueReusableSupplementaryView(ofKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: "headView", for: indexPath) as! IMUIBaseMessageHeadCell
        self.headView = headCell
        return headCell
    }
    
}


extension IMUIMessageCollectionView: UIScrollViewDelegate {
  public func scrollViewWillBeginDragging(_ scrollView: UIScrollView) {
    self.delegate?.messageCollectionView?(self.messageCollectionView)
  }
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        DispatchQueue.main.async(execute: {
            self.headView.playActView()
        })
        if scrollView.contentOffset.y < -30 {
            isPull = true
        }else if scrollView.contentOffset.y == 0 && isPull{

            isPull = false
            self.delegate?.messageCollectionView?(reloadMoreData:"")
        }else{
            DispatchQueue.main.async(execute: {
                self.headView.stopActView()
            })
        }
        let tmpH = scrollView.contentSize.height - scrollView.contentOffset.y
        if ((tmpH > 800) && isAutoScroll){
            isAutoScroll = false
            self.delegate?.messageCollectionView?(changeAutoScroll:isAutoScroll)
        }else if ((tmpH < 800) && !isAutoScroll ){
            if isInsert {
                isInsert = false
            }else{
                isAutoScroll = true
                self.delegate?.messageCollectionView?(changeAutoScroll:isAutoScroll)
            }
        }
    }
    
}
