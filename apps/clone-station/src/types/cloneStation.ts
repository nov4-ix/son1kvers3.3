// Clone Station Types - Tipos para Clone Station del universo Son1kVerse

export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: 'voice' | 'music' | 'speech' | 'instrument';
  size: number; // in MB
  duration: number; // in seconds
  quality: 'low' | 'medium' | 'high' | 'ultra';
  format: 'wav' | 'mp3' | 'flac' | 'ogg';
  language?: string;
  accent?: string;
  gender?: 'male' | 'female' | 'neutral';
  age?: 'child' | 'teen' | 'adult' | 'elderly';
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm';
  genre?: string;
  instruments?: string[];
  tags: string[];
  uploadDate: Date;
  lastModified: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';
  progress: number; // 0-100
  error?: string;
  filePath?: string;
  metadata: DatasetMetadata;
}

export interface DatasetMetadata {
  sampleRate: number;
  bitDepth: number;
  channels: number;
  duration: number;
  format: string;
  codec?: string;
  bitrate?: number;
  frequency?: number;
  amplitude?: number;
  noiseLevel?: number;
  clarity?: number;
  pitch?: number;
  tempo?: number;
  key?: string;
  scale?: string;
  chords?: string[];
  instruments?: string[];
  vocals?: boolean;
  lyrics?: string;
  language?: string;
  accent?: string;
  gender?: string;
  age?: string;
  emotion?: string;
  genre?: string;
  mood?: string;
  energy?: number;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  customTags?: string[];
  notes?: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  type: 'voice_clone' | 'music_generation' | 'speech_synthesis' | 'instrument_synthesis';
  datasetId: string;
  datasetName: string;
  status: 'training' | 'ready' | 'error' | 'deleted';
  progress: number; // 0-100
  accuracy: number; // 0-100
  quality: 'low' | 'medium' | 'high' | 'ultra';
  trainingTime: number; // in minutes
  epochs: number;
  loss: number;
  validationLoss: number;
  learningRate: number;
  batchSize: number;
  modelSize: number; // in MB
  parameters: number;
  architecture: string;
  framework: 'tensorflow' | 'pytorch' | 'onnx' | 'custom';
  version: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date;
  usageCount: number;
  error?: string;
  config: ModelConfig;
  metrics: ModelMetrics;
}

export interface ModelConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: 'adam' | 'sgd' | 'rmsprop' | 'adamw';
  lossFunction: 'mse' | 'mae' | 'huber' | 'crossentropy';
  activationFunction: 'relu' | 'leaky_relu' | 'tanh' | 'sigmoid' | 'swish';
  dropout: number;
  regularization: 'l1' | 'l2' | 'elastic' | 'none';
  earlyStopping: boolean;
  patience: number;
  minDelta: number;
  dataAugmentation: boolean;
  normalization: 'minmax' | 'zscore' | 'robust' | 'none';
  featureScaling: boolean;
  crossValidation: boolean;
  testSplit: number;
  validationSplit: number;
  randomSeed: number;
  gpuAcceleration: boolean;
  mixedPrecision: boolean;
  gradientClipping: boolean;
  maxGradientNorm: number;
  weightDecay: number;
  momentum: number;
  beta1: number;
  beta2: number;
  epsilon: number;
  customParams?: Record<string, any>;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  mse: number;
  mae: number;
  rmse: number;
  r2Score: number;
  trainingLoss: number[];
  validationLoss: number[];
  trainingAccuracy: number[];
  validationAccuracy: number[];
  learningRateHistory: number[];
  epochTime: number[];
  totalTrainingTime: number;
  bestEpoch: number;
  overfitting: boolean;
  convergence: boolean;
  stability: number;
  generalization: number;
  robustness: number;
  efficiency: number;
  customMetrics?: Record<string, number>;
}

export interface TrainingJob {
  id: string;
  modelId: string;
  modelName: string;
  datasetId: string;
  datasetName: string;
  status: 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  currentEpoch: number;
  totalEpochs: number;
  currentBatch: number;
  totalBatches: number;
  startTime: Date;
  endTime?: Date;
  estimatedTimeRemaining?: number; // in seconds
  gpuUsage: number; // 0-100
  memoryUsage: number; // 0-100
  cpuUsage: number; // 0-100
  error?: string;
  logs: TrainingLog[];
  config: ModelConfig;
  metrics: Partial<ModelMetrics>;
}

export interface TrainingLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: any;
  epoch?: number;
  batch?: number;
  loss?: number;
  accuracy?: number;
  learningRate?: number;
  gpuUsage?: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

export interface ConversionJob {
  id: string;
  modelId: string;
  modelName: string;
  inputText?: string;
  inputAudio?: string;
  inputType: 'text' | 'audio' | 'voice';
  outputType: 'audio' | 'voice' | 'music';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  startTime: Date;
  endTime?: Date;
  estimatedTimeRemaining?: number; // in seconds
  inputDuration?: number; // in seconds
  outputDuration?: number; // in seconds
  outputFile?: string;
  error?: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  settings: ConversionSettings;
}

export interface ConversionSettings {
  voice: {
    pitch: number; // -12 to 12 semitones
    speed: number; // 0.5 to 2.0
    volume: number; // 0.0 to 1.0
    emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm';
    style: 'natural' | 'robotic' | 'whisper' | 'shout' | 'singing';
    accent: 'neutral' | 'american' | 'british' | 'australian' | 'canadian';
    gender: 'auto' | 'male' | 'female' | 'neutral';
    age: 'auto' | 'child' | 'teen' | 'adult' | 'elderly';
  };
  audio: {
    sampleRate: number; // 8000, 16000, 22050, 44100, 48000
    bitDepth: number; // 16, 24, 32
    channels: number; // 1, 2
    format: 'wav' | 'mp3' | 'flac' | 'ogg';
    bitrate?: number; // for compressed formats
    normalization: boolean;
    noiseReduction: boolean;
    echoCancellation: boolean;
    compression: boolean;
    equalization: boolean;
    reverb: boolean;
    delay: boolean;
    chorus: boolean;
    distortion: boolean;
  };
  music: {
    tempo: number; // BPM
    key: string; // C, C#, D, D#, E, F, F#, G, G#, A, A#, B
    scale: string; // major, minor, pentatonic, blues, etc.
    timeSignature: string; // 4/4, 3/4, 2/4, etc.
    genre: string;
    mood: 'happy' | 'sad' | 'energetic' | 'calm' | 'dramatic' | 'mysterious';
    energy: number; // 0-100
    danceability: number; // 0-100
    valence: number; // 0-100
    acousticness: number; // 0-100
    instrumentalness: number; // 0-100
    liveness: number; // 0-100
    speechiness: number; // 0-100
    instruments: string[];
    vocals: boolean;
    lyrics?: string;
    language?: string;
  };
  advanced: {
    temperature: number; // 0.1 to 2.0
    topK: number; // 1 to 100
    topP: number; // 0.1 to 1.0
    repetitionPenalty: number; // 0.1 to 2.0
    lengthPenalty: number; // 0.1 to 2.0
    diversityPenalty: number; // 0.1 to 2.0
    creativity: number; // 0-100
    consistency: number; // 0-100
    originality: number; // 0-100
    customParams?: Record<string, any>;
  };
}

export interface QualityMetrics {
  overall: number; // 0-100
  clarity: number; // 0-100
  naturalness: number; // 0-100
  intelligibility: number; // 0-100
  emotionalAccuracy: number; // 0-100
  prosody: number; // 0-100
  pronunciation: number; // 0-100
  rhythm: number; // 0-100
  pitch: number; // 0-100
  volume: number; // 0-100
  noise: number; // 0-100 (lower is better)
  distortion: number; // 0-100 (lower is better)
  artifacts: number; // 0-100 (lower is better)
  consistency: number; // 0-100
  stability: number; // 0-100
  robustness: number; // 0-100
  generalization: number; // 0-100
  efficiency: number; // 0-100
  speed: number; // 0-100
  memory: number; // 0-100
  customMetrics?: Record<string, number>;
}

export interface CloneStationState {
  // Datasets
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  datasetUploadProgress: number;
  datasetUploadStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  
  // Models
  models: Model[];
  selectedModel: Model | null;
  modelTrainingProgress: number;
  modelTrainingStatus: 'idle' | 'training' | 'completed' | 'error';
  
  // Training Jobs
  trainingJobs: TrainingJob[];
  activeTrainingJob: TrainingJob | null;
  
  // Conversion Jobs
  conversionJobs: ConversionJob[];
  activeConversionJob: ConversionJob | null;
  
  // UI State
  activeTab: 'datasets' | 'models' | 'training' | 'conversion' | 'quality';
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  language: 'es' | 'en';
  
  // Settings
  settings: {
    autoStartTraining: boolean;
    autoDeleteCompletedJobs: boolean;
    maxConcurrentJobs: number;
    gpuAcceleration: boolean;
    defaultQuality: 'low' | 'medium' | 'high' | 'ultra';
    defaultFormat: 'wav' | 'mp3' | 'flac' | 'ogg';
    defaultSampleRate: number;
    defaultBitDepth: number;
    notifications: boolean;
    soundEffects: boolean;
    hapticFeedback: boolean;
    performanceMode: 'low' | 'medium' | 'high';
    cacheSize: number;
    tempDirectory: string;
    outputDirectory: string;
    logLevel: 'debug' | 'info' | 'warning' | 'error';
    maxLogSize: number;
    logRetention: number;
  };
  
  // Performance
  performance: {
    gpuUsage: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
    networkUsage: number;
    temperature: number;
    fanSpeed: number;
    powerUsage: number;
  };
  
  // Statistics
  statistics: {
    totalDatasets: number;
    totalModels: number;
    totalTrainingJobs: number;
    totalConversionJobs: number;
    totalTrainingTime: number;
    totalConversionTime: number;
    averageTrainingTime: number;
    averageConversionTime: number;
    successRate: number;
    errorRate: number;
    uptime: number;
    lastActivity: Date;
  };
}

// Export types
export type DatasetType = Dataset['type'];
export type ModelType = Model['type'];
export type TrainingStatus = TrainingJob['status'];
export type ConversionStatus = ConversionJob['status'];
export type QualityLevel = Dataset['quality'];
export type AudioFormat = Dataset['format'];
export type OptimizerType = ModelConfig['optimizer'];
export type LossFunction = ModelConfig['lossFunction'];
export type ActivationFunction = ModelConfig['activationFunction'];
export type LogLevel = TrainingLog['level'];
export type VoiceEmotion = ConversionSettings['voice']['emotion'];
export type VoiceStyle = ConversionSettings['voice']['style'];
export type VoiceAccent = ConversionSettings['voice']['accent'];
export type VoiceGender = ConversionSettings['voice']['gender'];
export type VoiceAge = ConversionSettings['voice']['age'];
export type MusicMood = ConversionSettings['music']['mood'];
export type MusicGenre = string;
export type MusicKey = string;
export type MusicScale = string;
export type MusicTimeSignature = string;
export type MusicInstrument = string;
export type AudioSampleRate = ConversionSettings['audio']['sampleRate'];
export type AudioBitDepth = ConversionSettings['audio']['bitDepth'];
export type AudioChannels = ConversionSettings['audio']['channels'];
export type AudioFormat = ConversionSettings['audio']['format'];
export type PerformanceMode = CloneStationState['settings']['performanceMode'];
export type LogLevel = CloneStationState['settings']['logLevel'];
export type Theme = CloneStationState['theme'];
export type Language = CloneStationState['language'];
export type Tab = CloneStationState['activeTab'];