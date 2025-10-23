/**
 * Audio processing utilities for SON1KVERS3 platform
 */

/**
 * Audio format conversion utilities
 */
export class AudioUtils {
  /**
   * Convert seconds to time format (MM:SS or HH:MM:SS)
   */
  static secondsToTimeFormat(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Convert time format to seconds
   */
  static timeFormatToSeconds(timeFormat: string): number {
    const parts = timeFormat.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  /**
   * Format file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Calculate audio bitrate
   */
  static calculateBitrate(fileSizeBytes: number, durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    return Math.round((fileSizeBytes * 8) / durationSeconds / 1000); // kbps
  }

  /**
   * Validate audio quality based on bitrate
   */
  static getQualityFromBitrate(bitrate: number): 'low' | 'medium' | 'high' | 'lossless' {
    if (bitrate >= 320) return 'lossless';
    if (bitrate >= 256) return 'high';
    if (bitrate >= 128) return 'medium';
    return 'low';
  }

  /**
   * Get recommended bitrate for quality
   */
  static getRecommendedBitrate(quality: 'low' | 'medium' | 'high' | 'lossless'): number {
    switch (quality) {
      case 'lossless': return 1411; // FLAC
      case 'high': return 320;
      case 'medium': return 192;
      case 'low': return 128;
      default: return 192;
    }
  }

  /**
   * Generate waveform data from audio samples
   */
  static generateWaveform(samples: number[], width: number = 200): number[] {
    if (samples.length === 0) return new Array(width).fill(0);

    const blockSize = Math.floor(samples.length / width);
    const waveform: number[] = [];

    for (let i = 0; i < width; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, samples.length);

      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += Math.abs(samples[j]);
      }

      const average = sum / (end - start);
      waveform.push(average);
    }

    // Normalize to 0-1 range
    const maxValue = Math.max(...waveform);
    return waveform.map(value => maxValue > 0 ? value / maxValue : 0);
  }

  /**
   * Detect silence in audio samples
   */
  static detectSilence(samples: number[], threshold: number = 0.01): boolean {
    const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
    return rms < threshold;
  }

  /**
   * Calculate RMS (Root Mean Square) of audio samples
   */
  static calculateRMS(samples: number[]): number {
    if (samples.length === 0) return 0;
    const sumOfSquares = samples.reduce((sum, sample) => sum + sample * sample, 0);
    return Math.sqrt(sumOfSquares / samples.length);
  }

  /**
   * Normalize audio samples to prevent clipping
   */
  static normalizeAudio(samples: number[], targetPeak: number = 0.95): number[] {
    const currentPeak = Math.max(...samples.map(Math.abs));
    if (currentPeak === 0) return samples;

    const normalizationFactor = targetPeak / currentPeak;
    return samples.map(sample => sample * normalizationFactor);
  }

  /**
   * Apply fade in/out to audio samples
   */
  static applyFade(
    samples: number[],
    fadeInDuration: number = 0,
    fadeOutDuration: number = 0,
    sampleRate: number = 44100
  ): number[] {
    const result = [...samples];
    const totalSamples = samples.length;

    // Fade in
    const fadeInSamples = Math.floor((fadeInDuration / 1000) * sampleRate);
    for (let i = 0; i < Math.min(fadeInSamples, totalSamples); i++) {
      const fadeFactor = i / fadeInSamples;
      result[i] *= fadeFactor;
    }

    // Fade out
    const fadeOutSamples = Math.floor((fadeOutDuration / 1000) * sampleRate);
    for (let i = 0; i < fadeOutSamples; i++) {
      const sampleIndex = totalSamples - 1 - i;
      if (sampleIndex >= 0) {
        const fadeFactor = i / fadeOutSamples;
        result[sampleIndex] *= fadeFactor;
      }
    }

    return result;
  }

  /**
   * Mix two audio tracks
   */
  static mixAudio(track1: number[], track2: number[], volume1: number = 1, volume2: number = 1): number[] {
    const maxLength = Math.max(track1.length, track2.length);
    const result: number[] = [];

    for (let i = 0; i < maxLength; i++) {
      const sample1 = track1[i] || 0;
      const sample2 = track2[i] || 0;
      result.push(sample1 * volume1 + sample2 * volume2);
    }

    return this.normalizeAudio(result);
  }

  /**
   * Convert frequency to musical note
   */
  static frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
    const A4 = 440;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const noteNumber = Math.round(12 * Math.log2(frequency / A4)) + 69;
    const octave = Math.floor(noteNumber / 12) - 1;
    const noteIndex = noteNumber % 12;

    const exactNoteNumber = 12 * Math.log2(frequency / A4) + 69;
    const cents = Math.round((exactNoteNumber - noteNumber) * 100);

    return {
      note: noteNames[noteIndex] || 'C',
      octave,
      cents
    };
  }

  /**
   * Convert musical note to frequency
   */
  static noteToFrequency(note: string, octave: number, cents: number = 0): number {
    const A4 = 440;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const noteIndex = noteNames.indexOf(note.toUpperCase());
    if (noteIndex === -1) return A4;

    const noteNumber = octave * 12 + noteIndex + 21; // A0 = 21
    const frequency = A4 * Math.pow(2, (noteNumber - 69) / 12);

    return frequency * Math.pow(2, cents / 1200);
  }

  /**
   * Calculate tempo from beat positions
   */
  static calculateTempo(beatPositions: number[], sampleRate: number = 44100): number {
    if (beatPositions.length < 2) return 120;

    const intervals: number[] = [];
    for (let i = 1; i < beatPositions.length; i++) {
      intervals.push(beatPositions[i] - beatPositions[i - 1]);
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const tempo = 60 / (averageInterval / sampleRate);

    return Math.round(tempo);
  }

  /**
   * Generate metronome click samples
   */
  static generateMetronomeClick(
    bpm: number,
    duration: number,
    sampleRate: number = 44100,
    frequency: number = 1000
  ): number[] {
    const samples: number[] = [];
    const samplesPerBeat = Math.floor((60 / bpm) * sampleRate);
    const totalSamples = Math.floor((duration / 60) * bpm * samplesPerBeat);

    for (let i = 0; i < totalSamples; i++) {
      const beatPosition = Math.floor(i / samplesPerBeat);
      const isBeat = i % samplesPerBeat === 0;

      if (isBeat) {
        // Generate click sound (sine wave)
        const t = (i % samplesPerBeat) / sampleRate;
        const clickDuration = 0.1; // 100ms click
        const envelope = Math.max(0, 1 - (t / clickDuration));

        samples.push(Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3);
      } else {
        samples.push(0);
      }
    }

    return samples;
  }

  /**
   * Apply reverb effect (simple implementation)
   */
  static applyReverb(samples: number[], delayMs: number = 100, decay: number = 0.5): number[] {
    const delaySamples = Math.floor((delayMs / 1000) * 44100);
    const result: number[] = [];

    for (let i = 0; i < samples.length; i++) {
      let output = samples[i];

      // Add delayed samples with decay
      for (let d = delaySamples; d < samples.length; d += delaySamples) {
        if (i >= d) {
          output += samples[i - d] * Math.pow(decay, d / delaySamples);
        }
      }

      result.push(output);
    }

    return this.normalizeAudio(result);
  }

  /**
   * Apply low-pass filter
   */
  static applyLowPassFilter(samples: number[], cutoffFreq: number, sampleRate: number = 44100): number[] {
    const rc = 1 / (2 * Math.PI * cutoffFreq);
    const dt = 1 / sampleRate;
    const alpha = dt / (rc + dt);

    const result: number[] = [];
    let previousOutput = 0;
    let previousInput = 0;

    for (const sample of samples) {
      const output = alpha * (sample + previousInput) + (1 - alpha) * previousOutput;
      result.push(output);

      previousOutput = output;
      previousInput = sample;
    }

    return result;
  }

  /**
   * Apply high-pass filter
   */
  static applyHighPassFilter(samples: number[], cutoffFreq: number, sampleRate: number = 44100): number[] {
    const rc = 1 / (2 * Math.PI * cutoffFreq);
    const dt = 1 / sampleRate;
    const alpha = rc / (rc + dt);

    const result: number[] = [];
    let previousOutput = 0;
    let previousInput = 0;

    for (const sample of samples) {
      const output = alpha * (previousOutput + sample - previousInput);
      result.push(output);

      previousOutput = output;
      previousInput = sample;
    }

    return result;
  }

  /**
   * Compress audio samples
   */
  static compressAudio(samples: number[], threshold: number = 0.7, ratio: number = 4): number[] {
    return samples.map(sample => {
      const absSample = Math.abs(sample);

      if (absSample > threshold) {
        const compressed = threshold + (absSample - threshold) / ratio;
        return sample > 0 ? compressed : -compressed;
      }

      return sample;
    });
  }

  /**
   * Generate audio hash for content identification
   */
  static generateAudioHash(samples: number[], sampleRate: number = 44100): string {
    // Simple hash based on frequency peaks
    const fftSize = 2048;
    const peaks: number[] = [];

    for (let i = 0; i < samples.length - fftSize; i += fftSize) {
      const segment = samples.slice(i, i + fftSize);
      const rms = this.calculateRMS(segment);
      peaks.push(rms);
    }

    // Take top 10 peaks
    peaks.sort((a, b) => b - a);
    const topPeaks = peaks.slice(0, 10);

    // Generate hash
    const hashInput = topPeaks.map(peak => peak.toFixed(3)).join(',');
    return btoa(hashInput).replace(/[^A-Za-z0-9]/g, '').substring(0, 16);
  }

  /**
   * Detect key from audio samples (simplified)
   */
  static detectKey(samples: number[], sampleRate: number = 44100): string {
    // This is a simplified implementation
    // In practice, you'd use more sophisticated key detection algorithms

    const note = this.frequencyToNote(440); // Default to A4
    return note.note;
  }

  /**
   * Calculate audio features for analysis
   */
  static calculateAudioFeatures(samples: number[], sampleRate: number = 44100) {
    const rms = this.calculateRMS(samples);
    const peak = Math.max(...samples.map(Math.abs));
    const zeroCrossings = this.countZeroCrossings(samples);
    const spectralCentroid = this.calculateSpectralCentroid(samples, sampleRate);

    return {
      rms,
      peak,
      zeroCrossings,
      spectralCentroid,
      duration: samples.length / sampleRate,
      sampleRate
    };
  }

  /**
   * Count zero crossings in audio samples
   */
  private static countZeroCrossings(samples: number[]): number {
    let crossings = 0;
    for (let i = 1; i < samples.length; i++) {
      if ((samples[i] >= 0) !== (samples[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings;
  }

  /**
   * Calculate spectral centroid (simplified)
   */
  private static calculateSpectralCentroid(samples: number[], sampleRate: number): number {
    // Simplified implementation - in practice use FFT
    const magnitudes = samples.map(Math.abs);
    let weightedSum = 0;
    let totalMagnitude = 0;

    for (let i = 0; i < magnitudes.length; i++) {
      const frequency = (i * sampleRate) / (2 * magnitudes.length);
      weightedSum += frequency * magnitudes[i];
      totalMagnitude += magnitudes[i];
    }

    return totalMagnitude > 0 ? weightedSum / totalMagnitude : 0;
  }
}
