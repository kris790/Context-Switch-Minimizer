# Context Switch Minimizer

A respectful, effective focus management tool that helps knowledge workers reclaim productivity by gently minimizing digital distractions. Unlike traditional blockers that punish you, Context Switch Minimizer respects your agency while helping you build better habits.

## Key Features

- **🎯 Custom Focus Sessions:** Create tailored workspaces (e.g., "Deep Coding", "Writing") with specific allowed apps.
- **🛡️ Gentle Redirects:** A non-intrusive overlay appears if you open a distracting app, offering a choice to stay focused or proceed intentionally.
- **📊 Analytics Dashboard:** Visualize your productivity trends, focus streaks, and total deep work hours.
- **🔒 Privacy-First:** All data is stored locally in your browser. You own your data and can export it anytime.
- **🚀 Quick Onboarding:** Get set up in under 30 seconds with pre-built session templates.

## User Guide

### 1. Creating a Session
*   Click **"Create Session"** on the dashboard.
*   Choose a name and icon.
*   Select the apps you need for this specific workflow (e.g., VS Code + Terminal for coding).

### 2. Starting a Session
*   Click **"Start Focus"** on any session card.
*   The interface transforms into a distraction-free timer.
*   *Demo Note:* Click **"Simulate Distraction"** to see how the Gentle Redirect overlay works.

### 3. During a Session
*   The timer tracks your deep work duration.
*   If you attempt to end a session early (< 5 mins), the app will ask for confirmation to help you push through resistance.

### 4. Analyzing Progress
*   Visit the **Analytics** tab to view your daily, weekly, and monthly performance.
*   Track your "Focus Accuracy" and maintain your daily streak.

## Tech Stack

*   **Framework:** React 19 (TypeScript)
*   **Styling:** Tailwind CSS with custom design system tokens
*   **Icons:** Lucide React
*   **State Management:** React Hooks & Local Storage
*   **Build Tooling:** Standard ES Modules

## Local Data Storage

This application uses `localStorage` to persist your:
*   Focus Sessions
*   User Settings & Preferences
*   Historical Statistics

To reset the app to its initial state, you can clear your browser's local storage for this domain.