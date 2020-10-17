//
//  BundleMessageListExtension.swift
//  sample
//
//  Created by oshumini on 2017/5/19.
//  Copyright © 2017年 HXHG. All rights reserved.
//

import Foundation

public extension Bundle {
  class func imuiBundle() -> Bundle {
    let tmpUrl = Bundle.main.url(forResource: "NIMKitEmoticon", withExtension:"bundle")!
    return Bundle.init(url: tmpUrl)!
  }
}
