import {
  ConsumerPageLayout,
  ContentSection,
  GlassArticle,
  PageHeader,
} from '../components/layout/ConsumerPageLayout.jsx';

function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <ConsumerPageLayout>
      <GlassArticle ariaLabelledBy="privacy-heading">
        <header className="space-y-2 border-b border-stone-100 pb-6">
          <PageHeader
            eyebrow="Legal"
            title="Política de privacidad"
            titleId="privacy-heading"
            subtitle={`Última actualización: ${currentYear}`}
          />
        </header>

        <ContentSection title="Datos que recopilamos">
          <p className="text-sm leading-relaxed text-stone-500">
            Cuando realizás un pedido a través de nuestro sitio, podemos recopilar datos
            necesarios para elaborar y coordinar tu compra: nombre, correo electrónico,
            teléfonos de contacto, dirección de envío cuando corresponda, detalle del
            evento y preferencias de diseño indicadas en el formulario.
          </p>
        </ContentSection>

        <ContentSection title="Finalidad">
          <p className="text-sm leading-relaxed text-stone-500">
            Utilizamos estos datos únicamente para gestionar tu pedido, comunicarnos sobre
            el mismo y enviarte confirmaciones por correo cuando aplique. No vendemos ni
            alquilamos tus datos personales a terceros.
          </p>
        </ContentSection>

        <ContentSection title="Contacto por WhatsApp">
          <p className="text-sm leading-relaxed text-stone-500">
            Si elegís contactarnos por WhatsApp, aplican las políticas de uso de dicho
            servicio. Solo utilizamos la conversación para coordinar tu pedido de souvenirs
            personalizados.
          </p>
        </ContentSection>

        <ContentSection title="Tus derechos">
          <p className="text-sm leading-relaxed text-stone-500">
            Podés solicitar acceso, rectificación o eliminación de tus datos escribiéndonos
            al correo de contacto indicado en nuestra página o por los canales públicos del
            negocio.
          </p>
        </ContentSection>
      </GlassArticle>
    </ConsumerPageLayout>
  );
}

export default PrivacyPolicy;
