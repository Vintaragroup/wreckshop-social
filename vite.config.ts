
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';
  import { fileURLToPath } from 'url';

  // __dirname shim for ESM/TS config
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
  '@marketing-core': path.resolve(__dirname, './src/components/marketing-core'),
  '@marketing-site/components': path.resolve(__dirname, './apps/marketing-site/src/components'),
  '@marketing-site/pages': path.resolve(__dirname, './apps/marketing-site/src/pages'),
  '@marketing-site': path.resolve(__dirname, './apps/marketing-site/src'),
      },
    },
    optimizeDeps: {
      include: [
        '@marketing-site/pages/PrivacyPolicy',
        '@marketing-site/pages/TermsOfService',
        '@marketing-site/pages/Security',
        '@marketing-site/pages/About',
        '@marketing-site/pages/Contact',
        '@marketing-site/pages/Integrations',
        '@marketing-site/pages/CookiePolicy',
        '@marketing-site/pages/Blog',
        '@marketing-site/pages/CaseStudies',
        '@marketing-site/pages/Careers',
        '@marketing-site/pages/Status',
        '@marketing-site/pages/Documentation',
        '@marketing-site/pages/DoNotSell',
        '@marketing-site/pages/SignIn',
        '@marketing-site/pages/SignUp',
        '@marketing-site/pages/Artists',
        '@marketing-site/pages/Labels',
        '@marketing-site/pages/Promoters',
        '@marketing-site/pages/Community',
        '@marketing-site/pages/Academy',
        '@marketing-site/pages/DiscoveryEngine',
        '@marketing-site/pages/AnalyticsDashboard',
        '@marketing-site/pages/GeofencingSegmentation',
        '@marketing-site/pages/CampaignOrchestration',
        '@marketing-site/components/Navigation',
        '@marketing-site/components/Hero',
        '@marketing-site/components/Features',
        '@marketing-site/components/HowItWorks',
        '@marketing-site/components/UseCases',
        '@marketing-site/components/Testimonials',
        '@marketing-site/components/DataPrivacy',
        '@marketing-site/components/Pricing',
        '@marketing-site/components/Footer',
      ],
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      host: '0.0.0.0',
      port: 5176,
      // Disable auto-opening the browser to avoid xdg-open errors in containers
      open: false,
      fs: {
        // Explicitly allow serving files from the marketing-site workspace folder
        allow: [
          // Project root and node_modules (required for CSS and assets from dependencies)
          path.resolve(__dirname),
          path.resolve(__dirname, './node_modules'),
          // App source trees
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './apps/marketing-site/src'),
        ],
      },
      // Allow ngrok domain and other hosts for development
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'wreckshop.ngrok.app',
        '*.ngrok.app',
        '*.ngrok.io',
      ],
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || 'http://backend:4002',
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: process.env.API_PROXY_TARGET || 'http://backend:4002',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });