import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sand: '#f1ebe2',
          ink: '#1a1a1a',
          clay: '#8b5e3c',
          sage: '#4e6650',
          pine: '#2f3d31',
          cloud: '#f8f5f1'
        }
      },
      boxShadow: {
        panel: '0 18px 40px -24px rgba(20, 20, 20, 0.35)',
      }
    },
  },
  plugins: [],
};

export default config;