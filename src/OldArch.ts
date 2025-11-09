import { NativeModules, Platform } from 'react-native';
export * from './NativeVideoProcessing';

const LINKING_ERROR =
  `The package 'expo-video-processing' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const VideoProcessing = NativeModules.VideoProcessing
  ? NativeModules.VideoProcessing
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default VideoProcessing;
