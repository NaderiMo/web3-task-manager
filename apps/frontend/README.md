# Web3 Task Manager Frontend

A modern React application with Web3 authentication using Tailwind CSS for styling.

## Features

- 🔐 **Web3 Authentication**: Connect and authenticate using MetaMask
- 🎨 **Tailwind CSS**: Modern, utility-first CSS framework
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast Development**: Vite + React + TypeScript
- 🎯 **Zustand State Management**: Simple and performant state management

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Vite** for fast development
- **MetaMask** integration for Web3

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- MetaMask browser extension

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

## Tailwind CSS

This project uses Tailwind CSS for styling. Key features:

### Custom Components

- `.btn-primary`: Primary action buttons with gradient background
- `.btn-secondary`: Secondary buttons with transparent background
- `.btn-danger`: Danger buttons (logout, delete actions)
- `.auth-container`: Authentication container with gradient background
- `.error-message`: Error message styling
- `.task-manager`: Main container styling
- `.header`: Header component styling
- `.tasks-container`: Tasks container styling

### Custom Colors

- `primary`: Blue color palette
- `gradient`: Purple gradient colors
- `button`: Button-specific colors

### Animations

- `fade-in`: Fade in animation
- `slide-up`: Slide up animation
- Built-in Tailwind animations (spin, etc.)

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskManager.tsx # Main task management component
│   └── LoadingSpinner.tsx # Loading spinner component
├── stores/             # Zustand stores
│   ├── web3Store.ts    # Web3 wallet state management
│   └── authStore.ts    # Authentication state management
├── types/              # TypeScript type definitions
│   └── global.d.ts     # Global type declarations
├── App.tsx             # Main application component
├── App.css             # App-specific styles
└── index.css           # Global styles and Tailwind imports
```

## Development

### Adding New Components

When creating new components, use Tailwind classes for styling:

```tsx
const MyComponent = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Component Title</h2>
      <p className="text-gray-600">Component content</p>
    </div>
  );
};
```

### Custom Styling

For custom styles that can't be achieved with Tailwind utilities, use the `@layer` directive in `index.css`:

```css
@layer components {
  .my-custom-class {
    @apply bg-blue-500 text-white px-4 py-2 rounded;
  }
}
```

## Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Contributing

1. Follow the existing code style
2. Use Tailwind classes for styling
3. Add TypeScript types for new components
4. Test your changes thoroughly
