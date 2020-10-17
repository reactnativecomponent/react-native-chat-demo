//
//  IMUILocationMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/10.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit

class IMUILocationMessageCell: IMUIBaseMessageCell {
    
    var imageView = UIImageView()
    var titleLable = UILabel()
    var subContentView = UIView()
    let screenW = UIScreen.main.bounds.size.width
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        subContentView.backgroundColor = UIColor.white
        imageView.image = UIImage.init(named: "location")
        imageView.contentMode = UIView.ContentMode.scaleToFill
        titleLable.textColor = UIColor.black
        titleLable.font = UIFont.systemFont(ofSize: (screenW * 13 / 375))
        titleLable.numberOfLines = 0
        subContentView.addSubview(imageView)
        subContentView.addSubview(titleLable)
        bubbleView.addSubview(subContentView)
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
        let titleX = message.isOutGoing ? 0.0:15.0
        let tmpDict = message.customDict
        let strTitle = tmpDict.object(forKey: "title") as! String
        let tmpSize = heightWithFont(font: UIFont.systemFont(ofSize: (screenW * 13 / 375)), fixedWidth: (layout.bubbleFrame.size.width-15), text: strTitle)
        self.titleLable.frame = CGRect(origin: CGPoint(x: titleX, y: 10.0), size: CGSize(width: tmpSize.width, height: tmpSize.height))
        self.titleLable.text = strTitle
        self.imageView.frame = CGRect(origin: CGPoint(x: 0, y: tmpSize.height + 15.0), size: CGSize(width: layout.bubbleFrame.size.width, height: layout.bubbleFrame.size.width*0.5))
        self.subContentView.frame = CGRect(origin: CGPoint.zero, size:layout.bubbleFrame.size)
        
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

