// genre.worker.ts - Genre classification worker

import { classifyStyle, getGenreDescription, getInstrumentDescription } from '../lib/heuristics.js'

interface GenreMessage {
  type: 'tag'
  data: {
    bpm: number
    featuresSummary: {
      energy: number
      density: number
      spectralCentroid: number
      spectralRolloff: number
      zeroCrossingRate: number
    }
  }
}

interface GenreResult {
  type: 'style'
  data: {
    styleTags: string[]
    probableInstruments: string[]
    genreDescription: string
    instrumentDescription: string
  }
}

interface ErrorMessage {
  type: 'error'
  error: string
}

type WorkerMessage = GenreMessage | GenreResult | ErrorMessage

// Main genre classification function
function classifyGenre(data: GenreMessage['data']) {
  try {
    // Classify style and instruments
    const classification = classifyStyle(data)
    
    // Get descriptions
    const genreDescription = getGenreDescription(classification.styleTags)
    const instrumentDescription = getInstrumentDescription(classification.probableInstruments)
    
    return {
      styleTags: classification.styleTags,
      probableInstruments: classification.probableInstruments,
      genreDescription,
      instrumentDescription
    }
  } catch (error) {
    throw new Error(`Genre classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Worker message handler
self.onmessage = function(e: MessageEvent<GenreMessage>) {
  try {
    if (e.data.type === 'tag') {
      const result = classifyGenre(e.data.data)
      
      const response: GenreResult = {
        type: 'style',
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
