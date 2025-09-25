# Local-First Next.js App

A local-first user directory application built with Next.js, featuring offline capabilities, client-side caching, and responsive design.

## Features

- **Local-First Architecture**: Data persists locally using IndexedDB
- **Offline Support**: Continues to work without internet connection
- **Server-Side Pagination**: Fetches 10 users per page from randomuser.me API
- **Favorite Users**: Mark users as favorites with persistent storage
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Global State Management**: Using Zustand for reactive state
- **Graceful Degradation**: Shows cached data when API is unavailable

## Tech Stack

- **Next.js 15** - React framework
- **Zustand** - Global state management
- **Dexie.js** - IndexedDB wrapper for local caching
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Other Scripts

```bash
npm run lint        # Run ESLint
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

## How to Simulate Offline/Failure Scenarios

### Method 1: Browser Developer Tools

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Check **"Offline"** checkbox
4. Refresh the page - should show cached data

### Method 2: API Failure Simulation

- Disconnect your internet connection
- The app will automatically fall back to cached data
- An offline message will appear at the top

### Method 3: Cache Testing

1. Load the app and browse some users
2. Mark some users as favorites
3. Close the browser completely
4. Reopen and navigate to the app
5. Your favorites should persist and cached data should load

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── UserCard.tsx        # User display component
│   └── Pagination.tsx      # Pagination controls
└── lib/
    ├── db.ts               # Dexie database setup
    └── store.ts            # Zustand store configuration
```

## How It Works

1. **Initial Load**: Fetches page 1 with 10 users from randomuser.me API
2. **Caching**: Stores user data in IndexedDB for offline access
3. **Pagination**: Each page click fetches fresh data from API
4. **Favorites**: Stored in IndexedDB and persist across sessions
5. **Offline**: Falls back to cached data when network is unavailable

## Known Issues & Limitations

- **API Limitation**: randomuser.me doesn't guarantee consistent data across pagination
- **Cache Strategy**: Currently clears cache on page 1 fetch (could be improved)
- **Error Handling**: Basic error states could be more user-friendly
- **Performance**: Could implement virtual scrolling for large datasets

## What Would Be Improved With More Time

### High Priority

- **Search & Filter**: Add search by name/email functionality
- **Enhanced Error Handling**: Better error messages and retry mechanisms
- **Data Consistency**: Smarter cache invalidation strategy
- **Test Coverage**: Comprehensive unit and integration tests

### Medium Priority

- **Sorting**: Order users by name, email, or other fields
- **Infinite Scroll**: Replace pagination with infinite loading

### Nice to Have

- **PWA Support**: Service worker for true offline app experience
- **User Details**: Expandable cards with more user information
- **Export Features**: Download favorites as CSV/JSON
- **Accessibility**: Enhanced keyboard navigation and screen reader support
