/**
 * CIMA ABSOLUTA — Datos de Expediciones
 * Edita este archivo para cambiar precios, textos y detalles sin tocar el código de la UI.
 */

const expeditionsData = [
  {
    id: 1,
    title: "Volcán Lanín",
    subtitle: "Patagonia, Argentina",
    height: "3.747m",
    difficulty: 1,
    days: 3,
    price: 650,
    currency: "USD",
    tag: "Ideal para empezar",
    tagColor: "#2ecc71",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    filter: "beginner",
    description: "El coloso patagónico. Primera expedición en nieve y hielo con técnica de crampones y piolet. Accesible para cualquier persona con buena condición física.",
    includes: ["Guía certificado", "Equipamiento técnico", "Campo base", "Transporte desde Junín de los Andes"]
  },
  {
    id: 2,
    title: "Nevado Chachani",
    subtitle: "Arequipa, Perú",
    height: "6.075m",
    difficulty: 2,
    days: 4,
    price: 1200,
    currency: "USD",
    tag: "Primer 6.000m",
    tagColor: "#3498db",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    filter: "trekking",
    description: "El mejor primer 6.000 metros del mundo. Pendientes técnicas moderadas, excepcional aclimatación natural desde Arequipa. La puerta al mundo de la alta montaña.",
    includes: ["Guía UIAGM", "Aclimatación en Arequipa", "Campo base completo", "Equipamiento técnico"]
  },
  {
    id: 3,
    title: "Volcán Villarrica",
    subtitle: "Pucón, Chile",
    height: "2.847m",
    difficulty: 1,
    days: 2,
    price: 480,
    currency: "USD",
    tag: "Volcán activo",
    tagColor: "#e74c3c",
    image: "https://images.unsplash.com/photo-1542332213-31f87348057f?w=600&q=80",
    filter: "beginner",
    description: "Descender al cráter de un volcán activo. Una experiencia única: nieve, lava y el sonido del magma. Requiere condición física básica y ganas de vivir algo diferente.",
    includes: ["Guía certificado", "Crampones y piolet", "Máscara de gases", "Transporte desde Pucón"]
  },
  {
    id: 4,
    title: "Ojos del Salado",
    subtitle: "Atacama, Chile / Argentina",
    height: "6.893m",
    difficulty: 4,
    days: 14,
    price: 3800,
    currency: "USD",
    tag: "Volcán más alto del mundo",
    tagColor: "#f39c12",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    filter: "summit",
    description: "El volcán activo más alto del planeta y la segunda cumbre de los Andes. Desierto de Atacama, aclimatación extrema, frío seco y una ruta técnica que requiere experiencia probada.",
    includes: ["Guía UIAGM + médica de altura", "Permisos CONAF", "Campo base premium", "Equipo completo de alta montaña"]
  },
  {
    id: 5,
    title: "Aconcagua — Ruta Normal",
    subtitle: "Mendoza, Argentina",
    height: "6.961m",
    difficulty: 3,
    days: 21,
    price: 4800,
    currency: "USD",
    tag: "Más popular",
    tagColor: "#FF5416",
    image: "https://images.unsplash.com/photo-1589182337358-2cb63099350c?w=600&q=80",
    filter: "summit",
    description: "El techo de América. La cumbre más alta fuera del Himalaya. 21 días de aclimatación progresiva, convivencia de cumbre y la promesa de ser alguien diferente en el vuelo de regreso.",
    includes: ["2 guías UIAGM", "Médica de expedición", "Mulas de carga", "Chef de campo base", "Permisos Aconcagua"]
  },
  {
    id: 6,
    title: "Mera Peak",
    subtitle: "Khumbu, Nepal",
    height: "6.476m",
    difficulty: 3,
    days: 18,
    price: 5200,
    currency: "USD",
    tag: "Últimos 2 cupos",
    tagColor: "#9b59b6",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=600&q=80",
    filter: "summit",
    description: "La cumbre de trekking más alta del Nepal. Vista directa al Everest, Lhotse y Makalu. Una expedición de Himalaya técnicamente accesible para alpinistas con experiencia en 6.000m andinos.",
    includes: ["Guía UIAGM + Sirdar local", "Vía Kathmandú", "Equipo de Sherpa", "Permisos y visas", "Seguro de evacuación aérea"]
  }
];

// Level test results mapping
const testResults = {
  beginner: {
    name: "Volcán Lanín (3.747m)",
    desc: "El punto de partida perfecto. Técnica de crampones, nieve virgen y una cumbre que sabe a montaña de verdad. Hablemos para reservar tu fecha."
  },
  intermediate: {
    name: "Nevado Chachani (6.075m)",
    desc: "Tu nivel es ideal para el primer 6.000. Con 4 meses de preparación y una buena aclimatación en Arequipa, la cumbre está a tu alcance."
  },
  advanced: {
    name: "Aconcagua (6.961m)",
    desc: "Tu perfil y experiencia son los adecuados para el techo de América. Es el momento. Hablemos de la logística y la temporada correcta para ti."
  },
  expert: {
    name: "Mera Peak, Nepal (6.476m)",
    desc: "Estás listo para el Himalaya. Mera Peak es la puerta al mundo de los ocho miles, con vistas directas al Everest. Vamos."
  }
};

// Export for use in main.js (global variable since no module bundler)
window.expeditionsData = expeditionsData;
window.testResults = testResults;
