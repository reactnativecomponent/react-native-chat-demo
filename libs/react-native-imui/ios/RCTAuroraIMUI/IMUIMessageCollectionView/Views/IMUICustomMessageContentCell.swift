//
//  IMUICustomMessageContentCell.swift
//  RCTAuroraIMUI
//
//  Created by Dowin on 2018/4/20.
//  Copyright © 2018年 HXHG. All rights reserved.
//

import UIKit
import WebKit

class IMUICustomMessageContentCell: IMUIBaseMessageCell {
    
    var customView : WKWebView?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        let jsStr = "var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width'); document.getElementsByTagName('head')[0].appendChild(meta);"
        let script = WKUserScript(source: jsStr, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        let contentController = WKUserContentController()
        contentController.addUserScript(script)
        
        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        self.customView = WKWebView(frame: CGRect.zero, configuration: config)
        self.bubbleView.addSubview(self.customView!)
        self.customView?.isUserInteractionEnabled = false
    }
    
    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache , delegate: IMUIMessageMessageCollectionViewDelegate?) {
        super.presentCell(with: message, viewCache: viewCache, delegate: delegate)
        customView!.frame = bubbleView.bounds
        let tmpDict = message.customDict
        let strContent = tmpDict.object(forKey: "content") as! String
        print("dongci:\(strContent)")
        customView!.loadHTMLString(strContent, baseURL: Bundle.main.bundleURL)
    }
}

