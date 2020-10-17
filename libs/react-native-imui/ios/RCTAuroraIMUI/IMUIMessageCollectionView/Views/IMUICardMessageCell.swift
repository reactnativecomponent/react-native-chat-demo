//
//  IMUICardMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/10/23.
//  Copyright © 2017年 HXHG. All rights reserved.
//


import UIKit

class IMUICardMessageCell: IMUIBaseMessageCell {
    
    var backView = UIView()
    var iconImg = MyCacheImageView()
    var nameLable = UILabel()
    var lineView = UIView()
    var titleLable = UILabel()
    let screenW = UIScreen.main.bounds.size.width
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        backView.backgroundColor = UIColor.white
        iconImg.contentMode = UIView.ContentMode.scaleAspectFill
        nameLable.textColor = UIColor.black
        nameLable.font = UIFont.systemFont(ofSize: (screenW * 18 / 375))
        lineView.backgroundColor = UIColor.init(red: 230/255.0, green: 230/255.0, blue: 230/255.0, alpha: 1.0)
        titleLable.textColor = UIColor.gray
        titleLable.font = UIFont.systemFont(ofSize: (screenW * 11 / 375))
        
        bubbleView.addSubview(backView)
        backView.addSubview(iconImg)
        backView.addSubview(nameLable)
        backView.addSubview(lineView)
        backView.addSubview(titleLable)
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
        
        self.backView.frame = CGRect(origin: CGPoint.zero, size: layout.bubbleFrame.size)
        let tmpDict = message.customDict
        let strTitle = tmpDict.object(forKey: "type") as! String
        let name = tmpDict.object(forKey: "name") as! String
        let imgPath = tmpDict.object(forKey: "imgPath") as! String
        titleLable.text = strTitle
        nameLable.text = name
        iconImg.setImageURL(imgPath, placeholderImage: "defaultHead")

        let lineY = layout.bubbleFrame.size.height * 0.78
        let contentX = layout.bubbleFrame.size.width * 0.06
        let contentWH = layout.bubbleFrame.size.width * 0.2
        let contentY = (lineY - contentWH)*0.5
        iconImg.frame = CGRect(x:contentX,y:contentY,width:contentWH,height:contentWH)
        let nameX = contentX*2 + contentWH
        let nameW =  layout.bubbleFrame.size.width - nameX
        nameLable.frame = CGRect(x:nameX,y:contentY,width:nameW,height:contentWH)
        
        lineView.frame = CGRect(x:0,y:lineY,width:layout.bubbleFrame.size.width,height:1)

        let tmpSize = self.heightWithFont(font: UIFont.systemFont(ofSize: (screenW * 11 / 375)), fixedWidth: layout.bubbleFrame.size.width, text: strTitle)
        let titleX = contentX + (contentWH - tmpSize.width)*0.5
        let titleH = layout.bubbleFrame.size.height - lineY
        titleLable.frame = CGRect(x:titleX,y:lineY,width:tmpSize.width,height:titleH)
    
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


