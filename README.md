# NativeRecipe Web App 💻

The modern web interface for NativeRecipe, built with speed, accessibility, and a premium user experience in mind.

## ✨ Key Features

-   **🍳 Magic Chef**: Unleash the power of AI to generate recipes based on ingredients you already have.
-   **📱 Fully Responsive**: Seamless experience across mobile, tablet, and desktop devices.
-   **🖼️ Image Management**: Upload and manage recipe photos with Cloudflare R2 integration.
-   **🔒 Secure Auth**: Protected routes and personalized user dashboards.
-   **🎨 Modern UI**: Beautifully crafted components using Tailwind CSS 4 and Radix UI.

## 🛠 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Library**: React 19
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Language**: TypeScript
-   **Icons**: Lucide React
-   **Components**: Radix UI (Shadcn UI style)
-   **Auth**: Supabase Auth & JWT
-   **State Management**: React Context & Hooks

## 🚀 Getting Started

### Prerequisites

-   Node.js 20+ or Bun
-   Backend API running (default: http://localhost:3001)

### Installation

1.  Navigate to the `web` directory:
    ```bash
    cd web
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    bun install
    ```
3.  Configure environment variables in `.env`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

### Build for Production

```bash
npm run build
npm run start
```

## 🤖 AI Chef
Visit the `/ai-chef` page to interact with the Gemini-powered cooking assistant. Simply list your ingredients and watch the magic happen!