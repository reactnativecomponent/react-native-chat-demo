//
//  IMUIRedPacketMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/10.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit

class IMUIRedPacketMessageCell: IMUIBaseMessageCell {
    
    var backgroundImg = UIImageView()
    var contentLable = UILabel()
    var tipsLabel = UILabel()
    var titleLable = UILabel()
    let screenW = UIScreen.main.bounds.size.width
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundImg.image = UIImage.init(named: "redPacket")
        backgroundImg.contentMode = UIView.ContentMode.scaleAspectFill
        contentLable.textColor = UIColor.white
        contentLable.font = UIFont.systemFont(ofSize: (screenW * 15 / 375))
        tipsLabel.textColor = UIColor.white
        tipsLabel.font = UIFont.systemFont(ofSize: (screenW * 13 / 375))
        tipsLabel.text = "领取红包"
        titleLable.textColor = UIColor.gray
        titleLable.font = UIFont.systemFont(ofSize: (screenW * 13 / 375))
        titleLable.text = "红包"
        titleLable.textAlignment = NSTextAlignment.center
        
        bubbleView.addSubview(backgroundImg)
        bubbleView.addSubview(contentLable)
        bubbleView.addSubview(tipsLabel)
        bubbleView.addSubview(titleLable)
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
        
        let tmpDict = message.customDict
        let strTitle = tmpDict.object(forKey: "comments") as! String
        contentLable.text = strTitle
        
        self.backgroundImg.frame = CGRect(origin: CGPoint.zero, size: layout.bubbleFrame.size)
        let contentX = layout.bubbleFrame.size.width * 0.26
        let contentW = layout.bubbleFrame.size.width * 0.7
        let contentH = layout.bubbleFrame.size.height * 0.74
        let titleLableH = layout.bubbleFrame.size.height * 0.26
        let tmpSize = self.heightWithFont(font: UIFont.systemFont(ofSize: (screenW * 16 / 375)), fixedWidth: contentW, text: "恭喜发财")
        let tipsSize = self.heightWithFont(font: UIFont.systemFont(ofSize: (screenW * 13 / 375)), fixedWidth: contentW, text: "领取红包")
        let contentY = (contentH - tmpSize.height - tipsSize.height - 3)*0.5
        contentLable.frame = CGRect(origin: CGPoint(x: contentX, y: contentY), size: CGSize(width: contentW, height: tmpSize.height))
        let tipsY = contentY + tmpSize.height + 3
        tipsLabel.frame = CGRect(origin: CGPoint(x: contentX, y: tipsY), size: CGSize(width: contentW, height: tipsSize.height))
        let titleX = layout.bubbleFrame.size.width * 0.067
        let titleW = layout.bubbleFrame.size.width * 0.143
        self.titleLable.frame = CGRect(origin: CGPoint(x: CGFloat(titleX), y: contentH), size: CGSize(width: titleW, height: titleLableH))
    }
    
    func heightWithFont(font : UIFont, fixedWidth : CGFloat, text : String) -> CGSize {
        
        guard text.characters.count > 0 && fixedWidth > 0 else {
            
            return CGSize.zero
        }
        
        let size = CGSize(width:fixedWidth, height:CGFloat(MAXFLOAT))
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: [NSAttributedString.Key.font : font], context:nil)
        
        return rect.size
    }
    
}

