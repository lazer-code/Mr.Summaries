# Mr.Summaries - React Native Mobile App

A React Native mobile application for managing academic knowledge including summaries, notebooks, and calendar/tasks.

## Overview

Mr.Summaries is an academic knowledge platform converted from a Next.js web application to a React Native mobile app using Expo. It provides three main platforms:

- **Summaries** - Browse and share course summaries with rich content support
- **Notebooks** - Digital note-taking with drawing capabilities
- **Calendar & Tasks** - Schedule and task management

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **Storage**: AsyncStorage for local data persistence
- **State Management**: Zustand (from original web app)
- **UI Components**: Custom components with React Native StyleSheet
- **Drawing**: @shopify/react-native-skia (for notebooks)
- **Calendar**: react-native-calendars (planned)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For Android development:
  - Android Studio
  - Android SDK (API 21+)
  - Android emulator or physical device

## Installation

1. Navigate to the mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open the Expo DevTools in your browser.

### Run on Android

Using an emulator:
```bash
npm run android
```

Using a physical device:
1. Install the Expo Go app from Google Play Store
2. Scan the QR code shown in the terminal or browser

### Run on Web (for testing)

```bash
npm run web
```

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/              # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SummariesScreen.tsx
│   │   ├── SummaryDetailScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── NotebooksScreen.tsx
│   │   └── NotebookEditorScreen.tsx
│   ├── components/           # Reusable components
│   │   ├── home/
│   │   │   └── PlatformCard.tsx
│   │   ├── summaries/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   └── SummaryUploadForm.tsx
│   │   ├── calendar/         # (To be implemented)
│   │   ├── notebooks/        # (To be implemented)
│   │   └── common/           # (To be implemented)
│   ├── navigation/           # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── types/                # TypeScript type definitions
│   │   ├── summary.ts
│   │   ├── task.ts
│   │   ├── event.ts
│   │   └── notebook.ts
│   ├── lib/                  # Utilities and mock data
│   │   ├── mock-data.ts
│   │   ├── mock-tasks.ts
│   │   ├── mock-notebooks.ts
│   │   ├── calendar-utils.ts
│   │   └── utils.ts
│   └── styles/               # Styling and theming
│       ├── colors.ts
│       ├── theme.ts
│       └── ThemeContext.tsx
├── assets/                   # Images, fonts, etc.
├── App.tsx                   # Root component
├── app.json                  # Expo configuration
├── package.json
└── tsconfig.json
```

## Features

### Implemented ✅
- ✅ Home screen with platform cards
- ✅ Summaries listing with search
- ✅ Summary detail view
- ✅ Summary upload form
- ✅ Dark mode support
- ✅ Theme context and styling system
- ✅ Navigation between screens
- ✅ Responsive layout

### In Progress 🚧
- 🚧 Calendar & Tasks functionality
- 🚧 Notebooks functionality
- 🚧 Drawing canvas for notebooks
- 🚧 LaTeX rendering for summaries
- 🚧 Complete Calendar implementation with react-native-calendars

### Planned 📋
- 📋 Data persistence with AsyncStorage
- 📋 Enhanced LaTeX/markdown rendering
- 📋 Task and event management
- 📋 Advanced notebook features

## Dark Mode

The app supports both light and dark modes. The theme is automatically detected from the system settings and can be toggled within the app using the ThemeContext.

## Styling

The app uses a custom theming system built with React Native StyleSheet:

- **Colors**: Defined in `src/styles/colors.ts`
- **Theme**: Theme utilities in `src/styles/theme.ts`
- **Context**: Theme state management in `src/styles/ThemeContext.tsx`

Color scheme:
- Primary: Blue (#2563eb)
- Accent: Indigo
- Supports full dark mode with appropriate color adjustments

## Building for Production

### Android APK

To build an Android APK:

```bash
expo build:android
```

Or using EAS Build (recommended):

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android
```

## Configuration

### Android Specific

- **Minimum SDK**: API Level 21 (Android 5.0)
- **Package Name**: com.mrsummaries.app
- **Adaptive Icon**: Blue background (#2563eb)

### App Settings

App configuration is in `app.json`:
- App name: "Mr.Summaries"
- Supports portrait orientation
- Automatic theme (light/dark)

## Development Tips

1. **Hot Reload**: Changes to your code will automatically reload in the app
2. **Debugging**: Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open the dev menu
3. **Console Logs**: View logs in the terminal where `expo start` is running
4. **Type Safety**: The project uses TypeScript for type safety - run `tsc --noEmit` to check for type errors

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
expo start -c  # Clear cache
```

**Android build issues:**
```bash
cd android && ./gradlew clean
cd .. && npx expo run:android
```

**Dependency issues:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Contributing

This is a conversion project from the Next.js web application. When adding features:

1. Maintain consistency with the web app's functionality
2. Follow the existing code structure
3. Use TypeScript for all new files
4. Follow the theming system for styling
5. Ensure dark mode compatibility

## Migration from Web App

This mobile app was converted from the Next.js web application. Key changes:

- Next.js routing → React Navigation
- Tailwind CSS → React Native StyleSheet with custom theme system
- Web components → React Native components
- localStorage → AsyncStorage (planned)
- next/link → Navigation hooks

## License

Same as the original Mr.Summaries project.

## Support

For issues or questions, please refer to the main Mr.Summaries repository.
