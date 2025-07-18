import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme/ThemeProvider';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark">
    <App />
  </ThemeProvider>
);
