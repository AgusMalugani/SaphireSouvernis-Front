import React from 'react';
import HeaderQuienSomos from '../components/Home/HeaderQuienSomos';
import CarruselProducts from '../components/Home/CarruselProducts';
import ProductHomeView from '../components/Home/ProductHomeView';
import InfoMetodoTrabajo from '../components/Home/InfoMetodoTrabajo';

function Home() {
  return (
    <div className="bg-stone-50 min-h-screen scroll-smooth">
      <HeaderQuienSomos />
      <CarruselProducts />
      <ProductHomeView />
      <InfoMetodoTrabajo />
    </div>
  );
}

export default Home;
