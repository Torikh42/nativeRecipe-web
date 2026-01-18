# NativeRecipe Web App 💻

The web interface for NativeRecipe, offering a responsive and feature-rich experience for desktop and mobile web users.

## ✨ Key Features

-   **Magic Chef Integration**: Access the same powerful AI recipe generation on the web (`/ai-chef`).
-   **Responsive Design**: Optimized for all screen sizes using Tailwind CSS.
-   **Comprehensive Dashboard**: Manage your profile and recipes easily.

## 🛠 Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **State/Context**: React Context API

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Create `.env`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🤖 AI Chef
Visit `/ai-chef` (accessible via the sparkler icon ✨ in the Navbar) to try out the AI recipe generator.
