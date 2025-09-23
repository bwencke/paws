# Paws Volunteer Hours Manager

Paws Volunteer Hours Manager is a web application built with React, Vite, and Ionic, designed to help organizations track and visualize volunteer hours. It features user authentication, data visualization, and easy management of volunteer activities.

## Features
- User authentication via Supabase
- Add, edit, and view volunteer hours
- Data visualization with pie charts and grouped monthly views
- Admin management pages
- Responsive UI with Ionic components
- Cypress end-to-end testing

## Project Structure
- `src/` - Main source code
  - `components/` - React components
  - `hooks/` - Custom React hooks
  - `pages/` - Application pages
  - `theme/` - CSS variables and styles
  - `types/` - TypeScript types
  - `utils/` - Utility functions
- `lib/` - Supabase integration
- `public/` - Static assets
- `cypress/` - End-to-end tests
- `android/` - Android build files for Capacitor

## Getting Started

### Prerequisites
- Node.js (>= 16)
- npm or yarn
- Supabase project (for authentication and data)
- Capacitor CLI (for mobile builds)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm run test
```

### Mobile (Android)
1. Build the web app:
    ```bash
    npm run build
    ```
2. Copy files to Android:
    ```bash
    npx cap sync android
    ```
3. Open Android Studio:
    ```bash
    npx cap open android
    ```

## Configuration
- Supabase settings are in `lib/supabase.ts`
- Capacitor configuration is in `capacitor.config.ts`
- Vite configuration is in `vite.config.ts`

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
