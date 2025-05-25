# SPL Predictor

A modern football prediction app for the Scottish Premier League built with Next.js, Firebase, and TypeScript.

## Features

- 🏆 Real-time leaderboards
- ⚽ Score predictions for SPL matches
- 🔥 Firebase authentication and real-time database
- 📱 Responsive mobile-first design
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Environment Setup

1. Copy the environment variables template:
```bash
cp .env.example .env.local
```

2. Fill in your environment variables in `.env.local`:
   - **Firebase config**: Get from your Firebase project settings
   - **API Football key**: Get from [API Football](https://rapidapi.com/api-sports/api/api-football/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Security

This app implements security best practices:

- **API Keys**: All external API keys are stored server-side only and never exposed to the client
- **Authentication**: Firebase Auth handles user authentication securely
- **Environment Variables**: Sensitive data is stored in environment variables that are git-ignored
- **Server-Side API Calls**: External API calls are made from Next.js API routes, not client-side

## API Routes

- `/api/fixtures` - Fetch football fixtures from API Football
- `/api/teams` - Fetch team information and logos
- `/api/sync` - Sync fixture data with Firestore
