import { envs } from '../config/env.js';
import {
  ConsumerPageLayout,
  ContentSection,
  GlassArticle,
  PageHeader,
} from '../components/layout/ConsumerPageLayout.jsx';

function AboutUs() {
  return (
    <ConsumerPageLayout>
      <GlassArticle ariaLabelledBy="about-heading">
        <header className="flex flex-col gap-4 border-b border-stone-100 pb-6 sm:flex-row sm:items-center">
          <img
            src={envs.logoUrl}
            alt="Saphire Souvenirs"
            className="h-16 w-16 shrink-0 rounded-full border border-white/60 object-cover ring-1 ring-black/5"
          />
          <div className="space-y-1">
            <PageHeader
              eyebrow="Quiénes somos"
              title="Saphire Souvenirs"
              titleId="about-heading"
              subtitle="Souvenirs personalizados con dedicación y estilo."
            />
          </div>
        </header>

        <ContentSection>
          <p className="text-sm leading-relaxed text-stone-500">
            Somos un emprendimiento enfocado en souvenirs y detalles para celebraciones
            especiales. Trabajamos diseños personalizados para que cada evento refleje la
            identidad de quienes lo celebran.
          </p>
        </ContentSection>

        <ContentSection title="Cómo trabajamos">
          <p className="text-sm leading-relaxed text-stone-500">
            Podés explorar nuestro catálogo en línea, armar tu pedido y completar los datos
            para el diseño. Luego coordinamos contigo por los canales oficiales del negocio
            para confirmar detalles, tiempos y entrega.
          </p>
        </ContentSection>

        <ContentSection title="Contacto">
          <p className="text-sm leading-relaxed text-stone-500">
            Encontrás nuestros enlaces a Instagram y WhatsApp en el pie de página de este
            sitio. Solo utilizamos esos perfiles y números publicados aquí para atención
            al cliente.
          </p>
        </ContentSection>
      </GlassArticle>
    </ConsumerPageLayout>
  );
}

export default AboutUs;
