import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' 
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { ProductsProvider } from './contexts/Products/ProductsProvider';

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
