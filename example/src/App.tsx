import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  type EventSubscription,
} from 'react-native';
import NativeVideoProcessing, {
  cleanFiles,
  deleteFile,
  listFiles,
  showEditor,
  isValidFile,
  trim,
  compress,
  COMPRESSION_PRESETS,
  type Spec,
  type CompressionResult,
} from 'expo-video-processing';
import {
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import { useEffect, useRef, useState } from 'react';

type Tab = 'trim' | 'compress';
type PresetKey = keyof typeof COMPRESSION_PRESETS;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('trim');
  const [isTrimming, setIsTrimming] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('MEDIUM_QUALITY');
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  
  const listenerSubscription = useRef<Record<string, EventSubscription>>({});

  useEffect(() => {
    console.log('Fabric enabled:', !!(global as any)?.nativeFabricUIManager);

    listenerSubscription.current.onLoad = (NativeVideoProcessing as Spec).onLoad(
      ({ duration }) => console.log('onLoad', duration)
    );

    listenerSubscription.current.onStartTrimming = (
      NativeVideoProcessing as Spec
    ).onStartTrimming(() => console.log('onStartTrimming'));

    listenerSubscription.current.onCancelTrimming = (
      NativeVideoProcessing as Spec
    ).onCancelTrimming(() => console.log('onCancelTrimming'));
    
    listenerSubscription.current.onCancel = (NativeVideoProcessing as Spec).onCancel(
      () => console.log('onCancel')
    );
    
    listenerSubscription.current.onHide = (NativeVideoProcessing as Spec).onHide(() =>
      console.log('onHide')
    );
    
    listenerSubscription.current.onShow = (NativeVideoProcessing as Spec).onShow(() =>
      console.log('onShow')
    );
    
    listenerSubscription.current.onFinishTrimming = (
      NativeVideoProcessing as Spec
    ).onFinishTrimming(({ outputPath, startTime, endTime, duration }) =>
      console.log(
        'onFinishTrimming',
        `outputPath: ${outputPath}, startTime: ${startTime}, endTime: ${endTime}, duration: ${duration}`
      )
    );
    
    listenerSubscription.current.onLog = (NativeVideoProcessing as Spec).onLog(
      ({ level, message, sessionId }) =>
        console.log(
          'onLog',
          `level: ${level}, message: ${message}, sessionId: ${sessionId}`
        )
    );
    
    listenerSubscription.current.onStatistics = (
      NativeVideoProcessing as Spec
    ).onStatistics(
      ({
        sessionId,
        videoFrameNumber,
        videoFps,
        videoQuality,
        size,
        time,
        bitrate,
        speed,
      }) =>
        console.log(
          'onStatistics',
          `sessionId: ${sessionId}, videoFrameNumber: ${videoFrameNumber}, videoFps: ${videoFps}, videoQuality: ${videoQuality}, size: ${size}, time: ${time}, bitrate: ${bitrate}, speed: ${speed}`
        )
    );
    
    listenerSubscription.current.onError = (NativeVideoProcessing as Spec).onError(
      ({ message, errorCode }) =>
        console.log('onError', `message: ${message}, errorCode: ${errorCode}`)
    );

    return () => {
      listenerSubscription.current.onLoad?.remove();
      listenerSubscription.current.onStartTrimming?.remove();
      listenerSubscription.current.onCancelTrimming?.remove();
      listenerSubscription.current.onCancel?.remove();
      listenerSubscription.current.onHide?.remove();
      listenerSubscription.current.onShow?.remove();
      listenerSubscription.current.onFinishTrimming?.remove();
      listenerSubscription.current.onLog?.remove();
      listenerSubscription.current.onStatistics?.remove();
      listenerSubscription.current.onError?.remove();
      listenerSubscription.current = {};
    };
  }, []);

  const onMediaLoaded = (response: ImagePickerResponse) => {
    console.log('Response', response);
  };

  const handleCompress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        includeExtra: true,
        assetRepresentationMode: 'current',
      });

      if (!result.assets?.[0]?.uri) {
        return;
      }

      const videoUri = result.assets[0].uri;
      
      setIsCompressing(true);
      setCompressionError(null);
      setCompressionResult(null);

      const compressed = await compress({
        inputPath: videoUri,
        ...COMPRESSION_PRESETS[selectedPreset],
      });

      setCompressionResult(compressed);
      
      Alert.alert(
        'Compression Complete!',
        `Original: ${(compressed.originalSize / 1024 / 1024).toFixed(2)} MB\n` +
        `Compressed: ${(compressed.compressedSize / 1024 / 1024).toFixed(2)} MB\n` +
        `Saved: ${compressed.compressionRatio.toFixed(2)}%`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Compression error:', error);
      setCompressionError(error instanceof Error ? error.message : 'Unknown error');
      Alert.alert('Compression Failed', String(error));
    } finally {
      setIsCompressing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trim' && styles.activeTab]}
          onPress={() => setActiveTab('trim')}
        >
          <Text style={[styles.tabText, activeTab === 'trim' && styles.activeTabText]}>
            Trim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'compress' && styles.activeTab]}
          onPress={() => setActiveTab('compress')}
        >
          <Text style={[styles.tabText, activeTab === 'compress' && styles.activeTabText]}>
            Compress
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'trim' ? (
          /* TRIM TAB */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Trimming</Text>
            
            <TouchableOpacity
              onPress={async () => {
                try {
                  const result = await launchImageLibrary({
                    mediaType: 'video',
                    includeExtra: true,
                    assetRepresentationMode: 'current',
                  }, onMediaLoaded);

                  if (result.assets?.[0]?.uri) {
                    showEditor(result.assets[0].uri, {
                      maxDuration: 30,
                      fullScreenModalIOS: true,
                      saveToPhoto: true,
                      headerTextSize: 20,
                      headerTextColor: '#FF0000',
                      trimmingText: 'Trimming Video...',
                    });
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Open Video Editor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const url =
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

                setIsTrimming(true);
                trim(url, {
                  startTime: 0,
                  endTime: 15000,
                  saveToPhoto: true,
                })
                  .then((res) => {
                    console.log('Trimmed file:', res);
                    Alert.alert('Success', 'Video trimmed successfully!');
                  })
                  .catch((error) => {
                    console.error('Error trimming file:', error);
                    Alert.alert('Error', 'Failed to trim video');
                  })
                  .finally(() => {
                    setIsTrimming(false);
                  });
              }}
              style={[styles.button, styles.buttonSecondary]}
            >
              <Text style={styles.buttonText}>
                {isTrimming ? 'Trimming...' : 'Trim Sample Video'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.sectionSubtitle}>File Management</Text>

            <TouchableOpacity
              onPress={() => {
                listFiles().then((res) => {
                  console.log('Files:', res);
                  Alert.alert('Files', `Found ${res.length} files`);
                });
              }}
              style={[styles.button, styles.buttonSmall]}
            >
              <Text style={styles.buttonText}>List Files</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                cleanFiles().then((res) => {
                  console.log('Cleaned:', res);
                  Alert.alert('Success', `Deleted ${res} files`);
                });
              }}
              style={[styles.button, styles.buttonSmall, styles.buttonDanger]}
            >
              <Text style={styles.buttonText}>Clean All Files</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* COMPRESS TAB */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Compression</Text>

            {/* Preset Selector */}
            <Text style={styles.label}>Select Preset:</Text>
            <View style={styles.presetContainer}>
              {(Object.keys(COMPRESSION_PRESETS) as PresetKey[]).map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    selectedPreset === preset && styles.presetButtonActive,
                  ]}
                  onPress={() => setSelectedPreset(preset)}
                >
                  <Text
                    style={[
                      styles.presetButtonText,
                      selectedPreset === preset && styles.presetButtonTextActive,
                    ]}
                  >
                    {preset.replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Compress Button */}
            <TouchableOpacity
              onPress={handleCompress}
              disabled={isCompressing}
              style={[styles.button, styles.buttonPrimary, isCompressing && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {isCompressing ? 'Compressing...' : 'Select & Compress Video'}
              </Text>
            </TouchableOpacity>

            {/* Results Display */}
            {compressionResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>✅ Compression Complete!</Text>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Original Size:</Text>
                  <Text style={styles.resultValue}>
                    {formatBytes(compressionResult.originalSize)}
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Compressed Size:</Text>
                  <Text style={styles.resultValue}>
                    {formatBytes(compressionResult.compressedSize)}
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Space Saved:</Text>
                  <Text style={[styles.resultValue, styles.resultHighlight]}>
                    {compressionResult.compressionRatio.toFixed(2)}%
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Duration:</Text>
                  <Text style={styles.resultValue}>
                    {(compressionResult.duration / 1000).toFixed(1)}s
                  </Text>
                </View>

                <Text style={styles.resultPath} numberOfLines={2}>
                  {compressionResult.outputPath}
                </Text>
              </View>
            )}

            {/* Error Display */}
            {compressionError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ Error: {compressionError}</Text>
              </View>
            )}

            {/* Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Current Preset Details:</Text>
              <Text style={styles.infoText}>
                {JSON.stringify(COMPRESSION_PRESETS[selectedPreset], null, 2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonSmall: {
    backgroundColor: '#34C759',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  presetButtonActive: {
    backgroundColor: '#007AFF',
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  presetButtonTextActive: {
    color: 'white',
  },
  resultContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e7d32',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  resultHighlight: {
    color: '#2e7d32',
    fontSize: 16,
  },
  resultPath: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
  },
  infoContainer: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#e65100',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});
