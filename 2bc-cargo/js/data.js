/* ============================================================
   Datos de demostración — TODOS FICTICIOS
   Ningún dato real de clientes de 2BC Cargo aparece aquí.
   ============================================================ */

const CLIENTE = {
  nombre: 'Comercial Andina, C.A.',
  contacto: 'Cliente Demo',
  cuenta: '1042',
  casillero: 'VE1042',
  direccion: '5425 NW 72nd Ave, Suite VE1042, Miami FL 33166',
  sucursal: 'Barquisimeto'
};

/* Tarifas de ejemplo — en el sistema real las administra 2BC */
const TARIFAS = {
  aereo:    { porKg: 8.50, minimo: 25.00, dias: '5 a 8 días',    etiqueta: 'Aéreo' },
  maritimo: { porKg: 2.90, minimo: 45.00, dias: '28 a 35 días',  etiqueta: 'Marítimo' },
  manejo:   14.00
};

function cotizar(modalidad, kg) {
  const t = TARIFAS[modalidad];
  const flete = Math.max(kg * t.porKg, t.minimo);
  return { flete, manejo: TARIFAS.manejo, total: flete + TARIFAS.manejo, dias: t.dias, tarifa: t.porKg, minimo: t.minimo };
}

const ESTADOS = {
  almacen:    { txt: 'En almacén Miami',        cls: 'info' },
  pendiente:  { txt: 'Pendiente de instrucción', cls: 'warn' },
  transito:   { txt: 'En tránsito',              cls: 'info' },
  aduana:     { txt: 'En aduana',                cls: 'warn' },
  destino:    { txt: 'En sucursal Barquisimeto', cls: 'info' },
  entregado:  { txt: 'Entregado',                cls: 'ok'   }
};

const PAQUETES = [
  {
    id: '71240',
    titulo: 'Películas de recubrimiento FEP (3 uds)',
    tracking: 'YT2639121437637200',
    tienda: 'Amazon',
    orden: '114-5083682-3943467',
    estado: 'pendiente',
    modalidad: null,
    peso: 0.6,
    valor: 35.98,
    recibido: '22/09/2026',
    eta: null,
    docPendiente: false,
    linea: [
      { d: '20/09/2026', h: 'Pre-alerta registrada', x: 'Declarada por el cliente desde el portal.', s: 'done' },
      { d: '22/09/2026', h: 'Recibido en almacén Miami', x: 'Peso verificado: 0,6 kg. Bulto en buen estado.', s: 'done' },
      { d: 'Ahora',      h: 'Esperando su instrucción', x: 'Elija aéreo o marítimo para que el paquete pueda ser despachado.', s: 'now' },
      { d: 'Siguiente',  h: 'Consolidación y despacho', x: 'Se asigna al próximo embarque según la modalidad elegida.', s: 'future' }
    ]
  },
  {
    id: '71233',
    titulo: 'Estación de energía Ecoflow Delta 3',
    tracking: 'EFUS871911246200',
    tienda: 'Tienda oficial',
    orden: 'EFUS-408627',
    estado: 'almacen',
    modalidad: 'maritimo',
    peso: 18.7,
    valor: 426.55,
    recibido: '19/09/2026',
    eta: '24/10/2026',
    docPendiente: true,
    linea: [
      { d: '16/09/2026', h: 'Pre-alerta registrada', x: 'Modalidad elegida: marítimo.', s: 'done' },
      { d: '19/09/2026', h: 'Recibido en almacén Miami', x: 'Peso verificado: 18,7 kg.', s: 'done' },
      { d: 'Ahora',      h: 'Falta la factura comercial', x: 'Por su valor declarado (US$ 426,55) la aduana exige factura comercial. El paquete queda retenido hasta recibirla.', s: 'now' },
      { d: 'Siguiente',  h: 'Consolidación marítima', x: 'Se asignará al embarque del 01/10 si el documento llega a tiempo.', s: 'future' },
      { d: '24/10/2026', h: 'Llegada estimada a Barquisimeto', x: 'Estimación sujeta a trámites aduanales.', s: 'future' }
    ]
  },
  {
    id: '71204',
    titulo: 'Impresora 3D Mars 5 Ultra',
    tracking: 'YT2639121437695033',
    tienda: 'Tienda oficial',
    orden: 'EUS275991',
    estado: 'transito',
    modalidad: 'aereo',
    peso: 8.4,
    valor: 252.67,
    recibido: '14/09/2026',
    eta: '29/09/2026',
    docPendiente: false,
    linea: [
      { d: '11/09/2026', h: 'Pre-alerta registrada', x: 'Modalidad elegida: aéreo.', s: 'done' },
      { d: '14/09/2026', h: 'Recibido en almacén Miami', x: 'Peso verificado: 8,4 kg.', s: 'done' },
      { d: '17/09/2026', h: 'Consolidado en embarque AER-0917', x: 'Guía aérea asignada.', s: 'done' },
      { d: '23/09/2026', h: 'En tránsito a Venezuela', x: 'Salió de Miami el 23/09.', s: 'now' },
      { d: '27/09/2026', h: 'Trámite aduanal', x: 'Estimado.', s: 'future' },
      { d: '29/09/2026', h: 'Disponible en Barquisimeto', x: 'Le avisaremos al llegar.', s: 'future' }
    ]
  },
  {
    id: '71188',
    titulo: 'Resina Water-Washable 8K (2 uds)',
    tracking: 'YT2639221437114513',
    tienda: 'Tienda oficial',
    orden: 'EUS275991',
    estado: 'transito',
    modalidad: 'maritimo',
    peso: 24.0,
    valor: 88.92,
    recibido: '05/09/2026',
    eta: '22/10/2026',
    docPendiente: false,
    linea: [
      { d: '02/09/2026', h: 'Pre-alerta registrada', x: 'Modalidad elegida: marítimo.', s: 'done' },
      { d: '05/09/2026', h: 'Recibido en almacén Miami', x: 'Peso verificado: 24,0 kg.', s: 'done' },
      { d: '08/09/2026', h: 'Instrucción confirmada', x: 'Asignado a consolidado marítimo.', s: 'done' },
      { d: '12/09/2026', h: 'Embarcado — consolidado MAR-2609', x: 'Zarpó de Port Everglades.', s: 'done' },
      { d: '24/09/2026', h: 'En tránsito marítimo', x: 'Llegada estimada a Puerto Cabello: 18/10.', s: 'now' },
      { d: '18/10/2026', h: 'Arribo y trámite aduanal', x: 'Estimado.', s: 'future' },
      { d: '22/10/2026', h: 'Disponible en Barquisimeto', x: 'Estimado.', s: 'future' }
    ]
  },
  {
    id: '71150',
    titulo: 'Alfombrilla de silicona + tags NFC NTAG215',
    tracking: 'YT2641021444443949',
    tienda: 'Amazon',
    orden: '114-6854103-8980244',
    estado: 'entregado',
    modalidad: 'aereo',
    peso: 1.2,
    valor: 25.97,
    recibido: '28/08/2026',
    eta: '10/09/2026',
    docPendiente: false,
    linea: [
      { d: '26/08/2026', h: 'Pre-alerta registrada', x: 'Modalidad elegida: aéreo.', s: 'done' },
      { d: '28/08/2026', h: 'Recibido en almacén Miami', x: 'Peso verificado: 1,2 kg.', s: 'done' },
      { d: '01/09/2026', h: 'Consolidado en embarque AER-0901', x: '', s: 'done' },
      { d: '06/09/2026', h: 'Trámite aduanal completado', x: '', s: 'done' },
      { d: '10/09/2026', h: 'Entregado en Barquisimeto', x: 'Retirado en sucursal por el titular de la cuenta.', s: 'done' }
    ]
  }
];

const FACTURAS = [
  {
    n: 'F-52560', fecha: '15/09/2026', paquete: '71150', estado: 'pagada', total: 110.00,
    concepto: 'Flete aéreo · 1,2 kg',
    detalle: [
      { c: 'Flete aéreo (mínimo aplicado)', m: 25.00 },
      { c: 'Manejo en almacén', m: 14.00 },
      { c: 'Trámite aduanal', m: 48.50 },
      { c: 'Entrega en sucursal Barquisimeto', m: 22.50 }
    ]
  },
  {
    n: 'NC-50351', fecha: '18/09/2026', paquete: '71150', estado: 'aplicada', total: -12.40,
    concepto: 'Nota de crédito · ajuste por peso volumétrico',
    detalle: [
      { c: 'Ajuste a favor del cliente: el peso volumétrico facturado fue superior al peso real verificado en almacén.', m: -12.40 }
    ]
  },
  {
    n: 'F-52604', fecha: '22/09/2026', paquete: '71188', estado: 'pendiente', total: 183.60,
    concepto: 'Flete marítimo · 24,0 kg',
    detalle: [
      { c: 'Flete marítimo (24,0 kg × US$ 2,90)', m: 69.60 },
      { c: 'Manejo en almacén', m: 14.00 },
      { c: 'Trámite aduanal', m: 62.00 },
      { c: 'Seguro de carga', m: 18.00 },
      { c: 'Entrega en sucursal Barquisimeto', m: 20.00 }
    ]
  }
];

const DOCUMENTOS = [
  {
    tipo: 'Factura comercial', paquete: '71233', nombre: 'Estación de energía Ecoflow Delta 3',
    estado: 'requerido',
    motivo: 'Requerida por la aduana para mercancía con valor declarado superior a US$ 200. Sin este documento el paquete no puede ser consolidado.'
  },
  {
    tipo: 'Factura comercial', paquete: '71204', nombre: 'Impresora 3D Mars 5 Ultra',
    estado: 'recibido', archivo: 'factura-mars5.pdf', fecha: '12/09/2026'
  },
  {
    tipo: 'Factura comercial', paquete: '71188', nombre: 'Resina Water-Washable 8K',
    estado: 'recibido', archivo: 'factura-resinas.pdf', fecha: '03/09/2026'
  },
  {
    tipo: 'Cédula del titular', paquete: null, nombre: 'Documento de identidad de la cuenta',
    estado: 'recibido', archivo: 'cedula-titular.pdf', fecha: '14/06/2026'
  }
];
