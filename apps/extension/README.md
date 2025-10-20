# Bookmark Manager Extension

A powerful and intuitive browser extension for managing bookmarks, built with React, TypeScript, and Tailwind CSS.

## Features

- 📚 **Bookmark Management**: View, add, edit, and delete bookmarks with ease
- 🔍 **Smart Search**: Quickly find bookmarks by title or URL
- ⚡ **Quick Add**: Add current page to bookmarks with keyboard shortcuts
- 🎨 **Modern UI**: Clean and responsive design using shadcn/ui components
- ⚙️ **Customizable Settings**: Configure bookmark behavior and preferences
- 📱 **Responsive Design**: Works perfectly in popup and full-page modes
- 🗂️ **Folder Support**: Organize bookmarks in folders
- 📤 **Export/Import**: Backup and restore your bookmarks
- 🔥 **Recent Bookmarks**: Quick access to recently added bookmarks

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Development)

1. Clone the repository and navigate to the extension directory:
   ```bash
   cd apps/extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the extension directory

## Usage

### Adding Bookmarks

- **Current Page**: Click the extension icon and press the "+" button, or use `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
- **Any Page**: Right-click on any link and select "Add to Bookmarks" from the context menu

### Managing Bookmarks

- **View All**: Click the extension icon to see all your bookmarks
- **Search**: Use the search bar in the popup to find specific bookmarks
- **Edit**: Click the settings icon next to any bookmark to edit its title or URL
- **Delete**: Click the trash icon next to any bookmark to remove it
- **Open**: Click on any bookmark to open it in a new tab

### Settings

- Access settings by clicking the gear icon in the popup or opening the extension's options page
- Configure sorting preferences, recent bookmarks limit, and other options
- Export your bookmarks as a JSON file for backup
- Clear extension cache if needed

## Keyboard Shortcuts

- `Alt+B`: Open the bookmark manager
- `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac): Add current page to bookmarks
- `Ctrl+F`: Focus search bar when popup is open

## Project Structure

```
src/
├── background/           # Background script for Chrome APIs
│   └── background.ts
├── content/             # Content script for web page interaction
│   └── content-script.ts
├── popup/               # Main popup UI
│   ├── Popup.tsx
│   └── index.tsx
├── options/             # Options/settings page
│   ├── Options.tsx
│   └── index.tsx
├── services/            # API services
│   └── bookmarks.ts
├── hooks/               # React hooks
│   └── useBookmarks.ts
├── types/               # TypeScript types
│   └── index.ts
├── lib/                 # Utility libraries
│   ├── ui/             # UI components
│   └── utils.ts
└── styles/             # CSS styles
    └── index.css
```

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Chrome Extensions API**: For bookmark management and browser integration
- **Lucide React**: Beautiful and consistent icons
- **clsx & tailwind-merge**: For conditional styling

## Development

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Chrome browser for testing

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Clean build directory:
   ```bash
   npm run clean
   ```

### Development Tips

- The extension uses manifest v3 for better security and performance
- Background script runs as a service worker
- Content script is injected into all web pages for enhanced functionality
- Use Chrome DevTools to debug the extension components
- Check `chrome://extensions/` for extension errors and logs

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Permissions

The extension requires the following permissions:

- `bookmarks`: To read and modify browser bookmarks
- `activeTab`: To get information about the current active tab
- `storage`: To save extension settings and preferences
- `contextMenus`: To add bookmark options to right-click menus
- `host_permissions`: To inject content scripts for enhanced functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions for improvements, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information about the problem
3. Include your browser version and extension version

## Roadmap

- [ ] Bookmark synchronization across devices
- [ ] Import from other bookmark managers
- [ ] Advanced bookmark organization features
- [ ] Bookmark tags and labels
- [ ] Dark mode support
- [ ] Bookmark statistics and insights
- [ ] Browser bookmark bar integration
- [ ] Bookmark sharing capabilities

---

Built with ❤️ using modern web technologies.