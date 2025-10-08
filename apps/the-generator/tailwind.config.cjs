module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#0A0C10',
        cyan: '#00FFE7',
        magenta: '#B84DFF',
        'accent-cyan': '#9AF7EE',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
