//
//  IMUITextMessageCell.swift
//  IMUIChat
//
//  Created by oshumini on 2017/4/1.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit

open class IMUITextMessageCell: IMUIBaseMessageCell {

  @objc public static var outGoingTextColor = UIColor(netHex: 0x7587A8)
  @objc public static var inComingTextColor = UIColor.white
public static let screenW = UIScreen.main.bounds.size.width
  
  @objc  public static var outGoingTextFont = screenW<375 ? UIFont.systemFont(ofSize:15) : UIFont.systemFont(ofSize: (screenW * 16 / 375))
  @objc public static var inComingTextFont = screenW<375 ? UIFont.systemFont(ofSize:15) : UIFont.systemFont(ofSize: (screenW * 16 / 375))

    var textMessageLable = YYLabel()

  
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.bubbleView.addSubview(textMessageLable)
    textMessageLable.numberOfLines = 0
    textMessageLable.lineBreakMode = NSLineBreakMode.byWordWrapping
    textMessageLable.backgroundColor = UIColor.clear
    textMessageLable.font = IMUITextMessageCell.inComingTextFont
    textMessageLable.isUserInteractionEnabled = true
  }
  
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
    
  override open func layoutSubviews() {
    super.layoutSubviews()
  }
  
  override func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache, delegate: IMUIMessageMessageCollectionViewDelegate?) {
    super.presentCell(with: message, viewCache: viewCache, delegate: delegate)

    let layout = message.layout
    self.layoutToText(with: message.text(), isOutGoing: message.isOutGoing)
    if (layout.bubbleFrame.size.height/21) > 1 {
        self.textMessageLable.textAlignment = NSTextAlignment.left
    }else{
        self.textMessageLable.textAlignment = NSTextAlignment.center
    }
    let textSize = self.textMessageLable.getTheLabel(CGSize(width: IMUIMessageCellLayout.bubbleMaxWidth, height: CGFloat(MAXFLOAT)))
    let textX = layout.bubbleContentInset.left
    let textY = (layout.bubbleFrame.height - textSize.height)*0.5
    self.textMessageLable.frame = CGRect(origin: CGPoint(x:textX, y:textY), size: textSize)
  }

    
  func layoutToText(with text: String, isOutGoing: Bool) {

    
    if isOutGoing {
        self.textMessageLable.setupYYText(text, andUnunderlineColor: UIColor.init(red: 187/255.0, green: 220/255.0, blue: 255/255.0, alpha: 1))
        textMessageLable.textColor = UIColor.white
        
    } else {
        self.textMessageLable.setupYYText(text, andUnunderlineColor: UIColor.init(red: 51/255, green: 51/255, blue: 51/255, alpha: 1))
        textMessageLable.textColor = UIColor.init(red: 51/255, green: 51/255, blue: 51/255, alpha: 1)
      
    }
    weak var weakSelf = self
    self.textMessageLable.urLBlock = {(strUrl:String)->() in
        weakSelf?.clickOpenLink(strUrl: strUrl)
    }
    self.textMessageLable.numBlock = {(strNum:String)->() in
        print("numBlock:-----------\(strNum)")
        let strNUm = URL.init(string: ("telprompt://"+strNum))
        if #available(iOS 10.0, *) {
            UIApplication.shared.open(strNUm!, options: [:], completionHandler: nil)
        } else {
            UIApplication.shared.openURL(strNUm!)
        }
        
        
    }
    
    
  }
    
    func clickOpenLink(strUrl: String){
        self.delegate?.messageCollectionView?(openMessageBubbleUrl:strUrl )
    }
    

}
