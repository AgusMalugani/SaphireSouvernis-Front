import React from 'react';

function InfoMetodoTrabajo() {
  return (
    <section className="flex flex-wrap gap-6 mt-6 w-full justify-center items-start px-4">
      <div className="flex-1 min-w-[300px] max-w-xl  p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-5">
          Modalidad de Trabajo
        </h2>

        <ul className="space-y-4 text-base text-gray-700 leading-relaxed text-justify list-disc list-inside">
          <li>
            Hacer el pedido por la web completando los datos requeridos. Al finalizar, se redirige automáticamente a WhatsApp.
          </li>
          <li>
            El pedido se agenda una vez realizada la seña del 50%, 30% o el pago total de la compra.
          </li>
          <li>
            Si no se abona dentro de las 48hs, el pedido se da de baja automáticamente. Será necesario consultar nuevamente costos y disponibilidad.
          </li>
          <li>
            Una vez confirmado el pedido, se realizan las muestras y se envían para su aprobación.
          </li>
        </ul>
      </div>

      <img
        className="rounded-2xl w-full sm:w-[300px] h-[250px] object-cover shadow-xl"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0-hHH-tYkE1_CqnxjiBpfZkU1vs32Hlsjg&s"
        alt="Ejemplo del proceso de trabajo"
      />
    </section>
  );
}

export default InfoMetodoTrabajo;
