const config = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? [
      ['cssnano', {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifySelectors: true,
          reduceIdents: false, // Prevent breaking animations
          zindex: false, // Prevent z-index optimization
        }]
      }]
    ] : []),
  ],
}

export default config