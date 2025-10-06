# Pixel Learning System Documentation

## Overview

The Pixel Learning System is a behavior-driven adaptive visual system that learns from user interactions and reflects them in real-time visuals. It combines realistic behavior tracking, simple heuristic adaptation, and optional machine learning to create personalized visual experiences.

## Architecture

### Core Components

1. **Behavior Tracker** (`useBehaviorTracker`)
   - Tracks click, hover, scroll, and keyboard interactions
   - Creates grid-based heatmaps
   - Throttles events for performance

2. **Adaptive Pixels** (`useAdaptivePixels`)
   - Manages 10,000 adaptive pixels
   - Implements realistic learning algorithms
   - Handles pixel adaptation based on interactions

3. **Simple Adaptation** (`useSimpleAdaptation`)
   - Provides heuristic-based adaptations
   - Quick theme and style changes
   - Manual preference controls

4. **Machine Learning** (`usePixelML`)
   - Optional TensorFlow.js integration
   - Trains models on user behavior
   - Predicts user preferences

### Data Flow

```
User Interaction → Behavior Tracker → Adaptive Pixels → Visual Update
                     ↓
                 Heatmap Data → Dashboard → User Feedback
                     ↓
                 Storage (localStorage + optional Supabase)
```

## Feature Flags

### Environment Variables

```env
# Enable behavior learning system
VITE_ENABLE_PIXEL_LEARNING=true

# Enable machine learning features
VITE_ENABLE_PIXEL_ML=false

# Optional Supabase integration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Feature Combinations

| Learning | ML | Supabase | Description |
|----------|----|---------|-------------|
| ✅ | ❌ | ❌ | Basic behavior tracking only |
| ✅ | ❌ | ✅ | Behavior tracking + cloud backup |
| ✅ | ✅ | ❌ | Full local learning system |
| ✅ | ✅ | ✅ | Complete system with cloud ML |

## Usage Patterns

### Basic Integration

```tsx
import { AdaptivePixelsCanvas } from '@/components/AdaptivePixelsCanvas'

function MyApp() {
  return (
    <div className="relative">
      <MyAppContent />
      <AdaptivePixelsCanvas 
        width={800}
        height={600}
        density={0.8}
      />
    </div>
  )
}
```

### Advanced Configuration

```tsx
import { usePixelStore } from '@/store/pixelStore'
import { useAdaptivePixels } from '@/hooks/useAdaptivePixels'

function AdvancedApp() {
  const { setMode, setContext } = usePixelStore()
  const { saveUserProfile } = useAdaptivePixels()

  useEffect(() => {
    setMode('real')
    setContext('nova-pilot')
  }, [])

  return (
    <div>
      <AdaptivePixelsCanvas />
      <button onClick={saveUserProfile}>
        Save Learning Progress
      </button>
    </div>
  )
}
```

### Dashboard Integration

```tsx
import { PixelLearningDashboard } from '@/components/PixelLearningDashboard'

function AppWithDashboard() {
  return (
    <div>
      <AdaptivePixelsCanvas />
      <PixelLearningDashboard />
    </div>
  )
}
```

## Performance Considerations

### Optimization Strategies

1. **Canvas Rendering**
   - Use `requestAnimationFrame` for smooth 60fps
   - Implement pixel culling for off-screen pixels
   - Use hardware-accelerated canvas operations

2. **Event Handling**
   - Throttle mouse move events (16ms)
   - Debounce scroll events (100ms)
   - Use passive event listeners

3. **Memory Management**
   - Limit heatmap data to recent interactions
   - Clean up old ML models
   - Implement pixel pooling for large counts

### Performance Targets

- **Frame Rate**: 60fps with 10,000 pixels
- **Memory Usage**: < 50MB for full system
- **Bundle Size**: < 2MB (without ML features)
- **ML Bundle**: +3MB when enabled

## Machine Learning Integration

### Model Architecture

```typescript
// Simple neural network for preference prediction
const model = tf.sequential({
  layers: [
    tf.layers.dense({
      inputShape: [5], // behavior features
      units: 10,
      activation: 'relu'
    }),
    tf.layers.dense({
      units: 5, // output preferences
      activation: 'sigmoid'
    })
  ]
})
```

### Training Data

Input features:
- Interaction count (normalized)
- Confidence score
- Time of day
- Scroll speed
- Button usage

Output labels:
- Color shift preference
- Speed multiplier
- Size preference
- Opacity preference
- Glow intensity

### Model Persistence

- Models saved to `localstorage://pixel-model`
- Training data cached for retraining
- Accuracy metrics tracked
- Automatic model updates

## Storage Strategy

### Local Storage (Primary)

```typescript
// Automatic versioning and validation
const storageItem = {
  version: '1.0.0',
  data: userProfile,
  timestamp: Date.now()
}
```

### Supabase (Optional)

```sql
-- Cloud backup for pro users
CREATE TABLE pixel_profiles (
  user_id UUID PRIMARY KEY,
  pixel_preferences JSONB,
  avg_color TEXT,
  avg_speed FLOAT,
  total_interactions BIGINT,
  last_update TIMESTAMPTZ
);
```

### Data Cleanup

- Local storage: 30-day retention
- Supabase: 90-day retention for inactive models
- Automatic cleanup functions

## Testing Strategy

### Unit Tests

```bash
# Test behavior tracking
npm run test behaviorTracker

# Test pixel adaptation
npm run test adaptivePixels

# Test storage persistence
npm run test storage
```

### Integration Tests

```bash
# Test full system
npm run test integration

# Test ML features
npm run test ml
```

### Performance Tests

```bash
# Test rendering performance
npm run test performance

# Test memory usage
npm run test memory
```

## Deployment Considerations

### Build Optimization

```typescript
// Vite configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          ml: ['@tensorflow/tfjs'] // Only when enabled
        }
      }
    }
  }
})
```

### Environment Configuration

```env
# Production settings
VITE_ENABLE_PIXEL_LEARNING=true
VITE_ENABLE_PIXEL_ML=false
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### CDN Optimization

- Static assets served from CDN
- Canvas rendering optimized for mobile
- Progressive enhancement for older browsers

## Troubleshooting

### Common Issues

1. **Performance Issues**
   - Reduce pixel count
   - Disable ML features
   - Check for memory leaks

2. **Storage Issues**
   - Clear localStorage
   - Check Supabase permissions
   - Verify environment variables

3. **ML Issues**
   - Ensure TensorFlow.js loads
   - Check training data quality
   - Verify model persistence

### Debug Mode

```env
VITE_DEBUG_MODE=true
VITE_SHOW_FPS=true
VITE_LOG_INTERACTIONS=true
```

## Future Enhancements

### Planned Features

1. **Advanced ML Models**
   - Convolutional networks for spatial patterns
   - Recurrent networks for temporal patterns
   - Transfer learning from user populations

2. **Real-time Collaboration**
   - Multi-user pixel interactions
   - Shared learning experiences
   - Collaborative adaptation

3. **Extended Contexts**
   - Time-based adaptations
   - Weather integration
   - Device-specific behaviors

### API Extensions

```typescript
// Future API design
interface PixelLearningAPI {
  // Advanced analytics
  getBehaviorInsights(): Promise<BehaviorInsights>
  
  // Collaborative features
  shareLearningProfile(): Promise<ShareToken>
  
  // Extended contexts
  setContext(context: ExtendedContext): void
}
```

## Contributing

### Development Setup

1. Fork the repository
2. Install dependencies: `npm install`
3. Set up environment: `cp env.local.example .env.local`
4. Run tests: `npm run test`
5. Start development: `npm run dev`

### Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Test coverage > 80%
- Performance benchmarks
- Documentation updates

### Pull Request Process

1. Create feature branch
2. Add tests for new functionality
3. Update documentation
4. Ensure performance targets
5. Submit PR with detailed description

---

**Built for the Son1kVers3 ecosystem with ❤️**
