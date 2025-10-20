# Vite Shadcn Boilerplate Monorepo

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-username/vite-shadcn-boilerplate/blob/main/LICENSE)

## Overview

A modern monorepo setup with Vite, React, TypeScript, and shadcn/ui components. This repository serves as a comprehensive starter template for building multiple applications that share common UI components and utilities.

## Structure

```
├── apps/
│   ├── website/          # Main web application
│   └── extension/        # Browser extension
├── packages/
│   └── ui/              # Shared UI components
└── package.json         # Root workspace configuration
```

## Features

- **Monorepo Architecture**: Organized workspace with shared packages and multiple applications
- **Vite**: Lightning-fast development server and build tool for modern web development
- **shadcn/ui**: A collection of re-usable components built using Radix UI and Tailwind CSS
- **React**: A popular JavaScript library for building user interfaces
- **Tailwind CSS**: A utility-first CSS framework that provides a set of pre-designed styles for rapid UI development
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and developer productivity
- **npm Workspaces**: Efficient dependency management and script execution across packages

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Fork the Repository**: Start by forking this repository to your GitHub account.

2. **Clone the Repository**: Clone your forked repository locally using the following command:

    ```bash
    git clone https://github.com/your-username/vite-shadcn-boilerplate.git
    ```

    ```bash
    cd vite-shadcn-boilerplate
    npm install
    ```

### Development

#### Website

```bash
# Run the website development server
npm run dev:website
# or simply
npm run dev
```

#### Extension

```bash
# Run the extension development server
npm run dev:extension
```

### Building

#### Build all projects

```bash
npm run build
```

#### Build individual projects

```bash
npm run build:website
npm run build:extension
```

### Workspace Management

This project uses npm workspaces to manage multiple packages. Each app and package has its own `package.json` file.

#### Available Scripts

- `npm run dev` - Start website development server
- `npm run dev:website` - Start website development server
- `npm run dev:extension` - Start extension development server
- `npm run build` - Build all projects
- `npm run build:website` - Build website only
- `npm run build:extension` - Build extension only
- `npm run lint` - Lint all projects
- `npm run clean` - Clean all build outputs

#### Working with Workspaces

```bash
# Install a dependency to a specific workspace
npm install lodash --workspace=apps/website

# Run a script in a specific workspace
npm run build --workspace=apps/extension

# Add a dependency to all workspaces
npm install --workspaces some-package
```

## Apps

### Website (`apps/website`)

A React application built with Vite, TypeScript, and Tailwind CSS, featuring shadcn/ui components.

### Extension (`apps/extension`)

A browser extension built with the same tech stack as the website, demonstrating code sharing in a monorepo.

## Packages

### UI (`packages/ui`)

A shared component library containing reusable UI components built with:

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI primitives

## Development Workflow

1. **Shared Components**: Add reusable components to `packages/ui`
2. **App-Specific Code**: Keep app-specific code in their respective `apps/` directories
3. **Cross-Package Dependencies**: Reference shared packages using workspace protocol in package.json

## Technologies

- **Vite** - Build tool and development server
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built using Radix UI and Tailwind CSS
- **npm Workspaces** - Monorepo management
- **eslint**: A pluggable linting utility for JavaScript and JSX.
- **eslint-plugin-react-hooks**: ESLint plugin for React hooks.
- **eslint-plugin-react-refresh**: ESLint plugin for React Refresh.
- **postcss**: A tool for transforming styles with JavaScript plugins.
- **tailwindcss**: A utility-first CSS framework for rapidly building custom designs.
- **typescript**: A superset of JavaScript that adds static types.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests to enhance this boilerplate and make it even more powerful.

---

**Happy coding!** 🚀
