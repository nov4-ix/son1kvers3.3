import type { PixelProfile, PixelPreferences } from '@/types/pixels'

const STORAGE_VERSION = '1.0.0'
const STORAGE_PREFIX = 'pixel-learning'

interface StorageItem<T> {
  version: string
  data: T
  timestamp: number
}

export class PixelStorage {
  private static instance: PixelStorage
  private cache: Map<string, any> = new Map()

  static getInstance(): PixelStorage {
    if (!PixelStorage.instance) {
      PixelStorage.instance = new PixelStorage()
    }
    return PixelStorage.instance
  }

  private getKey(key: string): string {
    return `${STORAGE_PREFIX}_${key}`
  }

  private isValidItem<T>(item: StorageItem<T>): boolean {
    return item.version === STORAGE_VERSION
  }

  set<T>(key: string, data: T): void {
    const item: StorageItem<T> = {
      version: STORAGE_VERSION,
      data,
      timestamp: Date.now()
    }
    
    try {
      const serialized = JSON.stringify(item)
      localStorage.setItem(this.getKey(key), serialized)
      this.cache.set(key, data)
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    try {
      const serialized = localStorage.getItem(this.getKey(key))
      if (!serialized) return null

      const item: StorageItem<T> = JSON.parse(serialized)
      
      if (!this.isValidItem(item)) {
        console.warn(`Storage item ${key} has invalid version, clearing`)
        this.remove(key)
        return null
      }

      this.cache.set(key, item.data)
      return item.data
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
      this.cache.delete(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
      this.cache.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }

  getStorageSize(): number {
    let size = 0
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          size += localStorage.getItem(key)?.length || 0
        }
      })
    } catch (error) {
      console.warn('Failed to calculate storage size:', error)
    }
    return size
  }

  // Pixel-specific methods
  saveUserProfile(profile: PixelProfile): void {
    this.set('user_profile', profile)
  }

  loadUserProfile(): PixelProfile | null {
    return this.get<PixelProfile>('user_profile')
  }

  savePixelPreferences(preferences: PixelPreferences[]): void {
    this.set('pixel_preferences', preferences)
  }

  loadPixelPreferences(): PixelPreferences[] | null {
    return this.get<PixelPreferences[]>('pixel_preferences')
  }

  saveBehaviorData(behavior: any): void {
    this.set('behavior_data', behavior)
  }

  loadBehaviorData(): any {
    return this.get('behavior_data')
  }

  // Cleanup old data
  cleanup(): void {
    const keys = Object.keys(localStorage)
    const now = Date.now()
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days

    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          if (now - item.timestamp > maxAge) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // Remove corrupted data
          localStorage.removeItem(key)
        }
      }
    })
  }
}

export const pixelStorage = PixelStorage.getInstance()
