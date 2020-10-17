//
//  IMUIImageMessageCell.swift
//  IMUIChat
//
//  Created by oshumini on 2017/4/1.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit

class IMUIImageMessageCell: IMUIBaseMessageCell {

  var imageView = MyCacheImageView()
    var myMessage: IMUIMessageModelProtocol?
  override init(frame: CGRect) {
    super.init(frame: frame)
    imageView.contentMode = UIView.ContentMode.scaleAspectFill
    bubbleView.addSubview(imageView)
    NotificationCenter.default.addObserver(self, selector: #selector(clickDidCompletePic(notification:)), name: NSNotification.Name(rawValue: "RNNeteaseimDidCompletePic"), object: nil)
  }
  
   @objc func clickDidCompletePic(notification:Notification){
        let tmpImage = UIImage(contentsOfFile: (self.myMessage?.mediaFilePath())!)
        if tmpImage != nil{
            self.layoutImage(image: tmpImage!)
        }
    }
    
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
  }

  override func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache , delegate: IMUIMessageMessageCollectionViewDelegate?) {
    super.presentCell(with: message, viewCache: viewCache, delegate: delegate)
    
    let layout = message.layout
    let inset = layout.bubbleContentInset
    self.myMessage = message
    self.imageView.frame = CGRect(origin: CGPoint.zero, size: layout.bubbleFrame.size).inset(by: UIEdgeInsets.init(top: inset.top, left: inset.left, bottom: inset.bottom, right: inset.right))
//    self.imageView.frame = UIEdgeInsetsInsetRect(CGRect(origin: CGPoint.zero, size: layout.bubbleFrame.size), layout.bubbleContentInset)
    let image = UIImage(contentsOfFile: message.mediaFilePath())
    if image != nil {
        self.layoutImage(image: image!)
    }else{
        let strUrl = message.customDict.object(forKey: "url") as! String
        self.imageView.setImageURL(strUrl)
    }
  }
  
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
  func layoutImage(image: UIImage) {
    self.imageView.image = image
  }
}

