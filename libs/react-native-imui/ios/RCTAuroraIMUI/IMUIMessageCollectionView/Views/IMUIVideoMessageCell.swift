//
//  IMUIVideoMessageCell.swift
//  IMUIChat
//
//  Created by oshumini on 2017/4/13.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import UIKit
import AVFoundation

class IMUIVideoMessageCell: IMUIBaseMessageCell {

  lazy var videoView = MyCacheImageView()
  lazy var playBtn = UIButton()
  lazy var videoDuration = UILabel()
  
    lazy var circleLayer:CAShapeLayer = {
        () -> CAShapeLayer in
        let tmpLayer = CAShapeLayer()
        let bezierPath:UIBezierPath = UIBezierPath.init(arcCenter: CGPoint.init(x: 28.0, y: 28.0), radius: 23.0, startAngle: CGFloat(-Double.pi / 2), endAngle: CGFloat(Double.pi / 2*3.0), clockwise: true)
        tmpLayer.path = bezierPath.cgPath
        tmpLayer.strokeColor = UIColor.white.cgColor
        tmpLayer.fillColor = UIColor.clear.cgColor
        tmpLayer.lineWidth = 1.5
        tmpLayer.strokeEnd = 0.9
        tmpLayer.lineCap = CAShapeLayerLineCap.round
        tmpLayer.bounds = CGRect.init(x: 0, y: 0, width: 56.0, height: 56.0)
        tmpLayer.anchorPoint = CGPoint.init(x: 0.5, y: 0.5)
        return tmpLayer
    }()
    
    
  override init(frame: CGRect) {
    super.init(frame: frame)
    bubbleView.addSubview(self.videoView)
    videoView.addSubview(playBtn)
    videoView.addSubview(videoDuration)
    videoView.layer.addSublayer(circleLayer)
    
    playBtn.frame = CGRect(origin: CGPoint.zero, size: CGSize(width: 56, height: 56))
    playBtn.setImage(UIImage.imuiImage(with: "video_play_btn"), for: .normal)
    playBtn.isHidden = true
    videoDuration.textColor = UIColor.white
    videoDuration.font = UIFont.systemFont(ofSize: 10.0)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    playBtn.center = CGPoint(x: videoView.imui_width/2, y: videoView.imui_height/2)
    circleLayer.position = CGPoint(x: videoView.imui_width/2, y: videoView.imui_height/2)
    let durationX = self.bubbleView.imui_width - 30
    let durationY = self.bubbleView.imui_height - 24
    videoDuration.frame = CGRect(x: durationX, y: durationY, width: 30, height: 24)
  }
  
  override func presentCell(with message: IMUIMessageModelProtocol, viewCache: IMUIReuseViewCache , delegate: IMUIMessageMessageCollectionViewDelegate?) {
    super.presentCell(with: message, viewCache: viewCache, delegate: delegate)
    let tmpDict = message.customDict
    let strCoverUrl = tmpDict.object(forKey: "coverUrl") as! String
    self.videoView.setImageURL(strCoverUrl)

    let layout = message.layout
    let inset = layout.bubbleContentInset
    self.videoView.frame = CGRect(origin: CGPoint.zero, size: layout.bubbleFrame.size).inset(by: UIEdgeInsets.init(top: inset.top, left: inset.left, bottom: inset.bottom, right: inset.right))
    self.circleLayer.removeAllAnimations()
    if message.mediaFilePath() == "" {
        self.playBtn.isHidden = true
        self.circleLayer.isHidden = false
        let rotateAnimation = CABasicAnimation.init(keyPath: "transform.rotation.z")
        rotateAnimation.toValue = NSNumber.init(value: Double.pi*2)
        rotateAnimation.duration = 0.6
        rotateAnimation.isCumulative = true
        rotateAnimation.repeatCount = 1000000
        circleLayer.add(rotateAnimation, forKey:"rotate")
    }else{
        self.layoutVideo(with: message.mediaFilePath())
        self.playBtn.isHidden = false
        self.circleLayer.isHidden = true
    }
  }
  
  func layoutVideo(with videoPath: String) {
    let asset = AVURLAsset(url: URL(fileURLWithPath: videoPath), options: nil)
    let seconds = Int (CMTimeGetSeconds(asset.duration))
    
    if seconds/3600 > 0 {
       videoDuration.text = "\(seconds/3600):\(String(format: "%02d", (seconds/3600)%60)):\(seconds%60)"
    } else {
       videoDuration.text = "\(seconds / 60):\(String(format: "%02d", seconds % 60))"
    }
    
    
    
//    let serialQueue = DispatchQueue(label: "videoLoad")
//    serialQueue.async {
//      do {
//        let imgGenerator = AVAssetImageGenerator(asset: asset)
//        imgGenerator.appliesPreferredTrackTransform = true
//        let cgImage = try imgGenerator.copyCGImage(at: CMTimeMake(0, 1), actualTime: nil)
//        DispatchQueue.main.async {
//          self.videoView.image = UIImage(cgImage: cgImage)
//        }
//
//      } catch {
//        DispatchQueue.main.async {
//          self.videoView.image = nil
//        }
//      }
//    }
  }
}
