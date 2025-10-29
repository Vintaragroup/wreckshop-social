# Wreckshop - Music Industry Data Platform

A comprehensive music industry application focused on promotion data aggregation and deployment of direct-to-consumer marketing based on song releases for Wreckshop Records.

## Features

- **Dashboard**: Real-time platform health monitoring and engagement analytics
- **Audience Management**: Profile aggregation, segmentation, and targeting
- **Campaign Management**: Email, SMS, and journey-based marketing campaigns
- **Content Management**: Artist, release, event, and asset management
- **Integrations**: Social media and music platform connectors
- **Analytics**: Comprehensive performance tracking and insights
- **Compliance**: GDPR, CCPA, and industry compliance management
- **Settings**: Theme selection, user management, and system configuration

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library built on Radix UI
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **Theme**: Dark/Light mode support with Music Tech Purple color scheme

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or extract the exported files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── App.tsx                 # Main application component
├── main.tsx               # React entry point
├── index.html             # HTML template
├── components/            # React components
│   ├── ui/               # Base UI components (buttons, cards, etc.)
│   ├── theme-provider.tsx # Theme management
│   ├── app-shell.tsx     # Main layout and navigation
│   └── [page-components] # Individual page components
├── styles/
│   └── globals.css       # Global styles and theme variables
└── guidelines/
    └── Guidelines.md     # Development guidelines
```

## Theme Customization

The application uses a custom "Music Tech Purple" theme with comprehensive dark/light mode support. Theme variables are defined in `/styles/globals.css` and can be customized by modifying the CSS custom properties.

## Development Guidelines

See `/guidelines/Guidelines.md` for detailed development standards and best practices.

## License

Proprietary - Wreckshop Records