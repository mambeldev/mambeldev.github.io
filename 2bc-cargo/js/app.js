/* ============================================================
   Prototipo — Portal de cliente 2BC Cargo
   Angel Mambel · contacto@mambeldev.com
   Aplicación de una sola página, sin dependencias externas.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const usd = n => (n < 0 ? '−' : '') + 'US$ ' + Math.abs(n).toFixed(2).replace('.', ',');
  const kg  = n => String(n).replace('.', ',') + ' kg';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const ICON = {
    aereo: '<svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
    maritimo: '<svg viewBox="0 0 24 24"><path d="M20 21c-1.4 0-2.8-.5-4-1.3-2.4 1.7-5.6 1.7-8 0C6.8 20.5 5.4 21 4 21H2v-2h2c1.4 0 2.8-.6 4-1.6 2.4 2.1 5.6 2.1 8 0 1.2 1 2.6 1.6 4 1.6h2v2h-2zM3.95 16.4 2.5 9.7l9.5-3.2V3h-3V1h6v2h-3v3.5l9.5 3.2-1.45 6.7C18.4 15.6 16.8 15 15 15c-1.1 0-2.1.2-3 .6-.9-.4-1.9-.6-3-.6-1.8 0-3.4.6-5.05 1.4z"/></svg>'
  };

  const modo = m => m
    ? `<span class="mode">${ICON[m]} ${m === 'aereo' ? 'Aéreo' : 'Marítimo'}</span>`
    : '<span class="mode" style="color:var(--warn)">Sin definir</span>';

  const estadoChip = p => {
    const e = ESTADOS[p.estado];
    let t = e.txt;
    if (p.estado === 'transito') t = p.modalidad === 'aereo' ? 'En tránsito aéreo' : 'En tránsito marítimo';
    return `<span class="st ${e.cls}">${t}</span>`;
  };

  const nota = (titulo, cuerpo) => `
    <details class="note">
      <summary>${titulo}</summary>
      <div class="body">${cuerpo}</div>
    </details>`;

  /* ---------- Navegación ---------- */
  const RUTAS = [
    { h: 'tablero',   t: 'Tablero' },
    { h: 'paquetes',  t: 'Mis paquetes' },
    { h: 'prealerta', t: 'Nueva pre-alerta' },
    { h: 'documentos',t: 'Documentos' },
    { h: 'facturas',  t: 'Facturas' }
  ];

  const pendientesDoc = () => DOCUMENTOS.filter(d => d.estado === 'requerido').length;
  const pendientesIns = () => PAQUETES.filter(p => p.estado === 'pendiente').length;

  function pintarNav(activa) {
    $('#nav').innerHTML = RUTAS.map(r => {
      let pill = '';
      if (r.h === 'documentos' && pendientesDoc()) pill = `<span class="pill">${pendientesDoc()}</span>`;
      if (r.h === 'paquetes' && pendientesIns())   pill = `<span class="pill">${pendientesIns()}</span>`;
      const on = (activa === r.h || (activa === 'paquete' && r.h === 'paquetes')) ? ' class="on"' : '';
      return `<a href="#/${r.h}"${on}>${r.t}${pill}</a>`;
    }).join('');
  }

  /* ============================================================
     VISTA · Tablero
     ============================================================ */
  function vistaTablero() {
    const enAlmacen = PAQUETES.filter(p => p.estado === 'almacen' || p.estado === 'pendiente').length;
    const enTransito = PAQUETES.filter(p => p.estado === 'transito' || p.estado === 'aduana').length;
    const porPagar = FACTURAS.filter(f => f.estado === 'pendiente').reduce((s, f) => s + f.total, 0);
    const recientes = PAQUETES.filter(p => p.estado !== 'entregado');

    const avisos = [];
    if (pendientesIns()) avisos.push(`
      <div class="alert warn">
        <span class="ic">!</span>
        <div><b>${pendientesIns()} paquete esperando su instrucción</b>
        Indique si desea enviarlo por avión o por barco para que podamos despacharlo.
        <a href="#/paquete/71240">Ver paquete</a></div>
      </div>`);
    if (pendientesDoc()) avisos.push(`
      <div class="alert warn">
        <span class="ic">!</span>
        <div><b>Falta 1 documento</b>
        La factura comercial del paquete #71233 es necesaria para el trámite aduanal.
        <a href="#/documentos">Subir documento</a></div>
      </div>`);

    return `
      <div class="page-head">
        <h1>Hola, ${esc(CLIENTE.contacto)}</h1>
        <p>Cuenta ${CLIENTE.cuenta} · Casillero ${CLIENTE.casillero} · Sucursal ${CLIENTE.sucursal}</p>
      </div>

      ${nota('¿Qué cambia respecto al portal actual?', `
        <p>Hoy la pantalla de inicio muestra <b>«No se han encontrado registros»</b> aunque la cuenta
        tenga paquetes activos en almacén, porque lee una tabla distinta a la de la pestaña Almacén.</p>
        <p>Aquí lo primero que ve el cliente es lo que realmente tiene, y sobre todo
        <b>lo que necesita hacer</b>: paquetes esperando instrucción y documentos faltantes.</p>`)}

      ${avisos.join('')}

      <div class="stats">
        <button class="stat a" data-goto="#/paquetes">
          <div class="n">${enAlmacen}</div>
          <div class="l">En almacén Miami</div>
        </button>
        <button class="stat b" data-goto="#/paquetes">
          <div class="n">${enTransito}</div>
          <div class="l">En tránsito hacia Venezuela</div>
        </button>
        <button class="stat c" data-goto="#/paquetes">
          <div class="n">${pendientesIns()}</div>
          <div class="l">Esperando su instrucción</div>
        </button>
        <button class="stat d" data-goto="#/facturas">
          <div class="n">${usd(porPagar)}</div>
          <div class="l">Saldo pendiente por pagar</div>
        </button>
      </div>

      <div class="grid2">
        <div class="card">
          <div class="card-h">
            <h2>Paquetes activos</h2>
            <span class="sub">${recientes.length} en curso</span>
            <a href="#/paquetes" style="margin-left:auto;font-size:13.5px;font-weight:600">Ver todos</a>
          </div>
          <div class="card-b tight">${recientes.map(filaPaquete).join('')}</div>
        </div>

        <div class="card">
          <div class="card-h"><h2>Su dirección en Miami</h2></div>
          <div class="card-b">
            <div style="font-size:14.5px;line-height:1.7">
              <b>${esc(CLIENTE.nombre)}</b><br>
              5425 NW 72nd Ave<br>
              Suite ${CLIENTE.casillero}<br>
              Miami, FL 33166<br>
              Estados Unidos
            </div>
            <button class="btn ghost sm" style="margin-top:12px" data-copy="${esc(CLIENTE.direccion)}">
              Copiar dirección
            </button>
            <p style="font-size:12.5px;color:var(--ink-3);margin-top:12px;border-top:1px solid var(--line-2);padding-top:12px">
              Use esta dirección al comprar en tiendas de Estados Unidos. Recuerde incluir siempre
              el número de suite para que podamos identificar su mercancía.
            </p>
          </div>
        </div>
      </div>`;
  }

  /* ============================================================
     VISTA · Mis paquetes
     ============================================================ */
  let filtroActivo = 'todos';

  function filaPaquete(p) {
    const eta = p.eta ? `Llega aprox. ${p.eta}` : (p.estado === 'pendiente' ? 'Sin fecha: falta su instrucción' : '');
    return `
      <button class="pkg" data-goto="#/paquete/${p.id}">
        <div class="t">${esc(p.titulo)} <span class="id">#${p.id}</span></div>
        <div class="m">
          <span>${modo(p.modalidad)}</span>
          <span>${kg(p.peso)}</span>
          <span>Recibido ${p.recibido}</span>
        </div>
        <div class="r">
          ${estadoChip(p)}
          ${eta ? `<span class="eta">${eta}</span>` : ''}
        </div>
      </button>`;
  }

  function vistaPaquetes() {
    const filtros = [
      { k: 'todos',     t: 'Todos' },
      { k: 'pendiente', t: 'Esperan instrucción' },
      { k: 'almacen',   t: 'En almacén' },
      { k: 'transito',  t: 'En tránsito' },
      { k: 'entregado', t: 'Entregados' }
    ];
    const lista = filtroActivo === 'todos' ? PAQUETES : PAQUETES.filter(p => p.estado === filtroActivo);

    return `
      <div class="page-head">
        <h1>Mis paquetes</h1>
        <p>Toda su mercancía, con el estado escrito en palabras y su fecha estimada de llegada.</p>
      </div>

      ${nota('¿Qué cambia respecto al portal actual?', `
        <p>Hoy el estado de cada paquete se comunica <b>únicamente por el color de fondo de la fila</b>,
        con una leyenda al final de la página, y la modalidad con un ícono sin texto. En un teléfono
        eso es ilegible, y una persona que no distingue bien los colores no puede usarlo.</p>
        <p>Aquí cada paquete dice en palabras dónde está, con qué modalidad viaja y cuándo se estima
        que llegue. Además se puede filtrar, que hoy no es posible.</p>`)}

      <div class="card">
        <div class="card-h">
          <div class="filters">
            ${filtros.map(f => `<button data-filtro="${f.k}"${filtroActivo === f.k ? ' class="on"' : ''}>${f.t}</button>`).join('')}
          </div>
          <span class="sub" style="margin-left:auto">${lista.length} paquete${lista.length === 1 ? '' : 's'}</span>
        </div>
        <div class="card-b tight">
          ${lista.length ? lista.map(filaPaquete).join('') : '<div class="empty-state">No hay paquetes en esta categoría.</div>'}
        </div>
      </div>`;
  }

  /* ============================================================
     VISTA · Detalle del paquete
     ============================================================ */
  function vistaPaquete(id) {
    const p = PAQUETES.find(x => x.id === id);
    if (!p) return '<div class="empty-state">Paquete no encontrado.</div>';

    const c = p.modalidad ? cotizar(p.modalidad, p.peso) : null;

    const accion = p.estado === 'pendiente' ? `
      <div class="alert warn">
        <span class="ic">!</span>
        <div>
          <b>Este paquete espera su instrucción</b>
          Elija la modalidad para que podamos asignarlo al próximo embarque.
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
            <button class="btn sm" data-demo="Instrucción registrada: envío aéreo. En el sistema real, el paquete pasaría a la cola de consolidación aérea.">Enviar por avión · ${usd(cotizar('aereo', p.peso).total)}</button>
            <button class="btn ghost sm" data-demo="Instrucción registrada: envío marítimo. En el sistema real, el paquete pasaría a la cola de consolidación marítima.">Enviar por barco · ${usd(cotizar('maritimo', p.peso).total)}</button>
          </div>
        </div>
      </div>` : '';

    const doc = p.docPendiente ? `
      <div class="alert warn">
        <span class="ic">!</span>
        <div>
          <b>Falta la factura comercial</b>
          Requerida por la aduana para mercancía de más de US$ 200. El paquete no puede consolidarse sin ella.
          <div style="margin-top:10px"><a class="btn sm" href="#/documentos" style="display:inline-block;text-decoration:none">Subir documento</a></div>
        </div>
      </div>` : '';

    return `
      <button class="back" data-goto="#/paquetes">← Volver a mis paquetes</button>

      <div class="page-head">
        <h1>${esc(p.titulo)}</h1>
        <p>Paquete #${p.id} · ${estadoChip(p)}</p>
      </div>

      ${accion}${doc}

      <div class="grid2">
        <div class="card">
          <div class="card-h"><h2>Historia del envío</h2></div>
          <div class="card-b">
            <div class="tl">
              ${p.linea.map(e => `
                <div class="ev ${e.s}">
                  <div class="d">${e.d}</div>
                  <div class="h">${esc(e.h)}</div>
                  ${e.x ? `<div class="x">${esc(e.x)}</div>` : ''}
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div>
          <div class="card">
            <div class="card-h"><h2>Datos del paquete</h2></div>
            <div class="card-b">
              <div class="dl">
                <div><div class="k">Peso verificado</div><div class="v">${kg(p.peso)}</div></div>
                <div><div class="k">Valor declarado</div><div class="v">${usd(p.valor)}</div></div>
                <div><div class="k">Modalidad</div><div class="v sm">${modo(p.modalidad)}</div></div>
                <div><div class="k">Recibido en Miami</div><div class="v sm">${p.recibido}</div></div>
                <div><div class="k">Tienda</div><div class="v sm">${esc(p.tienda)}</div></div>
                <div><div class="k">N.° de orden</div><div class="v sm">${esc(p.orden)}</div></div>
              </div>
              <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line-2)">
                <div class="k" style="font-size:11.5px;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-3);font-weight:700">Número de seguimiento</div>
                <div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;margin-top:4px;word-break:break-all">${esc(p.tracking)}</div>
              </div>
            </div>
          </div>

          ${c ? `
          <div class="card">
            <div class="card-h"><h2>Costo estimado</h2></div>
            <div class="card-b">
              <div class="ship" style="padding:0">
                <ul>
                  <li><span>Flete ${p.modalidad === 'aereo' ? 'aéreo' : 'marítimo'} (${kg(p.peso)})</span><span>${usd(c.flete)}</span></li>
                  <li><span>Manejo en almacén</span><span>${usd(c.manejo)}</span></li>
                  <li style="border-top:1px solid var(--line);margin-top:6px;padding-top:8px;font-weight:700;color:var(--ink)">
                    <span>Estimado</span><span>${usd(c.total)}</span></li>
                </ul>
                <div class="calc">Cálculo: ${kg(p.peso)} × US$ ${c.tarifa.toFixed(2)} por kg${c.flete === c.minimo ? ' (se aplicó el mínimo de ' + usd(c.minimo) + ')' : ''}.
                No incluye trámite aduanal ni entrega, que se calculan al arribo.</div>
              </div>
            </div>
          </div>` : ''}
        </div>
      </div>

      ${nota('¿Qué cambia respecto al portal actual?', `
        <p>El portal actual muestra el estado del momento y nada más: <b>no hay historia, ni fechas,
        ni peso, ni valor, ni estimación de llegada</b>. Cada pregunta de «¿dónde va mi paquete?»
        termina siendo una llamada o un mensaje que alguien de 2BC debe atender.</p>
        <p>Con esta pantalla el cliente se responde solo, a cualquier hora, y el personal deja de
        gastar tiempo en consultas repetidas.</p>`)}`;
  }

  /* ============================================================
     VISTA · Nueva pre-alerta  (la pantalla central del prototipo)
     ============================================================ */
  let articulos = [
    { desc: 'Películas de recubrimiento FEP (3 uds)', valor: 35.98, peso: 0.6, modo: 'aereo' },
    { desc: 'Resina Water-Washable 8K (2 uds)',       valor: 88.92, peso: 24.0, modo: 'maritimo' }
  ];

  function vistaPrealerta() {
    return `
      <div class="page-head">
        <h1>Nueva pre-alerta</h1>
        <p>Declare su compra y elija cómo viaja cada artículo. Puede dividir un mismo pedido
        entre avión y barco.</p>
      </div>

      ${nota('¿Qué cambia respecto al portal actual? — esta es la pantalla clave', `
        <p>En el portal actual la pre-alerta <b>no tiene ningún campo para indicar si la mercancía
        va por avión o por barco</b>. La modalidad se elige después, en otra pantalla, y asociada al
        número de tracking completo, no al artículo.</p>
        <p>Consecuencia: si una misma compra trae cosas urgentes y cosas pesadas,
        <b>el cliente no tiene forma de pedir que se dividan</b>. Es exactamente el error que hace
        que un pedido termine viajando completo por avión y le cueste al cliente varias veces más
        de lo necesario.</p>
        <p>Aquí la modalidad se elige <b>por artículo</b>, el sistema arma los envíos que hagan falta
        y muestra el costo aproximado de cada uno <b>antes</b> de confirmar.</p>`)}

      <div class="grid2">
        <div class="card">
          <div class="card-h">
            <h2>Datos de la compra</h2>
          </div>
          <div class="card-b">
            <div class="row two">
              <div class="field">
                <label for="f-tienda">Tienda</label>
                <select id="f-tienda">
                  <option>Amazon</option><option>eBay</option><option>Shein</option>
                  <option>Temu</option><option>Tienda oficial del fabricante</option><option>Otra</option>
                </select>
              </div>
              <div class="field">
                <label for="f-orden">N.° de orden</label>
                <input id="f-orden" value="114-5083682-3943467">
              </div>
            </div>
            <div class="field">
              <label for="f-track">Número de seguimiento</label>
              <input id="f-track" value="YT2639121437637200">
              <div class="hint">Si el pedido llega en varios bultos, puede agregar más números después.</div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;margin:20px 0 12px">
              <h3 style="font-size:14px;font-weight:700">Artículos del pedido</h3>
              <button class="btn ghost sm" id="add" style="margin-left:auto">+ Agregar artículo</button>
            </div>

            <div id="items"></div>
          </div>
        </div>

        <div>
          <div class="card" style="position:sticky;top:130px">
            <div class="card-h"><h2>Cómo va a viajar su pedido</h2></div>
            <div class="card-b" id="resumen"></div>
          </div>
        </div>
      </div>`;
  }

  function pintarArticulos() {
    const cont = $('#items');
    if (!cont) return;
    cont.innerHTML = articulos.map((a, i) => `
      <div class="item">
        <div class="item-h">
          <b>Artículo ${i + 1}</b>
          ${articulos.length > 1 ? `<button class="del" data-del="${i}">Quitar</button>` : ''}
        </div>
        <div class="field">
          <label>Descripción</label>
          <input data-f="desc" data-i="${i}" value="${esc(a.desc)}">
        </div>
        <div class="row two">
          <div class="field">
            <label>Valor declarado (US$)</label>
            <input type="number" step="0.01" min="0" data-f="valor" data-i="${i}" value="${a.valor}">
          </div>
          <div class="field">
            <label>Peso estimado (kg)</label>
            <input type="number" step="0.1" min="0" data-f="peso" data-i="${i}" value="${a.peso}">
          </div>
        </div>
        <div class="field" style="margin-bottom:0">
          <label>¿Cómo quiere que viaje este artículo?</label>
          <div class="modes">
            <label class="${a.modo === 'aereo' ? 'sel' : ''}" data-modo="aereo" data-i="${i}">
              ${ICON.aereo}
              <span class="txt"><b>Aéreo</b><span>${TARIFAS.aereo.dias} · US$ ${TARIFAS.aereo.porKg.toFixed(2)}/kg</span></span>
            </label>
            <label class="${a.modo === 'maritimo' ? 'sel' : ''}" data-modo="maritimo" data-i="${i}">
              ${ICON.maritimo}
              <span class="txt"><b>Marítimo</b><span>${TARIFAS.maritimo.dias} · US$ ${TARIFAS.maritimo.porKg.toFixed(2)}/kg</span></span>
            </label>
          </div>
        </div>
      </div>`).join('');
    pintarResumen();
  }

  function pintarResumen() {
    const cont = $('#resumen');
    if (!cont) return;

    const grupos = { aereo: [], maritimo: [] };
    articulos.forEach(a => { if (a.modo) grupos[a.modo].push(a); });

    const envios = Object.keys(grupos)
      .filter(m => grupos[m].length)
      .map(m => {
        const peso = grupos[m].reduce((s, a) => s + (parseFloat(a.peso) || 0), 0);
        const c = cotizar(m, peso);
        return { m, arts: grupos[m], peso, c };
      });

    if (!envios.length) {
      cont.innerHTML = '<div class="ship empty">Agregue artículos y elija su modalidad para ver el resumen.</div>';
      return;
    }

    const total = envios.reduce((s, e) => s + e.c.total, 0);
    const pesoTotal = envios.reduce((s, e) => s + e.peso, 0);
    const todoAereo = cotizar('aereo', pesoTotal);
    const ahorro = todoAereo.total - total;

    cont.innerHTML = `
      <div class="split">
        <div class="sh">
          ${envios.length > 1 ? 'Su pedido se dividirá en 2 envíos' : 'Su pedido viajará en 1 envío'}
          <span class="c">${articulos.length} artículo${articulos.length === 1 ? '' : 's'}</span>
        </div>
        ${envios.map((e, i) => `
          <div class="ship">
            <div class="t">
              ${ICON[e.m]}
              Envío ${envios.length > 1 ? (i + 1) + ' · ' : ''}${e.m === 'aereo' ? 'aéreo' : 'marítimo'}
              <span class="n">${usd(e.c.total)}</span>
            </div>
            <ul>
              ${e.arts.map(a => `<li><span>${esc(a.desc || 'Artículo sin descripción')}</span><span>${kg(parseFloat(a.peso) || 0)}</span></li>`).join('')}
              <li style="border-top:1px solid var(--line-2);margin-top:5px;padding-top:6px">
                <span>Flete (${kg(e.peso)})</span><span>${usd(e.c.flete)}</span></li>
              <li><span>Manejo</span><span>${usd(e.c.manejo)}</span></li>
            </ul>
            <div class="calc">Tiempo estimado: ${e.c.dias}${e.c.flete === e.c.minimo ? ' · Se aplicó la tarifa mínima de ' + usd(e.c.minimo) : ''}</div>
          </div>`).join('')}
      </div>

      <div style="display:flex;align-items:center;gap:10px;margin:14px 0;font-size:16px;font-weight:700">
        <span>Total estimado</span>
        <span style="margin-left:auto;color:var(--brand-900)">${usd(total)}</span>
      </div>

      ${envios.length > 1 && ahorro > 0 ? `
        <div class="alert ok" style="margin-bottom:12px">
          <span class="ic">✓</span>
          <div><b>Ahorra ${usd(ahorro)} al dividir el pedido</b>
          Enviar todo por avión le costaría ${usd(todoAereo.total)}. Al mandar lo pesado por barco
          paga ${usd(total)}.</div>
        </div>` : ''}

      <button class="btn" style="width:100%" data-demo="En el sistema real, aquí quedaría registrada la pre-alerta con la modalidad ya definida por artículo, y 2BC recibiría la instrucción completa desde el primer momento. Este prototipo no guarda datos.">
        Confirmar pre-alerta
      </button>
      <p style="font-size:12px;color:var(--ink-3);margin-top:10px;text-align:center">
        Los montos son estimaciones con tarifas de ejemplo. El costo final se calcula con el peso
        verificado en el almacén de Miami.
      </p>`;
  }

  /* ============================================================
     VISTA · Documentos
     ============================================================ */
  function vistaDocumentos() {
    return `
      <div class="page-head">
        <h1>Documentos</h1>
        <p>Lo que hace falta y lo que ya recibimos, en un solo lugar.</p>
      </div>

      ${nota('¿Qué cambia respecto al portal actual?', `
        <p>Hoy la exigencia de la factura comercial aparece como un <b>texto rojo que dice
        «SUBIR FACTURA COMERCIAL»</b> dentro de la tabla de pre-alertas. Informa del problema pero
        no permite resolverlo: no es un botón y no hay ningún lugar ordenado donde cargar el archivo
        ni consultar lo ya entregado.</p>
        <p>Aquí cada documento pendiente explica <b>por qué</b> se exige y se carga desde el mismo
        sitio, también desde el teléfono con la cámara.</p>`)}

      <div class="card">
        <div class="card-h">
          <h2>Pendientes</h2>
          <span class="st warn" style="margin-left:auto">${pendientesDoc()} por entregar</span>
        </div>
        <div class="card-b tight">
          ${DOCUMENTOS.filter(d => d.estado === 'requerido').map(d => `
            <div class="doc">
              <div class="ic need">!</div>
              <div class="tx">
                <b>${esc(d.tipo)} · paquete #${d.paquete}</b>
                <span>${esc(d.nombre)}</span>
                <div style="font-size:12.5px;color:var(--warn);margin-top:5px;line-height:1.45">${esc(d.motivo)}</div>
              </div>
              <button class="btn sm" data-demo="En el sistema real se abriría el selector de archivos o la cámara del teléfono para fotografiar la factura. Este prototipo no sube archivos.">Subir</button>
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-h"><h2>Recibidos</h2></div>
        <div class="card-b tight">
          ${DOCUMENTOS.filter(d => d.estado === 'recibido').map(d => `
            <div class="doc">
              <div class="ic have">✓</div>
              <div class="tx">
                <b>${esc(d.tipo)}${d.paquete ? ' · paquete #' + d.paquete : ''}</b>
                <span>${esc(d.nombre)} · recibido el ${d.fecha}</span>
              </div>
              <span class="st ok">Conforme</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /* ============================================================
     VISTA · Facturas
     ============================================================ */
  function vistaFacturas() {
    const pendiente = FACTURAS.filter(f => f.estado === 'pendiente').reduce((s, f) => s + f.total, 0);
    const chip = { pagada: 'ok', pendiente: 'warn', aplicada: 'mute' };
    const txt  = { pagada: 'Pagada', pendiente: 'Por pagar', aplicada: 'Aplicada' };

    return `
      <div class="page-head">
        <h1>Facturas y estado de cuenta</h1>
        <p>Cada cargo explicado y vinculado al envío que lo originó.</p>
      </div>

      ${nota('¿Qué cambia respecto al portal actual?', `
        <p>En el portal actual la misma cuenta aparece a veces como un nombre y a veces como otro,
        y hay <b>líneas con montos negativos de pocos centavos sin ninguna explicación</b>. El cliente
        no sabe si le cobraron de más, le devolvieron algo o hubo un error.</p>
        <p>Aquí cada factura se abre y muestra su desglose, y toda nota de crédito dice
        <b>por qué</b> se generó y a qué paquete corresponde.</p>`)}

      <div class="alert info">
        <span class="ic">i</span>
        <div><b>Saldo pendiente: ${usd(pendiente)}</b>
        Corresponde a la factura F-52604 del envío marítimo #71188.</div>
      </div>

      <div class="card">
        <div class="card-h"><h2>Movimientos</h2></div>
        <div class="card-b tight">
          <table class="stack">
            <thead>
              <tr>
                <th>Documento</th><th>Fecha</th><th>Concepto</th>
                <th>Estado</th><th class="num">Monto</th>
              </tr>
            </thead>
            <tbody>
              ${FACTURAS.map((f, i) => `
                <tr class="clickable" data-fact="${i}">
                  <td data-l="Documento"><b>${f.n}</b></td>
                  <td data-l="Fecha">${f.fecha}</td>
                  <td data-l="Concepto">${esc(f.concepto)}<br>
                    <span style="font-size:12.5px;color:var(--ink-3)">Paquete #${f.paquete}</span></td>
                  <td data-l="Estado"><span class="st ${chip[f.estado]}">${txt[f.estado]}</span></td>
                  <td data-l="Monto" class="num" style="font-weight:700;${f.total < 0 ? 'color:var(--ok)' : ''}">${usd(f.total)}</td>
                </tr>
                <tr id="det-${i}" style="display:none">
                  <td colspan="5" style="background:#FAFCFD;padding:0">
                    <div style="padding:14px 18px">
                      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-3);font-weight:700;margin-bottom:8px">Desglose</div>
                      <ul style="list-style:none;font-size:14px">
                        ${f.detalle.map(d => `
                          <li style="display:flex;gap:14px;padding:4px 0;border-bottom:1px solid var(--line-2)">
                            <span>${esc(d.c)}</span>
                            <span style="margin-left:auto;white-space:nowrap;font-weight:600">${usd(d.m)}</span>
                          </li>`).join('')}
                      </ul>
                      <div style="display:flex;gap:14px;padding-top:10px;font-weight:700">
                        <span>Total</span><span style="margin-left:auto">${usd(f.total)}</span>
                      </div>
                      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
                        <a class="btn ghost sm" href="#/paquete/${f.paquete}" style="text-decoration:none">Ver paquete #${f.paquete}</a>
                        <button class="btn ghost sm" data-demo="En el sistema real se descargaría el PDF de la factura. Este prototipo no genera archivos.">Descargar PDF</button>
                        ${f.estado === 'pendiente' ? '<button class="btn sm" data-demo="El pago en línea es uno de los módulos opcionales de la propuesta. En el sistema real, aquí se pagaría la factura y se conciliaría automáticamente contra el estado de cuenta.">Pagar ahora</button>' : ''}
                      </div>
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <p style="font-size:12.5px;color:var(--ink-3);margin-top:10px">Toque cualquier línea para ver el desglose completo.</p>`;
  }

  /* ============================================================
     Enrutador
     ============================================================ */
  function render() {
    const h = (location.hash || '#/tablero').replace(/^#\//, '');
    const [ruta, param] = h.split('/');
    const app = $('#app');

    let html, activa = ruta;
    switch (ruta) {
      case 'paquetes':   html = vistaPaquetes(); break;
      case 'paquete':    html = vistaPaquete(param); activa = 'paquete'; break;
      case 'prealerta':  html = vistaPrealerta(); break;
      case 'documentos': html = vistaDocumentos(); break;
      case 'facturas':   html = vistaFacturas(); break;
      default:           html = vistaTablero(); activa = 'tablero';
    }

    app.innerHTML = html;
    pintarNav(activa);
    if (ruta === 'prealerta') pintarArticulos();
    window.scrollTo(0, 0);
  }

  /* ---------- Eventos globales (delegación) ---------- */
  document.addEventListener('click', e => {
    const goto = e.target.closest('[data-goto]');
    if (goto) { location.hash = goto.dataset.goto; return; }

    const demo = e.target.closest('[data-demo]');
    if (demo) {
      e.preventDefault();
      alert('◆ Prototipo de demostración\n\n' + demo.dataset.demo);
      return;
    }

    const cp = e.target.closest('[data-copy]');
    if (cp) {
      navigator.clipboard?.writeText(cp.dataset.copy);
      const t = cp.textContent;
      cp.textContent = '✓ Copiada';
      setTimeout(() => { cp.textContent = t; }, 1600);
      return;
    }

    const f = e.target.closest('[data-filtro]');
    if (f) { filtroActivo = f.dataset.filtro; render(); return; }

    const md = e.target.closest('[data-modo]');
    if (md) {
      articulos[+md.dataset.i].modo = md.dataset.modo;
      pintarArticulos();
      return;
    }

    const del = e.target.closest('[data-del]');
    if (del) { articulos.splice(+del.dataset.del, 1); pintarArticulos(); return; }

    if (e.target.id === 'add') {
      articulos.push({ desc: '', valor: 0, peso: 1, modo: 'aereo' });
      pintarArticulos();
      return;
    }

    const fact = e.target.closest('[data-fact]');
    if (fact) {
      const row = document.getElementById('det-' + fact.dataset.fact);
      if (row) row.style.display = row.style.display === 'none' ? '' : 'none';
    }
  });

  document.addEventListener('input', e => {
    const f = e.target.dataset.f;
    if (f === undefined) return;
    const i = +e.target.dataset.i;
    articulos[i][f] = (f === 'desc') ? e.target.value : parseFloat(e.target.value) || 0;
    pintarResumen();
  });

  /* ---------- Arranque ---------- */
  $('#who-name').textContent = CLIENTE.nombre;
  $('#who-acct').textContent = 'Cuenta ' + CLIENTE.cuenta + ' · ' + CLIENTE.sucursal;
  window.addEventListener('hashchange', render);
  render();
})();
