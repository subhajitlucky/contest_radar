// Ultimate Contest Radar - Modern PostCSS Configuration
// Enhanced with latest plugins for 2025 development

const config = {
  plugins: {
    // Import CSS files and handle @import rules
    'postcss-import': {},
    
    // Enable CSS nesting for better selector organization
    'postcss-nesting': {},
    
    // Transform modern CSS features for better browser support
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-selectors': true,
        'attribute-case-insensitive': true,
        'focus-within-pseudo-class': true,
        'focus-visible-pseudo-class': true,
        'has-pseudo-class': true,
        'image-set-function': true,
        'logical-properties-and-values': true,
        'match-nearest-pseudo-class': true,
        'not-pseudo-class': true,
        'pseudo-classes': true,
        'pseudo-elements': true,
        'space-pseudo-separator': true,
      },
    },
    
    // Handle custom media queries
    'postcss-custom-media': {
      importFrom: [
        {
          customMedia: {
            '--sm': '(min-width: 640px)',
            '--md': '(min-width: 768px)',
            '--lg': '(min-width: 1024px)',
            '--xl': '(min-width: 1280px)',
            '--2xl': '(min-width: 1536px)',
            '--motion-reduce': '(prefers-reduced-motion: reduce)',
            '--motion-safe': '(prefers-reduced-motion: no-preference)',
            '--color-scheme-light': '(prefers-color-scheme: light)',
            '--color-scheme-dark': '(prefers-color-scheme: dark)',
          },
        },
      ],
    },
    
    // Automatically add vendor prefixes
    autoprefixer: {
      grid: 'autoplace',
      flexbox: 'no-2009',
      supports: true,
    },
    
    // Tailwind CSS 4 integration
    '@tailwindcss/postcss': {},
    
    // Minify CSS in production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: 'default',
        discardComments: {
          removeAll: true,
        },
      },
    }),
  },
};

export default config;
