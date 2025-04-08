import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProductsProvider } from './contexts/ProductsProvider.jsx' 
import { AuthProvider } from './contexts/Auth/AuthProvider';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <ProductsProvider>
         <App />
        </ProductsProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
)
