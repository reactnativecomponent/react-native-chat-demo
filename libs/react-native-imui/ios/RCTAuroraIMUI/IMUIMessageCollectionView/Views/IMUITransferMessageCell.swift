//
//  IMUITransferMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/11.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit

class IMUITransferMessageCell: IMUIBaseMessageCell {
    
    var backgroundImg = UIImageView()
    var contentLable = UILabel()
    var amountLabel = UILabel()
    var titleLable = UILabel()
    let screenW = UIScreen.main.bounds.size.width
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundImg.image = UIImage.init(named: "transfer")
        backgroundImg.contentMode = UIView.ContentMode.scaleToFill
        contentLable.textColor = UIColor.white
        contentLable.font = UIFont.systemFont(ofSize: (screenW * 16 / 375))
        amountLabel.textColor = UIColor.white
        amountLabel.font = UIFont.systemFont(ofSize: (screenW * 13 / 375))
        titleLable.textColor = UIColor.gray
        titleLable.font = UIFont.systemFont(ofSize: (screenW * 13 / 375))
        titleLable.text = "转账"
        
        bubbleView.addSubview(backgroundImg)
        bubbleView.addSubview(contentLable)
        bubbleView.addSubview(amountLabel)
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
        let strContent = tmpDict.object(forKey: "comments") as! String
        if strContent.count > 0 {
            contentLable.text = strContent
        }else{
            contentLable.text = "飞马转账"
        }
        let strAmount = tmpDict.object(forKey: "amount") as! String
        let strTmpAmount = String(format: "%0.2f",Float(strAmount)!)
        amountLabel.text = strTmpAmount + " 元"
        let inset = layout.bubbleContentInset
        self.backgroundImg.frame = CGRect(origin: CGPoint.zero, size: layout.bubbleFrame.size).inset(by: UIEdgeInsets.init(top: inset.top, left: inset.left, bottom: inset.bottom, right: inset.right))

        let contentX = layout.bubbleFrame.size.width * 0.26
        let contentW = layout.bubbleFrame.size.width * 0.7
        
        let contentH = layout.bubbleFrame.size.height * 0.74
        let titleLableH = layout.bubbleFrame.size.height * 0.26
        let tmpSize = self.heightWithFont(font: UIFont.systemFont(ofSize: 16), fixedWidth: contentW, text: "飞马转账")
        let amountSize = self.heightWithFont(font: UIFont.systemFont(ofSize: (screenW * 13 / 375)), fixedWidth: contentW, text: "转账")
        let contentY = (contentH - tmpSize.height - amountSize.height )*0.5
        contentLable.frame = CGRect(origin: CGPoint(x: contentX, y: contentY), size: CGSize(width: contentW, height: tmpSize.height))
        let tipsY = contentY + tmpSize.height
        amountLabel.frame = CGRect(origin: CGPoint(x: contentX, y: tipsY), size: CGSize(width: contentW, height: tmpSize.height))
        let titleX = layout.bubbleFrame.size.width * 0.067
        let titleW = layout.bubbleFrame.size.width * 0.143
        self.titleLable.frame = CGRect(origin: CGPoint(x: CGFloat(titleX), y: contentH), size: CGSize(width: titleW, height: titleLableH))
        
    }
    
    func heightWithFont(font : UIFont, fixedWidth : CGFloat, text : String) -> CGSize {
        guard text.count > 0 && fixedWidth > 0 else {
            
            return CGSize.zero
        }
        
        let size = CGSize(width:fixedWidth, height:CGFloat(MAXFLOAT))
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: [NSAttributedString.Key.font : font], context:nil)
        
        return rect.size
    }
    
}


