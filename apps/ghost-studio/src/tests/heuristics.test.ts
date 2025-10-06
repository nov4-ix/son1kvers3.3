// heuristics.test.ts - Tests for genre classification heuristics

import { describe, it, expect } from 'vitest'
import { classifyStyle, getGenreDescription, getInstrumentDescription } from '../lib/heuristics'

describe('Heuristics Functions', () => {
  describe('classifyStyle', () => {
    it('should classify slow tempo as ballad/lofi', () => {
      const data = {
        bpm: 70,
        featuresSummary: {
          energy: 0.3,
          density: 0.2,
          spectralCentroid: 800,
          spectralRolloff: 3000,
          zeroCrossingRate: 0.05
        }
      }
      
      const result = classifyStyle(data)
      
      expect(result.styleTags).toContain('ballad')
      expect(result.styleTags).toContain('lofi')
      expect(result.probableInstruments).toContain('piano')
      expect(result.probableInstruments).toContain('acoustic guitar')
    })
    
    it('should classify fast tempo as techno/dnb', () => {
      const data = {
        bpm: 140,
        featuresSummary: {
          energy: 0.8,
          density: 0.7,
          spectralCentroid: 2500,
          spectralRolloff: 6000,
          zeroCrossingRate: 0.15
        }
      }
      
      const result = classifyStyle(data)
      
      expect(result.styleTags).toContain('techno')
      expect(result.styleTags).toContain('dnb')
      expect(result.probableInstruments).toContain('kick')
      expect(result.probableInstruments).toContain('bass')
    })
    
    it('should classify high energy as energetic', () => {
      const data = {
        bpm: 120,
        featuresSummary: {
          energy: 0.9,
          density: 0.6,
          spectralCentroid: 2000,
          spectralRolloff: 5000,
          zeroCrossingRate: 0.1
        }
      }
      
      const result = classifyStyle(data)
      
      expect(result.styleTags).toContain('energetic')
      expect(result.probableInstruments).toContain('drums')
    })
    
    it('should classify bright sound as bright', () => {
      const data = {
        bpm: 120,
        featuresSummary: {
          energy: 0.6,
          density: 0.4,
          spectralCentroid: 3500,
          spectralRolloff: 7000,
          zeroCrossingRate: 0.08
        }
      }
      
      const result = classifyStyle(data)
      
      expect(result.styleTags).toContain('bright')
      expect(result.probableInstruments).toContain('electric guitar')
    })
  })
  
  describe('getGenreDescription', () => {
    it('should return description for known genres', () => {
      const styleTags = ['ballad', 'lofi', 'energetic']
      const result = getGenreDescription(styleTags)
      
      expect(result).toContain('Slow, emotional song')
      expect(result).toContain('Low-fidelity')
      expect(result).toContain('High-energy')
    })
    
    it('should return tag names for unknown genres', () => {
      const styleTags = ['unknown-genre', 'another-unknown']
      const result = getGenreDescription(styleTags)
      
      expect(result).toContain('unknown-genre')
      expect(result).toContain('another-unknown')
    })
  })
  
  describe('getInstrumentDescription', () => {
    it('should return description for known instruments', () => {
      const instruments = ['piano', 'electric guitar', 'drums']
      const result = getInstrumentDescription(instruments)
      
      expect(result).toContain('Acoustic or electric piano')
      expect(result).toContain('Guitar with electromagnetic pickups')
      expect(result).toContain('Percussion instrument')
    })
    
    it('should return instrument names for unknown instruments', () => {
      const instruments = ['unknown-instrument', 'another-unknown']
      const result = getInstrumentDescription(instruments)
      
      expect(result).toContain('unknown-instrument')
      expect(result).toContain('another-unknown')
    })
  })
})
