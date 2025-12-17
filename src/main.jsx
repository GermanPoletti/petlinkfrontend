import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './styles/global.css';
import { ChatProvider } from './context/ChatContext.jsx';
import { UserProvider } from './context/UserContext.jsx'
import { ToastProvider } from './components/UI/Toast';
import { ChatPanel } from './components/UI/Chat';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import ReactGA from 'react-ga4';

ReactGA.initialize('G-EFDMJQHXTJ');
ReactGA.send({ hitType: 'pageview', page: window.location.pathname,  platform: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop" });

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <ToastProvider>
              <ChatProvider>
                <App />
                <ChatPanel />
              </ChatProvider>
            </ToastProvider>
          </UserProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
)