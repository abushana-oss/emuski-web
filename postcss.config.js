const config = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? [
      ['@fullhuman/postcss-purgecss', {
        content: [
          './app/**/*.{js,jsx,ts,tsx}',
          './src/**/*.{js,jsx,ts,tsx}',
          './components/**/*.{js,jsx,ts,tsx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [
            'html', 'body',
            /^PhoneInput/, // React phone number input
            /^recaptcha/, // reCAPTCHA
            /^grecaptcha/,
            /data-/, // Data attributes
            /aria-/, // ARIA attributes
            // EMUSKI brand colors
            /^bg-emuski-/,
            /^text-emuski-/,
            /^border-emuski-/,
            /^from-emuski-/,
            /^via-emuski-/,
            /^to-emuski-/,
            // Color classes
            /^bg-gray-/,
            /^text-gray-/,
            /^border-gray-/,
            /^bg-white/,
            /^text-white/,
            /^bg-slate-/,
            /^text-slate-/,
            /^border-slate-/,
            /^bg-blue-/,
            /^text-blue-/,
            /^from-blue-/,
            /^via-blue-/,
            /^to-blue-/,
            /^bg-cyan-/,
            /^from-cyan-/,
            /^via-cyan-/,
            /^to-cyan-/,
            /^bg-teal-/,
            /^from-teal-/,
            /^via-teal-/,
            /^to-teal-/,
            /^bg-purple-/,
            /^from-purple-/,
            /^via-purple-/,
            /^to-purple-/,
            /^bg-pink-/,
            /^from-pink-/,
            /^via-pink-/,
            /^to-pink-/,
            // Layout and spacing
            /^w-/,
            /^h-/,
            /^min-w-/,
            /^min-h-/,
            /^max-w-/,
            /^max-h-/,
            /^gap-/,
            /^space-/,
            /^p-/,
            /^py-/,
            /^px-/,
            /^pt-/,
            /^pb-/,
            /^pl-/,
            /^pr-/,
            /^m-/,
            /^my-/,
            /^mx-/,
            /^mt-/,
            /^mb-/,
            /^ml-/,
            /^mr-/,
            // Flex and grid
            /^flex/,
            /^grid/,
            /^items-/,
            /^justify-/,
            /^self-/,
            // Opacity and transforms
            /^opacity-/,
            /^scale-/,
            /^translate-/,
            /^rotate-/,
            // Shadows and effects
            /^shadow-/,
            /^rounded-/,
            /^blur-/,
            // Overflow and scrollbar
            /^overflow-/,
            /^scrollbar-/,
            /scrollbar-thin/,
            /scrollbar-track-/,
            /scrollbar-thumb-/,
            // Filters and effects
            /^grayscale/,
            /^brightness-/,
            /^invert/,
            /^filter/,
            /^contrast-/,
            /^saturate-/,
            /^hue-rotate-/,
            /^backdrop-/,
            // Background utilities with arbitrary values
            /^bg-\[/,
            /^from-\[/,
            /^to-\[/,
            /^via-\[/,
          ],
          deep: [
            /PhoneInput/,
            /recaptcha/,
            /sonner/, // Toast notifications
            /emuski/,
          ],
          greedy: [
            /^animate-/,
            /^transition-/,
            /^hover:/,
            /^focus:/,
            /^active:/,
            /^data-\[state/,
            /^group-hover:/,
            /^group-focus:/,
            /^group-active:/,
            // Responsive prefixes
            /^sm:/,
            /^md:/,
            /^lg:/,
            /^xl:/,
            /^2xl:/,
          ]
        },
        // Don't remove CSS from node_modules that we need
        blocklist: [],
      }],
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