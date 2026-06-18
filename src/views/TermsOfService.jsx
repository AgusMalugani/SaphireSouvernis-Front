import {
  ConsumerPageLayout,
  ContentSection,
  GlassArticle,
  PageHeader,
} from '../components/layout/ConsumerPageLayout.jsx';

function TermsOfService() {
  const currentYear = new Date().getFullYear();

  return (
    <ConsumerPageLayout>
      <GlassArticle ariaLabelledBy="terms-heading">
        <header className="space-y-2 border-b border-stone-100 pb-6">
          <PageHeader
            eyebrow="Legal"
            title="Términos de uso"
            titleId="terms-heading"
            subtitle={`Última actualización: ${currentYear}`}
          />
        </header>

        <ContentSection title="Servicio">
          <p className="text-sm leading-relaxed text-stone-500">
            Saphire Souvenirs ofrece souvenirs personalizados para eventos. Los precios y
            disponibilidad pueden variar según el producto y la temporada; cualquier
            cotización final se confirma al procesar tu pedido.
          </p>
        </ContentSection>

        <ContentSection title="Pedidos y pagos">
          <p className="text-sm leading-relaxed text-stone-500">
            Este sitio no procesa cobros online integrados en la página. La coordinación de
            precios, medios de pago y entrega puede realizarse por los canales que
            indiquemos oficialmente (por ejemplo correo o WhatsApp). Desconfiá de
            solicitudes de datos bancarios fuera de esos canales verificados.
          </p>
        </ContentSection>

        <ContentSection title="Plazos">
          <p className="text-sm leading-relaxed text-stone-500">
            Los tiempos de producción y entrega dependen del volumen del pedido y la fecha
            del evento; te informaremos estimaciones al confirmar los detalles.
          </p>
        </ContentSection>

        <ContentSection title="Limitación">
          <p className="text-sm leading-relaxed text-stone-500">
            Las imágenes del catálogo son orientativas; los diseños finales pueden variar
            levemente según materiales y personalización. Si tenés dudas, consultanos antes
            de confirmar.
          </p>
        </ContentSection>
      </GlassArticle>
    </ConsumerPageLayout>
  );
}

export default TermsOfService;
