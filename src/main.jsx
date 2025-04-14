import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' 
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { ProductsProvider } from './contexts/Products/ProductsProvider';
import OrdersProvider from './contexts/Orders/OrdersProvider.jsx';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <ProductsProvider>
          <OrdersProvider>
            <App />
          </OrdersProvider>
        </ProductsProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
)
