import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key")
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={clerkPubKey}>
        <App />
    </ClerkProvider>
);
