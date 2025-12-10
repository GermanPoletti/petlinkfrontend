import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './styles/global.css';
import { ChatProvider } from './context/ChatContext.jsx';
import { ToastProvider } from './components/UI/Toast';
import { ChatPanel } from './components/UI/Chat';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <ChatProvider>
              <App />
              <ChatPanel />
            </ChatProvider>
          </ToastProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
)