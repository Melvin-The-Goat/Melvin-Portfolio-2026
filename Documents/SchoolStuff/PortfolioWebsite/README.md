# Game Developer Portfolio Website

A modern, responsive portfolio website built with React and Tailwind CSS featuring a dark-themed developer aesthetic.

## Features

- **Hero Section**: Eye-catching title, subtitle, and CTA button
- **Filterable Projects**: Grid layout with filtering by category (Game Dev, Software) and tech stack
- **Art Gallery**: Masonry grid layout for 3D models and concept art
- **About Section**: Education and skills showcase
- **Contact/Footer**: Social links and contact information

## Tech Stack

- React 18
- Tailwind CSS
- Vite
- Lucide React (icons)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ProjectCard.jsx    # Reusable project card component
│   │   └── ArtCard.jsx        # Art gallery card component
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind CSS imports
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Customization

- Update project data in `src/App.jsx` (projects array)
- Modify art gallery items in `src/App.jsx` (artworks array)
- Update contact links in the Contact section
- Adjust colors and styling in `tailwind.config.js`

## License

MIT

