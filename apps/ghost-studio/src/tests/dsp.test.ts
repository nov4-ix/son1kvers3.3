// dsp.test.ts - Tests for DSP functions

import { describe, it, expect } from 'vitest'
import { downmixToMono, normalize, onsetStrength, tempoHistogram, features, createFeaturesSummary } from '../lib/dsp'

describe('DSP Functions', () => {
  describe('downmixToMono', () => {
    it('should convert stereo to mono', () => {
      const leftChannel = new Float32Array([1, 2, 3, 4])
      const rightChannel = new Float32Array([5, 6, 7, 8])
      const channels = [leftChannel, rightChannel]
      
      const result = downmixToMono(channels)
      
      expect(result.length).toBe(4)
      expect(result[0]).toBe(3) // (1 + 5) / 2
      expect(result[1]).toBe(4) // (2 + 6) / 2
      expect(result[2]).toBe(5) // (3 + 7) / 2
      expect(result[3]).toBe(6) // (4 + 8) / 2
    })
    
    it('should return mono channel unchanged', () => {
      const monoChannel = new Float32Array([1, 2, 3, 4])
      const channels = [monoChannel]
      
      const result = downmixToMono(channels)
      
      expect(result).toBe(monoChannel)
    })
  })
  
  describe('normalize', () => {
    it('should normalize signal to [-1, 1]', () => {
      const signal = new Float32Array([0.5, -0.3, 0.8, -0.2])
      const result = normalize(signal)
      
      expect(result.length).toBe(4)
      expect(Math.abs(result[0])).toBeLessThanOrEqual(1)
      expect(Math.abs(result[1])).toBeLessThanOrEqual(1)
      expect(Math.abs(result[2])).toBeLessThanOrEqual(1)
      expect(Math.abs(result[3])).toBeLessThanOrEqual(1)
    })
    
    it('should handle zero signal', () => {
      const signal = new Float32Array([0, 0, 0, 0])
      const result = normalize(signal)
      
      expect(result.length).toBe(4)
      expect(result[0]).toBe(0)
      expect(result[1]).toBe(0)
      expect(result[2]).toBe(0)
      expect(result[3]).toBe(0)
    })
  })
  
  describe('tempoHistogram', () => {
    it('should return reasonable BPM range', () => {
      const onsetStrength = new Float32Array([0.1, 0.8, 0.2, 0.9, 0.1, 0.7, 0.3, 0.8])
      const sampleRate = 44100
      
      const result = tempoHistogram(onsetStrength, sampleRate)
      
      expect(result.bpm).toBeGreaterThanOrEqual(60)
      expect(result.bpm).toBeLessThanOrEqual(200)
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })
  })
  
  describe('features', () => {
    it('should calculate audio features', () => {
      const signal = new Float32Array(1024)
      for (let i = 0; i < signal.length; i++) {
        signal[i] = Math.sin(2 * Math.PI * 440 * i / 44100) // 440Hz sine wave
      }
      const sampleRate = 44100
      
      const result = features(signal, sampleRate)
      
      expect(result.rmsMean).toBeGreaterThan(0)
      expect(result.centroidMean).toBeGreaterThan(0)
      expect(result.rolloffMean).toBeGreaterThan(0)
      expect(result.zcrMean).toBeGreaterThanOrEqual(0)
    })
  })
  
  describe('createFeaturesSummary', () => {
    it('should create normalized features summary', () => {
      const features = {
        rmsMean: 0.5,
        rmsVar: 0.1,
        centroidMean: 2000,
        centroidVar: 500,
        rolloffMean: 8000,
        zcrMean: 0.05
      }
      
      const result = createFeaturesSummary(features)
      
      expect(result.energy).toBeGreaterThanOrEqual(0)
      expect(result.energy).toBeLessThanOrEqual(1)
      expect(result.density).toBeGreaterThanOrEqual(0)
      expect(result.density).toBeLessThanOrEqual(1)
      expect(result.spectralCentroid).toBe(2000)
      expect(result.spectralRolloff).toBe(8000)
      expect(result.zeroCrossingRate).toBe(0.05)
    })
  })
})
