import HeaderQuienSomos from '../components/Home/HeaderQuienSomos';
import CarruselProducts from '../components/Home/CarruselProducts';
import ProductHomeView from '../components/Home/ProductHomeView';
import InfoMetodoTrabajo from '../components/Home/InfoMetodoTrabajo';

const HOME_SECTIONS = [
  { id: 'featured-products', Component: CarruselProducts },
  { id: 'catalog-cta', Component: ProductHomeView },
  { id: 'work-method', Component: InfoMetodoTrabajo },
];

function Home() {
  return (
    <div className="min-h-screen scroll-smooth bg-stone-50">
      <HeaderQuienSomos />

      <section
        id="main-content"
        aria-label="Contenido principal de la página de inicio"
        className="flex flex-col"
      >
        {HOME_SECTIONS.map(({ id, Component: SectionComponent }) => (
          <div key={id} id={id} className="scroll-mt-20">
            <SectionComponent />
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
