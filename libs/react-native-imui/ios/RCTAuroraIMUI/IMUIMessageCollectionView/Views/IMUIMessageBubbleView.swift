//
//  IMUIMessageBubbleView.swift
//  IMUIChat
//
//  Created by oshumini on 2017/3/2.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit

enum IMUIMessageBubbleType {
  case text
  case image
  case video
  case voice
  case location
  case redpacket
  case transfer
  case url
  case account_notice
  case redpacketOpen
    case card
    
}

open class IMUIMessageBubbleView: UIImageView {

  var bubbleImageView: UIImageView
  
  override init(frame: CGRect) {
    bubbleImageView = UIImageView()
    super.init(frame: frame)
    
    self.addSubview(bubbleImageView)
  }
  
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override open func layoutSubviews() {
    super.layoutSubviews()
    self.bubbleImageView.frame = self.bounds
  }
  
   func setupBubbleImage(resizeBubbleImage: UIImage) {
    bubbleImageView.image = resizeBubbleImage
    self.layer.mask = bubbleImageView.layer
    self.image = resizeBubbleImage
  }
  
  
}
