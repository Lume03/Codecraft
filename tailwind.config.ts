import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: theme('colors.zinc.200'),
            a: { color: theme('colors.sky.400'), textDecoration: 'none' },
            h1: { color: theme('colors.zinc.50') },
            h2: { color: theme('colors.zinc.50') },
            h3: { color: theme('colors.zinc.50') },
            strong: { color: theme('colors.zinc.50') },
            code: {
              backgroundColor: theme('colors.zinc.800'),
              padding: '0.2rem 0.35rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },

            pre: {
              backgroundColor: theme('colors.zinc.900'),
              color: theme('colors.zinc.50'),
              borderRadius: '0.75rem',
              padding: '1rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              border: `1px solid ${theme('colors.zinc.800')}`,
            },

            table: {
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              border: `1px solid ${theme('colors.zinc.800')}`,
              borderRadius: '0.5rem',
              overflow: 'hidden',
            },
            thead: {
              backgroundColor: theme('colors.zinc.900'),
            },
            'thead th': {
              padding: '0.625rem 0.75rem',
              textAlign: 'left',
              borderBottom: `1px solid ${theme('colors.zinc.800')}`,
              fontWeight: '700',
              color: theme('colors.zinc.100'),
            },
            'tbody td': {
              padding: '0.625rem 0.75rem',
              borderBottom: `1px solid ${theme('colors.zinc.800')}`,
              verticalAlign: 'top',
            },
            'tbody tr:last-child td': {
              borderBottom: '0',
            },

            blockquote: {
              borderLeftColor: theme('colors.zinc.700'),
              color: theme('colors.zinc.200'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.zinc.200'),
          },
        },
      }),
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-body)', 'sans-serif'],
        code: ['var(--font-code)', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;

export default config;
