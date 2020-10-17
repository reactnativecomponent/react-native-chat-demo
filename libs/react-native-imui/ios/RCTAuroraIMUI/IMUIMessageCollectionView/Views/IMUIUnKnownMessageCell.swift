//
//  IMUIUnKnownMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/9/5.
//  Copyright © 2017年 HXHG. All rights reserved.
//


import UIKit

class IMUIUnKnownMessageCell: IMUIBaseMessageCell {
    var margin:CGFloat = 8.0
    var contView = UIView()
    var titleLable = UILabel()
    var updateBtn = UIButton()
    let screenW = UIScreen.main.bounds.size.width
    override init(frame: CGRect) {
        super.init(frame: frame)
        titleLable.textColor = UIColor.white
        titleLable.font = UIFont.systemFont(ofSize: (screenW * 14 / 375))
        titleLable.textAlignment = NSTextAlignment.center
        updateBtn.backgroundColor = UIColor.clear
        updateBtn.addTarget(self, action: #selector(self.clickTapUpdateBtn), for: UIControl.Event.touchUpInside)
        contView.backgroundColor = UIColor.init(red: 200/255.0, green: 200/255.0, blue: 200/255.0, alpha: 0.7)
        contView.layer.cornerRadius = 5
        contView.clipsToBounds = true
        contView.addSubview(updateBtn)
        contView.addSubview(titleLable)
        bubbleView.addSubview(contView)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func tapBubbleView() {
        
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
    }
    
    @objc func clickTapUpdateBtn() {
        
        let url:URL = URL.init(string: "https://itunes.apple.com/cn/app/%E9%A3%9E%E9%A9%AC%E9%92%B1%E5%8C%85/id1172713122?mt=8")!
        UIApplication.shared.openURL(url)
    }
    
    override func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache , delegate: IMUIMessageMessageCollectionViewDelegate?) {
        super.presentCell(with: message, viewCache: viewCache, delegate: delegate)
        let layout = message.layout
        let strTitle = "收到当前版本不支持的消息，请更新版本查看"
        let attString = NSMutableAttributedString.init(string: strTitle)
        let tmpArr = rangesOf(searchString: "更新版本", inString: strTitle)
        
        let contentH:CGFloat = 24.0
        let titleW = widthWithFont(font: UIFont.systemFont(ofSize: (screenW * 14 / 375)), text: strTitle, maxWidth: layout.bubbleFrame.size.width*0.9)
        let strBlueW:CGFloat = (titleW - self.margin) / CGFloat(attString.length)
        let blueRange = tmpArr[0] as! NSRange
        let btnX = strBlueW * CGFloat(blueRange.location) + margin*0.5
        let btnW = strBlueW * 4;
        self.updateBtn.frame = CGRect(origin: CGPoint(x:btnX, y:0), size: CGSize(width:btnW, height:contentH))
        attString.addAttribute(NSAttributedString.Key.foregroundColor, value: UIColor.init(red: 35/255.0, green: 141/255.0, blue: 250/255.0, alpha: 1), range: blueRange)
    
        self.titleLable.attributedText = attString
        let contentX = (layout.bubbleFrame.size.width - titleW )*0.5
        let contentY = (layout.bubbleFrame.size.height - contentH )*0.4
        contView.frame = CGRect(origin: CGPoint(x:contentX, y:contentY), size: CGSize(width:titleW, height:contentH))
        self.titleLable.frame = CGRect(origin: CGPoint(x:0, y:0), size: CGSize(width:titleW, height:contentH))


    }
    func widthWithFont(font : UIFont,  text : String, maxWidth: CGFloat) -> CGFloat {
        
        guard text.characters.count > 0  else {
            
            return 0
        }
        
        let size = CGSize(width:maxWidth, height:CGFloat(MAXFLOAT))
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: [NSAttributedString.Key.font : font], context:nil)
        
        return rect.size.width + self.margin
    }
    
    func rangesOf(searchString : String, inString : String ) -> NSMutableArray {
        let results : NSMutableArray = NSMutableArray.init()
        let nsInStr = inString as NSString
        var searchRange = NSMakeRange(0, nsInStr.length)
        while nsInStr.range(of: searchString, options: NSString.CompareOptions(rawValue: 0), range: searchRange).location != NSNotFound {
            let tmpRange = nsInStr.range(of: searchString, options: NSString.CompareOptions(rawValue: 0), range: searchRange)
            results.add(tmpRange)
            searchRange = NSMakeRange(NSMaxRange(tmpRange), nsInStr.length - NSMaxRange(tmpRange))
        }
        return results
        
    }
    
}




