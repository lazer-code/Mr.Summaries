# Mr.Summaries

An academic knowledge platform for managing summaries, notebooks, and tasks.

## Project Structure

This repository contains two applications:

### Web Application (Next.js)
The original web application built with Next.js, React, and Tailwind CSS.

**Location**: Root directory

**Tech Stack**:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- KaTeX for LaTeX rendering
- Zustand for state management

**Getting Started**:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Mobile Application (React Native)
A React Native mobile application targeting Android, converted from the web application.

**Location**: `mobile-app/` directory

**Tech Stack**:
- React Native with Expo
- TypeScript
- React Navigation
- AsyncStorage
- Custom theming system

**Getting Started**:
```bash
cd mobile-app
npm install
npm start
```

See [mobile-app/README.md](mobile-app/README.md) for detailed mobile app documentation.

## Features

Both applications provide:

- **Summaries Platform** - Browse and share course summaries with LaTeX support
- **Notebooks Platform** - Digital note-taking with canvas drawing capabilities
- **Calendar & Tasks** - Schedule and task management with events

## Development

### Web App
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Mobile App
```bash
cd mobile-app
npm start        # Start Expo development server
npm run android  # Run on Android
npm run ios      # Run on iOS (macOS only)
npm run web      # Run on web browser
```

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### React Native Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

## Deployment

### Web Application
Deploy using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

### Mobile Application
Build for Android using Expo:
```bash
cd mobile-app
eas build --platform android
```

See the [Expo build documentation](https://docs.expo.dev/build/introduction/) for details.

## License

Built for students, by students.
