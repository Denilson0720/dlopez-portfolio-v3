# Denilson Lopez Portfolio v3

A modern, dark-themed portfolio website built with Next.js, featuring a hero landing page and a split-view navigation system with smooth scroll animations.

## Features

- 🎨 Beautiful hero landing page with desert landscape background
- 📱 Split-view portfolio layout with animated sidebar
- ✨ Smooth scroll animations and transitions
- 🎯 Active section highlighting with scroll spy
- 🌙 Dark theme with accent colors
- 📱 Responsive design

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React**

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dlopez_portfolio_v3/
├── app/
│   ├── components/
│   │   ├── Hero/          # Hero page components
│   │   ├── Portfolio/     # Portfolio layout components
│   │   ├── Sections/      # Content sections
│   │   └── UI/            # Reusable UI components
│   ├── portfolio/         # Portfolio page route
│   ├── blog/              # Blog page route
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Hero landing page
│   └── globals.css        # Global styles
├── lib/
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
└── types/                 # TypeScript type definitions
```

## Key Features Implementation

### Animated Name
The "Denilson Lopez" name animates from center (hero page) to left sidebar (portfolio page) using Framer Motion's scroll-based animations.

### Split View Navigation
- Left sidebar with navigation links
- Right content area with scrollable sections
- Active section highlighting based on scroll position

### Sections
- About Me
- Work Experience
- Projects
- Contact

## Customization

### Update Content
Edit `app/data.ts` to update:
- Work experience
- Skills
- About text

### Styling
Modify `tailwind.config.ts` and `app/globals.css` for custom colors and styles.

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

