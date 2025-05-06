
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if the root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found in the document");
} else {
  createRoot(rootElement).render(<App />);
}
