//
//  VideoProcessingProtocol.swift
//  VideoTrim
//
//  Created by Duc Trung Mai on 9/11/25.
//

@objc public protocol VideoProcessingProtocol {
  func emitEventToJS(eventName: String, body: [String: Any]?)
}
