//
//  IMUINotificationMessageCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/11.
//  Copyright © 2017年 HXHG. All rights reserved.
//


import UIKit

class IMUINotificationMessageCell: IMUIBaseMessageCell {
    
    var titleLable = UILabel()
    var backView = UIView()
    let screenW = UIScreen.main.bounds.size.width
    let labelGest = UITapGestureRecognizer.init()
    var locationIndex:Int = 0
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        titleLable.textColor = UIColor.white
        titleLable.font = UIFont.systemFont(ofSize: 12)
        titleLable.numberOfLines = 0
        titleLable.isUserInteractionEnabled = true
        backView.backgroundColor = UIColor.init(red: 206/255.0, green: 206/255.0, blue: 206/255.0, alpha: 1)
        backView.layer.cornerRadius = 5
        backView.clipsToBounds = true
        backView.addSubview(titleLable)
        labelGest.addTarget(self, action: #selector(self.clickTapValidation(sender:)))
        bubbleView.addSubview(backView)
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
        let strTitle = tmpDict.object(forKey: "tipMsg") as! String
        let titleSize = sizeWithFont(font: UIFont.systemFont(ofSize: 12), text: strTitle, maxWidth: layout.bubbleFrame.size.width*0.8)
        if titleSize.height < 20{//一行
            titleLable.textAlignment = NSTextAlignment.center
        }else{
            titleLable.textAlignment = NSTextAlignment.left
        }
        
        let titleX = (layout.bubbleFrame.size.width - titleSize.width - 10) * 0.5
        let titleY = (layout.bubbleFrame.size.height - titleSize.height - 10) * 0.5
        self.backView.frame = CGRect(origin: CGPoint(x:titleX, y:titleY), size: CGSize(width:titleSize.width+10, height:titleSize.height+10))
        self.titleLable.frame = CGRect(origin: CGPoint(x:5, y:5), size: CGSize(width:titleSize.width, height:titleSize.height))
        let attString = NSMutableAttributedString.init(string: strTitle)
        if strTitle.hasSuffix("发送朋友验证"){
            self.titleLable.addGestureRecognizer(labelGest)
            let tmpArr = rangesOf(searchString: "发送朋友验证", inString: strTitle)
            let tmpR:NSRange = tmpArr.lastObject as! NSRange
            locationIndex = tmpR.location
            attString.addAttribute(NSAttributedString.Key.foregroundColor, value: UIColor.init(red: 35/255.0, green: 141/255.0, blue: 250/255.0, alpha: 1), range: tmpR)
        }
        self.titleLable.attributedText = attString

    }
    func sizeWithFont(font : UIFont,  text : String, maxWidth: CGFloat) -> CGSize {
        
        guard text.characters.count > 0  else {
            
            return CGSize.zero
        }
        
        let size = CGSize(width:maxWidth, height:CGFloat(MAXFLOAT))
        let rect = text.boundingRect(with: size, options:.usesLineFragmentOrigin, attributes: [NSAttributedString.Key.font : font], context:nil)
        
        return rect.size
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
    
    @objc func clickTapValidation(sender : UITapGestureRecognizer){
        let touchPoint = sender.location(in: self.titleLable)
        let path:CGMutablePath = CGMutablePath()
        path.addRect(CGRect(x:0, y:0, width:self.titleLable.frame.size.width, height:self.titleLable.frame.size.height+10))
        let framesetter = CTFramesetterCreateWithAttributedString(self.titleLable.attributedText!)
        let ctframe = CTFramesetterCreateFrame(framesetter, CFRangeMake(0, 0), path, nil)
        //获取行数
        let lines:NSArray = CTFrameGetLines(ctframe)
        let numOfLine:NSInteger = self.titleLable.numberOfLines > 0 ? min(self.titleLable.numberOfLines, CFArrayGetCount(lines)) : CFArrayGetCount(lines)
        if numOfLine != 0 {
            var lineOrigins:[CGPoint] = Array(repeating:.zero,count:numOfLine)
            CTFrameGetLineOrigins(ctframe, CFRangeMake(0, numOfLine), &lineOrigins)
            for i in 0..<numOfLine{
                var baseLineOri = lineOrigins[i]
                baseLineOri.y = self.titleLable.frame.height - baseLineOri.y
                let line:CTLine = lines[i] as! CTLine
                var ascent:CGFloat = 0.0
                var descent:CGFloat = 0.0
                var leading:CGFloat = 0.0
                let lineWidth:CGFloat = CGFloat(CTLineGetTypographicBounds(line, &ascent, &descent, &leading))
                let lineFrame = CGRect(x:baseLineOri.x, y:baseLineOri.y-ascent, width:lineWidth, height:ascent+descent)
                if lineFrame.contains(touchPoint){
                    let index = CTLineGetStringIndexForPosition(line, touchPoint)
                    if index.hashValue > self.locationIndex {
                        self.delegate?.messageCollectionView?(didTapValidationWithModel: self.message!)
                    }
                
                }
            }
        }
    }
}


