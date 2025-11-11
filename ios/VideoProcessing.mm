// because Swift class inherits from RCTEventEmitter, hence we need to import it here for both new and old arch
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import <VideoProcessingSpec/VideoProcessingSpec.h>

#if __has_include(<VideoProcessing/VideoProcessing-Swift.h>)
// if use_frameworks! :static
#import <VideoProcessing/VideoProcessing-Swift.h>
#else
#import "VideoProcessing-Swift.h"
#endif

@interface VideoProcessing : NativeVideoProcessingSpecBase <NativeVideoProcessingSpec, VideoProcessingProtocol>
@end

@implementation VideoProcessing {
  VideoProcessingSwift  * _Nullable VideoProcessing;
}

RCT_EXPORT_MODULE()

- (instancetype)init {
  if (self = [super init]) {
  }
  return self;
}

// MARK: swift static methods
- (void)cleanFiles:(nonnull RCTPromiseResolveBlock)resolve
            reject:(nonnull RCTPromiseRejectBlock)reject {
  NSInteger successCount = [VideoProcessingSwift cleanFiles];
  resolve(@(successCount));
}

- (void)deleteFile:(nonnull NSString *)filePath
           resolve:(nonnull RCTPromiseResolveBlock)resolve
            reject:(nonnull RCTPromiseRejectBlock)reject {
  resolve(@([VideoProcessingSwift deleteFile:filePath]));
}

- (void)isValidFile:(nonnull NSString *)url
            resolve:(nonnull RCTPromiseResolveBlock)resolve
             reject:(nonnull RCTPromiseRejectBlock)reject {
  [VideoProcessingSwift isValidFile:url url:^(NSDictionary<NSString *,id> * _Nonnull result) {
    resolve(result);
  }];
}

- (void)listFiles:(nonnull RCTPromiseResolveBlock)resolve
           reject:(nonnull RCTPromiseRejectBlock)reject {
  
  resolve([VideoProcessingSwift listFiles]);
}

- (void)trim:(nonnull NSString *)url
     options:(JS::NativeVideoProcessing::TrimOptions &)options
     resolve:(nonnull RCTPromiseResolveBlock)resolve
      reject:(nonnull RCTPromiseRejectBlock)reject {
  if (!self->VideoProcessing) {
    self->VideoProcessing = [[VideoProcessingSwift alloc] init];
    self->VideoProcessing.isNewArch = true;
  }
  
  NSMutableDictionary *dict = [NSMutableDictionary dictionary];
  
  dict[@"saveToPhoto"] = @(options.saveToPhoto());
  dict[@"type"] = options.type();
  dict[@"outputExt"] = options.outputExt();
  dict[@"removeAfterSavedToPhoto"] = @(options.removeAfterSavedToPhoto());
  dict[@"removeAfterFailedToSavePhoto"] = @(options.removeAfterFailedToSavePhoto());
  dict[@"enableRotation"] = @(options.enableRotation());
  dict[@"rotationAngle"] = @(options.rotationAngle());
  dict[@"startTime"] = @(options.startTime());
  dict[@"endTime"] = @(options.endTime());
  
  [self->VideoProcessing trim:url url:dict config:^(NSDictionary<NSString *,id> * _Nonnull result) {
    BOOL success = [result[@"success"] boolValue];
    if (success) {
      resolve(result);
    } else {
      NSString *message = result[@"message"];
      NSError *error = [NSError errorWithDomain:@"" code:200 userInfo:nil];
      reject(@"ERR_TRIM_FAILED", message, error);
    }
  }];
}

- (void)compress:(JS::NativeVideoProcessing::CompressionOptions &)options
         resolve:(nonnull RCTPromiseResolveBlock)resolve
          reject:(nonnull RCTPromiseRejectBlock)reject {
  if (!self->VideoProcessing) {
    self->VideoProcessing = [[VideoProcessingSwift alloc] init];
    self->VideoProcessing.isNewArch = true;
  }
  
  NSMutableDictionary *dict = [NSMutableDictionary dictionary];
  
  dict[@"inputPath"] = options.inputPath();
  
  // Resolution
  auto resolutionOpt = options.resolution();
  if (resolutionOpt.has_value()) {
    auto resolution = resolutionOpt.value();
    NSMutableDictionary *resDict = [NSMutableDictionary dictionary];
    
    auto widthOpt = resolution.width();
    if (widthOpt.has_value()) {
      resDict[@"width"] = @(widthOpt.value());
    }
    
    auto heightOpt = resolution.height();
    if (heightOpt.has_value()) {
      resDict[@"height"] = @(heightOpt.value());
    }
    
    dict[@"resolution"] = resDict;
  }
  
  // Bitrate
  auto bitrateOpt = options.bitrate();
  if (bitrateOpt.has_value()) {
    dict[@"bitrate"] = bitrateOpt.value();
  }
  
  // CRF
  auto crfOpt = options.crf();
  if (crfOpt.has_value()) {
    dict[@"crf"] = @(crfOpt.value());
  }
  
  // Preset
  auto presetOpt = options.preset();
  if (presetOpt.has_value()) {
    dict[@"preset"] = presetOpt.value();
  }
  
  // FPS
  auto fpsOpt = options.fps();
  if (fpsOpt.has_value()) {
    dict[@"fps"] = @(fpsOpt.value());
  }
  
  // Audio bitrate
  auto audioBitrateOpt = options.audioBitrate();
  if (audioBitrateOpt.has_value()) {
    dict[@"audioBitrate"] = audioBitrateOpt.value();
  }
  
  // Output extension
  auto outputExtOpt = options.outputExt();
  if (outputExtOpt.has_value()) {
    dict[@"outputExt"] = outputExtOpt.value();
  }
  
  // Save to photo
  auto saveToPhotoOpt = options.saveToPhoto();
  if (saveToPhotoOpt.has_value()) {
    dict[@"saveToPhoto"] = @(saveToPhotoOpt.value());
  }
  
  // Remove after saved to photo
  auto removeAfterSavedOpt = options.removeAfterSavedToPhoto();
  if (removeAfterSavedOpt.has_value()) {
    dict[@"removeAfterSavedToPhoto"] = @(removeAfterSavedOpt.value());
  }
  
  // Remove after failed to save photo
  auto removeAfterFailedOpt = options.removeAfterFailedToSavePhoto();
  if (removeAfterFailedOpt.has_value()) {
    dict[@"removeAfterFailedToSavePhoto"] = @(removeAfterFailedOpt.value());
  }
  
  [self->VideoProcessing compress:dict config:^(NSDictionary<NSString *,id> * _Nonnull result) {
    BOOL success = [result[@"success"] boolValue];
    if (success == NO) {
      NSString *message = result[@"message"];
      NSError *error = [NSError errorWithDomain:@"" code: 200 userInfo:nil];
      reject(@"ERR_COMPRESS_FAILED", message, error);
    } else {
      resolve(result);
    }
  }];
}

// MARK: swift instance methods
- (void)showEditor:(nonnull NSString *)filePath
            config:(JS::NativeVideoProcessing::EditorConfig &)config {
  if (!self->VideoProcessing) {
    self->VideoProcessing = [[VideoProcessingSwift alloc] init];
    self->VideoProcessing.delegate = self;
    self->VideoProcessing.isNewArch = true;
  }
  
  NSMutableDictionary *dict = [NSMutableDictionary dictionary];
  
  dict[@"saveToPhoto"] = @(config.saveToPhoto());
  dict[@"type"] = config.type();
  dict[@"outputExt"] = config.outputExt();
  dict[@"openDocumentsOnFinish"] = @(config.openDocumentsOnFinish());
  dict[@"openShareSheetOnFinish"] = @(config.openShareSheetOnFinish());
  dict[@"removeAfterSavedToPhoto"] = @(config.removeAfterSavedToPhoto());
  dict[@"removeAfterFailedToSavePhoto"] = @(config.removeAfterFailedToSavePhoto());
  dict[@"removeAfterSavedToDocuments"] = @(config.removeAfterSavedToDocuments());
  dict[@"removeAfterFailedToSaveDocuments"] = @(config.removeAfterFailedToSaveDocuments());
  dict[@"removeAfterShared"] = @(config.removeAfterShared());
  dict[@"removeAfterFailedToShare"] = @(config.removeAfterFailedToShare());
  dict[@"enableRotation"] = @(config.enableRotation());
  dict[@"rotationAngle"] = @(config.rotationAngle());
  dict[@"enableHapticFeedback"] = @(config.enableHapticFeedback());
  dict[@"maxDuration"] = @(config.maxDuration());
  dict[@"minDuration"] = @(config.minDuration());
  dict[@"cancelButtonText"] = config.cancelButtonText();
  dict[@"saveButtonText"] = config.saveButtonText();
  dict[@"enableCancelDialog"] = @(config.enableCancelDialog());
  dict[@"cancelDialogTitle"] = config.cancelDialogTitle();
  dict[@"cancelDialogMessage"] = config.cancelDialogMessage();
  dict[@"cancelDialogCancelText"] = config.cancelDialogCancelText();
  dict[@"cancelDialogConfirmText"] = config.cancelDialogConfirmText();
  dict[@"enableSaveDialog"] = @(config.enableSaveDialog());
  dict[@"saveDialogTitle"] = config.saveDialogTitle();
  dict[@"saveDialogMessage"] = config.saveDialogMessage();
  dict[@"saveDialogCancelText"] = config.saveDialogCancelText();
  dict[@"saveDialogConfirmText"] = config.saveDialogConfirmText();
  dict[@"trimmingText"] = config.trimmingText();
  dict[@"fullScreenModalIOS"] = @(config.fullScreenModalIOS());
  dict[@"autoplay"] = @(config.autoplay());
  dict[@"jumpToPositionOnLoad"] = @(config.jumpToPositionOnLoad());
  dict[@"closeWhenFinish"] = @(config.closeWhenFinish());
  dict[@"enableCancelTrimming"] = @(config.enableCancelTrimming());
  dict[@"cancelTrimmingButtonText"] = config.cancelTrimmingButtonText();
  dict[@"enableCancelTrimmingDialog"] = @(config.enableCancelTrimmingDialog());
  dict[@"cancelTrimmingDialogTitle"] = config.cancelTrimmingDialogTitle();
  dict[@"cancelTrimmingDialogMessage"] = config.cancelTrimmingDialogMessage();
  dict[@"cancelTrimmingDialogCancelText"] = config.cancelTrimmingDialogCancelText();
  dict[@"cancelTrimmingDialogConfirmText"] = config.cancelTrimmingDialogConfirmText();
  dict[@"headerText"] = config.headerText();
  dict[@"headerTextSize"] = @(config.headerTextSize());
  dict[@"headerTextColor"] = @(config.headerTextColor());
  dict[@"alertOnFailToLoad"] = @(config.alertOnFailToLoad());
  dict[@"alertOnFailTitle"] = config.alertOnFailTitle();
  dict[@"alertOnFailMessage"] = config.alertOnFailMessage();
  dict[@"alertOnFailCloseText"] = config.alertOnFailCloseText();
  
  // Handle optional color values
  auto trimmerColorOpt = config.trimmerColor();
  if (trimmerColorOpt.has_value()) {
    dict[@"trimmerColor"] = @(trimmerColorOpt.value());
  }
  
  auto handleIconColorOpt = config.handleIconColor();
  if (handleIconColorOpt.has_value()) {
    dict[@"handleIconColor"] = @(handleIconColorOpt.value());
  }
  
  auto zoomOnWaitingDurationOpt = config.zoomOnWaitingDuration();
  if (zoomOnWaitingDurationOpt.has_value()) {
    dict[@"zoomOnWaitingDuration"] = @(zoomOnWaitingDurationOpt.value());
  }
  
  [self->VideoProcessing showEditor:filePath withConfig:dict];
}

- (void)closeEditor {
  if (self->VideoProcessing) {
    [self->VideoProcessing closeEditor:0];
  }
}

#pragma mark - VideoProcessingDelegate methods
- (void)emitEventToJSWithEventName:(NSString * _Nonnull)eventName body:(NSDictionary<NSString *,id> * _Nullable)body {
  
  if ([eventName isEqualToString:@"onLog"]) {
    [self emitOnLog:body];
  } else if ([eventName isEqualToString:@"onError"]) {
    [self emitOnError:body];
  } else if ([eventName isEqualToString:@"onLoad"]) {
    [self emitOnLoad:body];
  } else if ([eventName isEqualToString:@"onStartTrimming"]) {
    [self emitOnStartTrimming];
  } else if ([eventName isEqualToString:@"onCancelTrimming"]) {
    [self emitOnCancelTrimming];
  } else if ([eventName isEqualToString:@"onCancel"]) {
    [self emitOnCancel];
  } else if ([eventName isEqualToString:@"onHide"]) {
    [self emitOnHide];
  } else if ([eventName isEqualToString:@"onShow"]) {
    [self emitOnShow];
  } else if ([eventName isEqualToString:@"onFinishTrimming"]) {
    [self emitOnFinishTrimming:body];
  } else if ([eventName isEqualToString:@"onStatistics"]) {
    [self emitOnStatistics:body];
  }
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeVideoProcessingSpecJSI>(params);
}

@end

#else

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(VideoProcessing, VideoProcessingSwift, RCTEventEmitter)

RCT_EXTERN_METHOD(showEditor:(NSString*)uri withConfig:(NSDictionary *)config)
RCT_EXTERN_METHOD(listFiles:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(cleanFiles:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(deleteFile:(NSString*)uri withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(closeEditor)
RCT_EXTERN_METHOD(isValidFile:(NSString*)uri withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(trim:(NSString*)uri withConfig:(NSDictionary *)config
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(compress:(NSDictionary *)config
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
@end

#endif
