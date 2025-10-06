// analyzer.worker.ts - Audio analysis worker

import { downmixToMono, normalize, onsetStrength, tempoHistogram, features, createFeaturesSummary } from '../lib/dsp.js'

interface AnalysisMessage {
  type: 'analyze'
  audioBuffer: ArrayBuffer
  sampleRate: number
}

interface AnalysisResult {
  type: 'analysis'
  data: {
    bpm: number
    confidence: number
    featuresSummary: {
      energy: number
      density: number
      spectralCentroid: number
      spectralRolloff: number
      zeroCrossingRate: number
    }
  }
}

interface ErrorMessage {
  type: 'error'
  error: string
}

type WorkerMessage = AnalysisMessage | AnalysisResult | ErrorMessage

// Main analysis function
async function analyzeAudio(audioBuffer: ArrayBuffer, sampleRate: number) {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate })
    
    // Decode audio data
    const audioBuffer_decoded = await audioContext.decodeAudioData(audioBuffer.slice())
    
    // Convert to mono
    const channels: Float32Array[] = []
    for (let i = 0; i < audioBuffer_decoded.numberOfChannels; i++) {
      channels.push(audioBuffer_decoded.getChannelData(i))
    }
    const monoSignal = downmixToMono(channels)
    
    // Normalize signal
    const normalizedSignal = normalize(monoSignal)
    
    // Calculate onset strength
    const onset = onsetStrength(normalizedSignal, sampleRate)
    
    // Calculate tempo
    const tempoResult = tempoHistogram(onset, sampleRate)
    
    // Calculate features
    const audioFeatures = features(normalizedSignal, sampleRate)
    const featuresSummary = createFeaturesSummary(audioFeatures)
    
    // Close audio context
    await audioContext.close()
    
    return {
      bpm: tempoResult.bpm,
      confidence: tempoResult.confidence,
      featuresSummary
    }
  } catch (error) {
    throw new Error(`Audio analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Worker message handler
self.onmessage = async function(e: MessageEvent<AnalysisMessage>) {
  try {
    if (e.data.type === 'analyze') {
      const result = await analyzeAudio(e.data.audioBuffer, e.data.sampleRate)
      
      const response: AnalysisResult = {
        type: 'analysis',
        data: result
      }
      
      self.postMessage(response)
    }
  } catch (error) {
    const errorResponse: ErrorMessage = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
    
    self.postMessage(errorResponse)
  }
}
