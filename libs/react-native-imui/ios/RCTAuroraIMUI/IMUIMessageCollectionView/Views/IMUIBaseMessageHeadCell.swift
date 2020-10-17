//
//  IMUIBaseMessageHeadCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2017/8/26.
//  Copyright © 2017年 HXHG. All rights reserved.
//

//

import UIKit

open class IMUIBaseMessageHeadCell: UICollectionViewCell {
    var actView: UIActivityIndicatorView!

    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = UIColor.clear
        actView = UIActivityIndicatorView.init(style: UIActivityIndicatorView.Style.gray)
        actView.hidesWhenStopped = true
        self.addSubview(self.actView)
        self.setupSubViews()
    }
    
    public  func playActView(){
        self.actView.startAnimating()
    }
    
    public  func stopActView(){
        self.actView.stopAnimating()
    }
    
    fileprivate func setupSubViews() {
        self.actView.center = CGPoint(x:UIScreen.main.bounds.size.width*0.5,y:5)
        

    }
    
    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
}
