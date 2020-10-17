//
//  IMUIRedPacketOpenMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/11.
//  Copyright © 2017年 HXHG. All rights reserved.
//

//
//  IMUINotificationMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/11.
//  Copyright © 2017年 HXHG. All rights reserved.
//


import UIKit

class IMUIRedPacketOpenMessageCell: IMUIBaseMessageCell {
    let margin:CGFloat = 8.0
    var contView = UIView()
    var titleLable = UILabel()
    var redImg = UIImageView()
    var btnView = UIView()
    let screenW = UIScreen.main.bounds.size.width
    override init(frame: CGRect) {
        super.init(frame: frame)
        titleLable.textColor = UIColor.white
        titleLable.font = UIFont.systemFont(ofSize: (screenW * 14 / 375))
        titleLable.textAlignment = NSTextAlignment.center
        btnView.backgroundColor = UIColor.clear
        redImg.image = UIImage.init(named: "packet_tip")
        contView.backgroundColor = UIColor.init(red: 200/255.0, green: 200/255.0, blue: 200/255.0, alpha: 0.7)
        contView.layer.cornerRadius = 5
        contView.clipsToBounds = true
        contView.addSubview(redImg)
        contView.addSubview(titleLable)
        contView.addSubview(btnView)
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
    
    @objc func clickTapRedView() {
        self.delegate?.messageCollectionView?(didTapMessageBubbleInCell: self, model: self.message!)
    }
    
    override func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache , delegate: IMUIMessageMessageCollectionViewDelegate?) {
        super.presentCell(with: message, viewCache: viewCache, delegate: delegate)
        let layout = message.layout
        let tmpDict = message.customDict
        let strTitle = tmpDict.object(forKey: "tipMsg") as! String
        let attString = NSMutableAttributedString.init(string: strTitle)
        let tmpArr = rangesOf(searchString: "红包", inString: strTitle)

        let redImgW:CGFloat = 14.0
        let redImgH:CGFloat = 18.0
        let redImgX:CGFloat = 6.0
        let redImgY:CGFloat = 3.0
        let contentH:CGFloat = 24.0
        let titleW = widthWithFont(font: UIFont.systemFont(ofSize: (screenW * 14 / 375)), text: strTitle, maxWidth: layout.bubbleFrame.size.width*0.9)
        
        for subView in btnView.subviews{
            subView.removeFromSuperview()
        }
        let strRedW:CGFloat = (titleW - 8) / CGFloat(attString.length)
        for tmpR in tmpArr {
            let tmpRange = tmpR as! NSRange
            if tmpRange.location == 0 {
                continue
            }
            let btnX = strRedW * CGFloat(tmpRange.location) + margin*0.5
            let btnW = strRedW * 2;
            let tmpBtn = UIButton.init(frame: CGRect(origin: CGPoint(x:btnX, y:0), size: CGSize(width:btnW, height:contentH)))
            tmpBtn.addTarget(self, action: #selector(self.clickTapRedView), for: UIControl.Event.touchUpInside)
            tmpBtn.backgroundColor = UIColor.clear
            btnView.addSubview(tmpBtn)
            attString.addAttribute(NSAttributedString.Key.foregroundColor, value: UIColor.init(red: 216/255.0, green: 38/255.0, blue: 23/255.0, alpha: 1), range: tmpRange)
        }
        self.titleLable.attributedText = attString
        let contentX = (layout.bubbleFrame.size.width - titleW - redImgW - redImgX )*0.5
        let contentY = (layout.bubbleFrame.size.height - redImgH - redImgY )*0.4
        redImg.frame = CGRect(origin: CGPoint(x:redImgX, y:redImgY), size: CGSize(width:redImgW, height:redImgH))
        contView.frame = CGRect(origin: CGPoint(x:contentX, y:contentY), size: CGSize(width:titleW+24, height:contentH))
        self.titleLable.frame = CGRect(origin: CGPoint(x:redImgX+redImgW, y:0), size: CGSize(width:titleW, height:contentH))
        self.btnView.frame = self.titleLable.frame
        
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



