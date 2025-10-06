# Ghost Studio 🎵

AI-powered music cover generation with Suno API integration and built-in looper for quick demos.

## ✨ Features

- **🎤 Mini DAW & Looper**: Record and layer multiple tracks to create beats
- **🔍 Audio Analysis**: Real-time BPM, key, genre detection using Meyda
- **🎛️ Creative Knobs**: Expressivity, Rareza, Garage, Trash controls
- **🤖 AI Prompt Builder**: Intelligent prompt generation from analysis + knobs
- **🎵 Suno Integration**: Generate covers using Suno Cover API
- **🔄 A/B Player**: Compare original vs generated tracks
- **🎨 SSV-BETA UI**: Cyberpunk glassmorphism interface

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd apps/ghost-studio
npm install
```

### 2. Environment Setup
Copy `env.local.example` to `.env.local` and configure:

```bash
# Suno API Configuration
VITE_SUNO_API_KEY=your_suno_api_key_here

# Supabase Configuration (for audio storage)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Backend URL (if using proxy server)
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Supabase Setup
1. Create a new Supabase project
2. Go to Storage → Create bucket named `ghost-audio`
3. Set bucket to public
4. Configure CORS for your domain

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3001`

## 🎛️ How to Use

### Mini DAW & Looper
1. **Record**: Click "Start Recording" to capture audio
2. **Add to Looper**: Add recorded tracks to the looper
3. **Layer**: Play multiple loops simultaneously
4. **Export**: Export your mix for Ghost Studio analysis

### Ghost Studio Workflow
1. **Upload/Record**: Load audio file or record new content
2. **Analyze**: Automatic BPM, key, genre detection
3. **Customize**: Adjust creative knobs (Expressivity, Rareza, Garage, Trash)
4. **Generate**: Build AI prompt and send to Suno
5. **Compare**: A/B test original vs generated cover

## 🎨 Creative Knobs Explained

- **Expressivity** (0-100): Mood and emotional intensity
  - 0-25: Dark, melancholic
  - 25-50: Balanced, calm
  - 50-75: Happy, energetic
  - 75-100: Euphoric, explosive

- **Rareza** (0-100): Creativity and experimentation
  - 0-20: Traditional, close to original
  - 20-60: Moderate experimentation
  - 60-100: Wildly creative, radical transformation

- **Garage** (0-100): Lo-fi and analog saturation
  - 0-20: Pristine digital production
  - 20-60: Warm analog feel
  - 60-100: Heavy lo-fi aesthetics

- **Trash** (0-100): Distortion and aggressiveness
  - 0-20: Clean and polished
  - 20-60: Gritty distortion
  - 60-100: Extreme industrial brutality

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + SSV-BETA design system
- **Animations**: Framer Motion
- **State**: Zustand
- **Audio**: Web Audio API + Meyda + Tone.js
- **Storage**: Supabase
- **AI**: Suno Cover API

## 📁 Project Structure

```
src/
├── components/
│   ├── upload/AudioUploader.tsx
│   ├── daw/MiniDAW.tsx          # Looper functionality
│   ├── analysis/AudioAnalyzer.tsx
│   ├── prompt/PromptBuilder.tsx
│   ├── generation/GenerationProgress.tsx
│   └── results/ABPlayer.tsx
├── lib/
│   ├── audio/                    # Audio analysis algorithms
│   ├── api/                      # Suno & Supabase integration
│   └── prompt/                   # AI prompt building
├── hooks/                        # Custom React hooks
├── store/                        # Zustand stores
└── types/                        # TypeScript definitions
```

## 🎵 Looper Features

The Mini DAW includes a powerful looper for quick demos:

- **Multi-track Recording**: Record multiple loops
- **Simultaneous Playback**: Layer loops for beats
- **Auto-stop**: 30-second demo limit
- **Export Mix**: Combine loops into single track
- **Visual Feedback**: Real-time status indicators

Perfect for:
- Quick beat creation
- Layering vocals
- Building song structures
- Testing ideas before full production

## 🔐 Security Note

For production, use a backend proxy to hide your Suno API key:

```typescript
// Instead of direct API calls, use your backend
const response = await fetch('/api/suno/cover', {
  method: 'POST',
  body: JSON.stringify(payload)
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Microphone Access**: Ensure browser permissions are granted
2. **Supabase Storage**: Check bucket permissions and CORS settings
3. **Suno API**: Verify API key and endpoint availability
4. **Audio Analysis**: Meyda requires Web Audio API support

### Development Tips

- Use Chrome/Edge for best Web Audio API support
- Check browser console for detailed error messages
- Test with short audio files first (< 10MB)
- Monitor network tab for API call issues

## 🚀 Roadmap

- [ ] Real-time collaboration
- [ ] Advanced audio effects
- [ ] MIDI input support
- [ ] Cloud session storage
- [ ] Mobile app version
- [ ] Plugin system

## 📄 License

MIT License - See LICENSE file for details.

---

**Ghost Studio** - Where AI meets creativity 🎵✨
