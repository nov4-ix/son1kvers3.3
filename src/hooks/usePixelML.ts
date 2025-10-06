import { useCallback, useEffect, useState } from 'react'
import { usePixelStore } from '@/store/pixelStore'
import { pixelStorage } from '@/lib/storage'
import type { PixelMLModel, PixelPreferences, UserBehavior } from '@/types/pixels'

export function usePixelML() {
  const { 
    enablePixelML, 
    behavior, 
    pixels, 
    setMLModel, 
    mlModel 
  } = usePixelStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [tfjs, setTfjs] = useState<any>(null)

  // Lazy load TensorFlow.js
  useEffect(() => {
    if (!enablePixelML) return

    const loadTFJS = async () => {
      try {
        setIsLoading(true)
        const tf = await import('@tensorflow/tfjs')
        setTfjs(tf)
      } catch (error) {
        console.warn('Failed to load TensorFlow.js:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTFJS()
  }, [enablePixelML])

  // Create simple neural network model
  const createModel = useCallback(() => {
    if (!tfjs) return null

    const model = tfjs.sequential({
      layers: [
        tfjs.layers.dense({
          inputShape: [5], // behavior features
          units: 10,
          activation: 'relu'
        }),
        tfjs.layers.dense({
          units: 5,
          activation: 'sigmoid' // output preferences
        })
      ]
    })

    model.compile({
      optimizer: tfjs.train.adam(0.01),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    })

    return model
  }, [tfjs])

  // Prepare training data from behavior
  const prepareTrainingData = useCallback(() => {
    if (!tfjs || pixels.length === 0) return null

    const features: number[][] = []
    const labels: number[][] = []

    pixels.forEach(pixel => {
      if (pixel.interactionCount > 0) {
        // Input features: interaction count, confidence, time, scroll speed, context
        const inputFeatures = [
          pixel.interactionCount / 10, // normalized
          pixel.confidence,
          new Date().getHours() / 24, // time of day
          behavior.scrollSpeed / 10, // normalized
          behavior.interactions.buttons.length / 10 // normalized
        ]

        // Output labels: preferences
        const outputLabels = [
          pixel.preferences.colorShift,
          pixel.preferences.speedMultiplier,
          pixel.preferences.size,
          pixel.preferences.opacity,
          pixel.preferences.glowIntensity
        ]

        features.push(inputFeatures)
        labels.push(outputLabels)
      }
    })

    if (features.length === 0) return null

    return {
      features: tfjs.tensor2d(features),
      labels: tfjs.tensor2d(labels)
    }
  }, [tfjs, pixels, behavior])

  // Train the model
  const trainModel = useCallback(async () => {
    if (!tfjs || !enablePixelML) return null

    const model = createModel()
    if (!model) return null

    const trainingData = prepareTrainingData()
    if (!trainingData) return null

    try {
      setIsLoading(true)

      // Train the model
      const history = await model.fit(trainingData.features, trainingData.labels, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        verbose: 0
      })

      // Get accuracy
      const accuracy = history.history.accuracy?.[history.history.accuracy.length - 1] || 0

      // Save model to localStorage
      const modelData = await model.save('localstorage://pixel-model')
      
      const mlModel: PixelMLModel = {
        trained: true,
        predictions: {
          colorShift: 0,
          speedMultiplier: 1,
          size: 1,
          opacity: 0.8,
          glowIntensity: 1
        },
        accuracy,
        lastTraining: new Date()
      }

      setMLModel(mlModel)
      pixelStorage.set('ml_model', mlModel)

      return model
    } catch (error) {
      console.error('Training failed:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [tfjs, enablePixelML, createModel, prepareTrainingData, setMLModel])

  // Load saved model
  const loadModel = useCallback(async () => {
    if (!tfjs || !enablePixelML) return null

    try {
      const model = await tfjs.loadLayersModel('localstorage://pixel-model')
      const savedModel = pixelStorage.get<PixelMLModel>('ml_model')
      
      if (savedModel) {
        setMLModel(savedModel)
      }

      return model
    } catch (error) {
      console.warn('Failed to load saved model:', error)
      return null
    }
  }, [tfjs, enablePixelML, setMLModel])

  // Predict preferences
  const predictPreferences = useCallback(async (currentBehavior: UserBehavior): Promise<PixelPreferences | null> => {
    if (!tfjs || !enablePixelML || !mlModel?.trained) return null

    try {
      const model = await tfjs.loadLayersModel('localstorage://pixel-model')
      
      // Prepare input features
      const features = [
        currentBehavior.interactions.buttons.length / 10,
        currentBehavior.scrollSpeed / 10,
        new Date().getHours() / 24,
        Object.keys(currentBehavior.timeOnPage).length / 10,
        currentBehavior.interactions.features.length / 10
      ]

      const input = tfjs.tensor2d([features])
      const prediction = model.predict(input) as any
      const values = await prediction.data()

      const preferences: PixelPreferences = {
        colorShift: values[0],
        speedMultiplier: values[1],
        size: values[2],
        opacity: values[3],
        glowIntensity: values[4]
      }

      // Update model with new predictions
      setMLModel({
        ...mlModel,
        predictions: preferences
      })

      return preferences
    } catch (error) {
      console.error('Prediction failed:', error)
      return null
    }
  }, [tfjs, enablePixelML, mlModel, setMLModel])

  // Initialize ML system
  useEffect(() => {
    if (!enablePixelML || !tfjs) return

    const initializeML = async () => {
      const savedModel = await loadModel()
      if (!savedModel) {
        // No saved model, will train when enough data is available
        console.log('No saved ML model found, will train when data is available')
      }
    }

    initializeML()
  }, [enablePixelML, tfjs, loadModel])

  return {
    isLoading,
    mlModel,
    trainModel,
    predictPreferences,
    loadModel,
    isEnabled: enablePixelML && !!tfjs
  }
}
