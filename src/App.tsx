import { Toaster } from "sonner";

/**
 * App Component
 * 
 * The main routing is now handled by src/router.tsx which is imported in main.tsx
 * This component is kept for backwards compatibility.
 */
export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}