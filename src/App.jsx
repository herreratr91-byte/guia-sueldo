import { useState, useEffect, useRef } from "react";

// ─── STRIPE CONFIG ───────────────────────────────────────────────
// 1. Crea cuenta en stripe.com
// 2. Ve a Developers → API Keys → copia tu "Publishable key"
// 3. Pega aquí abajo tu clave (empieza por pk_live_ o pk_test_)
const STRIPE_PUBLISHABLE_KEY = "pk_live_51TJu53KzC0ht0g2Cmo01W4lpXPHJsKVKZglBNAoyBSbWI5pR7RfaN4kWrxJwfdhAos1jSg689NMGDfQ6IcyUPaQU00UnD9XZyK";
const PRECIO_EUROS = "4,99";

// ─── PREGUNTAS (15 preguntas, 5 opciones cada una) ───────────────
// Bloque 1 (1-10): actitud, situación y negociación
// Bloque 2 (11-15): perfil profesional concreto
const PREGUNTAS = [
  // — BLOQUE 1: Situación actual —
  {
    id: 1,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Cuánto tiempo llevas en tu empresa actual?",
    opciones: ["Menos de 1 año", "1 a 2 años", "3 a 5 años", "6 a 10 años", "Más de 10 años"],
  },
  {
    id: 2,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Cómo describirías tu rendimiento en el trabajo?",
    opciones: ["Hago lo mínimo requerido", "Cumplo con mis tareas", "Supero lo que se me pide", "Soy referente en mi equipo", "Asumo responsabilidades extra constantemente"],
  },
  {
    id: 3,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Cuándo fue tu última subida de sueldo?",
    opciones: ["Nunca me la han subido", "Hace más de 3 años", "Hace 1 o 2 años", "Este año", "Tengo revisión próximamente"],
  },
  {
    id: 4,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Cómo es tu relación con tu jefe directo?",
    opciones: ["Muy distante o tensa", "Correcta pero fría", "Buena y profesional", "Cercana y de confianza", "Soy de sus favoritos"],
  },
  {
    id: 5,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Cuánto sabes sobre los sueldos de tu sector?",
    opciones: ["Nada, nunca lo he mirado", "Tengo una idea vaga", "He mirado algún portal", "Conozco bien los rangos", "Sé exactamente qué cobran mis compañeros"],
  },
  {
    id: 6,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Has pedido una subida de sueldo alguna vez?",
    opciones: ["Nunca me he atrevido", "Lo intenté y me dijeron que no", "Sí, sin preparación previa", "Sí, con argumentos pero sin éxito", "Sí, y lo conseguí"],
  },
  {
    id: 7,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Qué tan visible es tu trabajo para la empresa?",
    opciones: ["Nadie sabe lo que hago", "Mi jefe directo me ve", "Mi equipo me reconoce", "Varios departamentos me conocen", "La dirección sabe quién soy"],
  },
  {
    id: 8,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Tienes documentados tus logros y resultados?",
    opciones: ["No, nunca lo he hecho", "Recuerdo algunos pero no los tengo escritos", "Tengo una lista mental", "Los anoto pero sin orden", "Tengo un registro detallado"],
  },
  {
    id: 9,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Qué harías si tu empresa no te sube el sueldo?",
    opciones: ["Seguir igual, no tengo opciones", "Quejarme pero quedarme", "Buscar trabajo por si acaso", "Tengo entrevistas ya en marcha", "Me iría sin dudarlo"],
  },
  {
    id: 10,
    bloque: "situacion",
    bloqueLabel: null,
    texto: "¿Cuánto tiempo puedes dedicar a mejorar tu posición?",
    opciones: ["No tengo tiempo extra", "Algún rato suelto", "30 minutos al día", "1 hora diaria", "Todo el que haga falta"],
  },
  // — BLOQUE 2: Perfil profesional concreto —
  {
    id: 11,
    bloque: "perfil",
    bloqueLabel: "Cuéntanos más sobre ti",
    texto: "¿En qué sector trabajas?",
    opciones: [
      "Tecnología / Digital",
      "Salud / Educación / Público",
      "Comercio / Hostelería / Turismo",
      "Industria / Construcción / Logística",
      "Finanzas / Legal / Consultoría",
    ],
  },
  {
    id: 12,
    bloque: "perfil",
    bloqueLabel: null,
    texto: "¿Cuál es tu nivel de responsabilidad actual?",
    opciones: [
      "Ejecuto tareas sin gestionar a nadie",
      "Coordino proyectos puntualmente",
      "Tengo responsabilidad sobre procesos clave",
      "Lidero un equipo pequeño (2-5 personas)",
      "Gestiono equipos o áreas completas",
    ],
  },
  {
    id: 13,
    bloque: "perfil",
    bloqueLabel: null,
    texto: "¿Qué tipo de tareas ocupa la mayor parte de tu jornada?",
    opciones: [
      "Tareas operativas y repetitivas",
      "Atención a clientes o usuarios",
      "Análisis, informes o trabajo técnico",
      "Gestión de proyectos o coordinación",
      "Ventas, negociación o desarrollo de negocio",
    ],
  },
  {
    id: 14,
    bloque: "perfil",
    bloqueLabel: null,
    texto: "¿Cuál es tu mayor fortaleza diferencial en el trabajo?",
    opciones: [
      "Soy muy resolutivo y eficiente",
      "Tengo muy buenas habilidades técnicas",
      "Sé comunicarme y relacionarme bien",
      "Genero ideas y propongo mejoras",
      "Soy fiable y no fallo nunca",
    ],
  },
  {
    id: 15,
    bloque: "perfil",
    bloqueLabel: null,
    texto: "¿En qué podrías aportar más valor del que ya aportas ahora?",
    opciones: [
      "Formándome en algo que mi empresa necesita",
      "Asumiendo tareas que nadie quiere hacer",
      "Mejorando procesos que funcionan mal",
      "Aportando contactos o clientes nuevos",
      "Mentorizando o ayudando a mis compañeros",
    ],
  },
];

// ─── PROMPT para la IA ─────────────────────────────────────────────
function buildPrompt(respuestas, openAnswers) {
  const situacion = PREGUNTAS.slice(0, 10).map((p, i) => `- ${p.texto}: "${respuestas[i]}"`).join("\n");
  const perfil = PREGUNTAS.slice(10).map((p, i) => `- ${p.texto}: "${respuestas[10 + i]}"`).join("\n");
  return `Eres un experto en desarrollo profesional y negociación salarial en España con 20 años de experiencia en RRHH y coaching ejecutivo. Analiza el perfil completo de este trabajador y genera una guía MUY personalizada y accionable de 8 semanas.

━━━ SITUACIÓN ACTUAL ━━━
${situacion}

━━━ PERFIL PROFESIONAL CONCRETO ━━━
${perfil}

━━━ DATOS CLAVE (escritos por la persona — usa estos para personalizar al máximo) ━━━
- Puesto exacto y empresa: "${openAnswers.puesto}"
- Sueldo actual y objetivo: "${openAnswers.sueldo}"
- Mayor logro o aportación reciente: "${openAnswers.logro}"

━━━ INSTRUCCIONES CRÍTICAS ━━━
- El puesto exacto y el logro son los datos más importantes. Mencionarlos explícitamente en el diagnóstico y en las frases para el jefe.
- Las acciones deben ser 100% realizables en SU trabajo concreto, no genéricas
- Las frases para el jefe deben mencionar su logro real y el salto salarial específico que busca
- Adapta el tono y los argumentos al sector y tamaño de empresa que ha descrito
- Si trabaja en hostelería, sus acciones serán distintas a alguien de tecnología. Sé específico.
- Menciona herramientas, plataformas o recursos reales según su sector
- Responde SOLO en JSON válido, sin backticks ni markdown, exactamente con esta estructura:

{
  "titulo": "Título motivador muy personalizado que refleje su puesto y situación real",
  "diagnostico": "3-4 frases concretas: qué tiene a favor (mencionando su logro real), qué le frena y cuál es su palanca de mejora principal",
  "fases": [
    {
      "numero": 1,
      "nombre": "Nombre evocador de la fase",
      "semanas": "Semanas 1-2",
      "objetivo": "Qué va a conseguir exactamente en su trabajo estos 14 días",
      "acciones": [
        {"titulo": "Acción concreta adaptada a su puesto real", "detalle": "Instrucciones paso a paso muy específicas. Menciona herramientas reales. Indica cuánto tiempo lleva hacerlo."},
        {"titulo": "Acción concreta", "detalle": "..."},
        {"titulo": "Acción concreta", "detalle": "..."}
      ]
    },
    { "numero": 2, "nombre": "...", "semanas": "Semanas 3-4", "objetivo": "...", "acciones": [{"titulo":"...","detalle":"..."},{"titulo":"...","detalle":"..."},{"titulo":"...","detalle":"..."}] },
    { "numero": 3, "nombre": "...", "semanas": "Semanas 5-6", "objetivo": "...", "acciones": [{"titulo":"...","detalle":"..."},{"titulo":"...","detalle":"..."},{"titulo":"...","detalle":"..."}] },
    { "numero": 4, "nombre": "...", "semanas": "Semanas 7-8", "objetivo": "...", "acciones": [{"titulo":"...","detalle":"..."},{"titulo":"...","detalle":"..."},{"titulo":"...","detalle":"..."}] }
  ],
  "momento_ideal": "Día, contexto y forma exacta de pedir la reunión teniendo en cuenta su empresa y relación con el jefe que ha descrito",
  "frases": [
    "Frase de apertura que mencione su logro real y suene natural para su puesto y sector",
    "Frase con el argumento económico concreto: el salto salarial que busca justificado por su aportación",
    "Frase para cuando el jefe diga que no hay presupuesto o que no es el momento"
  ],
  "advertencia": "El error específico más probable dado su puesto, sector y forma de describir su situación — y cómo evitarlo"
}`;
}

// ─── COLORES Y FUENTES ────────────────────────────────────────────
const C = {
  bg: "#f7f4ef",
  card: "#ffffff",
  ink: "#1a1a2e",
  ink2: "#4a4a6a",
  gold: "#c9a84c",
  goldLight: "#f0e4c0",
  goldDark: "#8a6a1a",
  green: "#2d6a4f",
  greenLight: "#d8f3dc",
  red: "#c0392b",
  border: "#e8e0d0",
  blur: "#e8e0d0",
};

const F = {
  display: "'Playfair Display', serif",
  body: "'Lato', sans-serif",
};

export default function App() {
  const [screen, setScreen] = useState("intro"); // intro | quiz | openq | loading | preview | guide
  const [current, setCurrent] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [textAnswers, setTextAnswers] = useState({ puesto: "", sueldo: "", logro: "" });
  const [guia, setGuia] = useState(null);
  const [pagado, setPagado] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const guideRef = useRef(null);

  // Cargar Stripe.js
  useEffect(() => {
    if (!document.getElementById("stripe-js")) {
      const s = document.createElement("script");
      s.id = "stripe-js";
      s.src = "https://js.stripe.com/v3/";
      s.onload = () => setStripeLoaded(true);
      document.head.appendChild(s);
    } else {
      setStripeLoaded(true);
    }
  }, []);

  const elegir = (opcion) => setSelected(opcion);

  const siguiente = () => {
    if (!selected) return;
    const nuevas = [...respuestas, selected];
    setRespuestas(nuevas);
    setSelected(null);
    if (current + 1 < PREGUNTAS.length) {
      setCurrent(current + 1);
    } else {
      // Terminó las 15 de opciones → pantalla de preguntas abiertas
      setScreen("openq");
    }
  };

  const finalizarYgenerar = (answers) => {
    setTextAnswers(answers);
    setScreen("loading");
    generarGuia(respuestas, answers);
  };

  const generarGuia = async (resp, openAnswers) => {
    try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2500,
    messages: [{ role: "user", content: buildPrompt(resp, openAnswers) }],
  }),
});
      const data = await res.json();
      const text = data.content.map((i) => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setGuia(parsed);
      setScreen("preview");
    } catch (e) {
      console.error(e);
      setScreen("preview");
    }
  };

const iniciarPago = async () => {
  try {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const { clientSecret } = await res.json();
    const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    const { error } = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });
    if (error) {
      alert('Error en el pago: ' + error.message);
    } else {
      setPagado(true);
      setScreen('guide');
    }
  } catch (e) {
    console.error(e);
    alert('Error procesando el pago. Inténtalo de nuevo.');
  }
};
    if (!stripeLoaded || !window.Stripe) {
      alert("Stripe no está cargado aún. Espera un momento.");
      return;
    }
    const confirmado = window.confirm(
      `Para activar el pago real necesitas conectar tu backend de Stripe.\n\n` +
      `¿Quieres continuar en modo DEMO (simula el pago de ${PRECIO_EUROS}€)?`
    );
    if (confirmado) {
      setPagado(true);
      setScreen("guide");
    }
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .fu { animation: fadeUp .5s ease both; }
        .fu1 { animation-delay:.05s }
        .fu2 { animation-delay:.15s }
        .fu3 { animation-delay:.25s }
        .fu4 { animation-delay:.35s }
        .fu5 { animation-delay:.45s }
        button { cursor:pointer; border:none; background:none; font-family:${F.body}; }
        .opt-btn:hover { border-color: ${C.gold} !important; background: ${C.goldLight} !important; }
      `}</style>

      {screen === "intro"   && <Intro   onStart={() => setScreen("quiz")} />}
      {screen === "quiz"    && <Quiz    pregunta={PREGUNTAS[current]} num={current+1} total={PREGUNTAS.length} selected={selected} onElegir={elegir} onNext={siguiente} />}
      {screen === "openq"   && <OpenQuestions onFinish={finalizarYgenerar} />}
      {screen === "loading" && <Loading />}
      {screen === "preview" && <Preview guia={guia} onPagar={iniciarPago} precio={PRECIO_EUROS} />}
      {screen === "guide"   && <Guide   guia={guia} ref={guideRef} />}
    </div>
  );
}

// ══════════════════════════════════════════════
// OPEN QUESTIONS (3 preguntas de texto libre)
// ══════════════════════════════════════════════
function OpenQuestions({ onFinish }) {
  const [vals, setVals] = useState({ puesto: "", sueldo: "", logro: "" });
  const [active, setActive] = useState(null);

  const preguntas = [
    {
      key: "puesto",
      emoji: "💼",
      label: "¿Cuál es tu puesto exacto y en qué tipo de empresa trabajas?",
      placeholder: "Ej: Técnico de mantenimiento en fábrica de 80 personas, o comercial en agencia inmobiliaria pequeña...",
      helper: "Cuanto más concreto, más útil será tu guía",
    },
    {
      key: "sueldo",
      emoji: "💶",
      label: "¿Cuánto cobras actualmente y cuánto te gustaría cobrar?",
      placeholder: "Ej: Cobro 22.000€ brutos y me gustaría llegar a 26.000€, o no sé el bruto pero cobro 1.400€ netos...",
      helper: "No hace falta ser exacto, un rango aproximado es suficiente",
    },
    {
      key: "logro",
      emoji: "🏆",
      label: "¿Cuál es el mayor logro o aportación que has hecho en tu empresa este año?",
      placeholder: "Ej: Reduje los tiempos de entrega un 20%, conseguí un cliente nuevo, mejoré un proceso que nadie quería tocar...",
      helper: "Si no se te ocurre nada grande, cuenta algo pequeño que hayas mejorado",
    },
  ];

  const allFilled = vals.puesto.trim().length > 10 && vals.sueldo.trim().length > 5 && vals.logro.trim().length > 10;

  return (
    <div style={s.page}>
      <div style={s.openqHeader}>
        <div style={s.openqBadge}>✨ Casi listo — 3 preguntas finales</div>
        <h2 style={s.openqTitle}>Cuéntanos un poco más</h2>
        <p style={s.openqSub}>
          Estas respuestas son las que hacen que tu guía sea <strong>realmente tuya</strong> y no genérica. Escribe con libertad.
        </p>
      </div>

      <div style={{ padding: "0 20px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
        {preguntas.map((p, i) => (
          <div
            key={p.key}
            className="fu"
            style={{
              ...s.openqCard,
              animationDelay: `${i * 0.1}s`,
              borderColor: active === p.key ? C.gold : vals[p.key].trim().length > 5 ? "#b7e4c7" : C.border,
              boxShadow: active === p.key ? `0 0 0 3px ${C.goldLight}` : "none",
            }}
          >
            <div style={s.openqCardTop}>
              <span style={s.openqEmoji}>{p.emoji}</span>
              <label style={s.openqLabel}>{p.label}</label>
            </div>
            <textarea
              style={s.openqTextarea}
              value={vals[p.key]}
              onChange={(e) => setVals({ ...vals, [p.key]: e.target.value })}
              onFocus={() => setActive(p.key)}
              onBlur={() => setActive(null)}
              placeholder={p.placeholder}
              rows={3}
            />
            <div style={s.openqHelper}>
              {vals[p.key].trim().length > 5
                ? <span style={{ color: C.green }}>✓ Perfecto</span>
                : <span style={{ color: "#aaa" }}>💡 {p.helper}</span>
              }
            </div>
          </div>
        ))}

        <button
          style={{ ...s.ctaBtn, opacity: allFilled ? 1 : 0.4, marginTop: 4 }}
          onClick={() => allFilled && onFinish(vals)}
          disabled={!allFilled}
        >
          Generar mi guía personalizada →
        </button>
        {!allFilled && (
          <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", fontFamily: F.body, marginTop: -8 }}>
            Escribe al menos 3 palabras en cada respuesta para continuar
          </p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// INTRO
// ══════════════════════════════════════════════
function Intro({ onStart }) {
  return (
    <div style={s.page}>
      <div style={s.introTop}>
        <div className="fu" style={s.introKicker}>💼 Para asalariados en España</div>
        <h1 className="fu fu1" style={s.introTitle}>
          ¿Tu empresa no<br />te sube el sueldo?
        </h1>
        <p className="fu fu2" style={s.introSub}>
          Responde 15 preguntas rápidas y nuestra IA crea una guía de 8 semanas 100% personalizada a tu sector y puesto para que tu empresa te valore más — y te lo demuestre en la nómina.
        </p>
      </div>

      <div className="fu fu3" style={s.introBadges}>
        {["⏱ Solo 3 minutos", "🎯 Guía personalizada", "✅ Plan de 8 semanas"].map((b, i) => (
          <span key={i} style={s.badge}>{b}</span>
        ))}
      </div>

      <div className="fu fu4" style={s.introCards}>
        {[
          { e: "📊", t: "Análisis de tu situación" },
          { e: "🗺️", t: "Plan semana a semana" },
          { e: "🗣️", t: "Frases exactas para tu jefe" },
        ].map((c, i) => (
          <div key={i} style={s.introCard}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.e}</div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, textAlign: "center", lineHeight: 1.4 }}>{c.t}</div>
          </div>
        ))}
      </div>

      <div className="fu fu5" style={{ padding: "0 24px 40px" }}>
        <button style={s.ctaBtn} onClick={onStart}>
          Empezar ahora →
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 12, fontFamily: F.body }}>
          La guía se descarga por {PRECIO_EUROS} € · Sin suscripción
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// QUIZ
// ══════════════════════════════════════════════
function Quiz({ pregunta, num, total, selected, onElegir, onNext }) {
  const pct = Math.round(((num - 1) / total) * 100);
  const isPerfilBlock = pregunta.bloque === "perfil";
  const showBloqueLabel = pregunta.bloqueLabel !== null && pregunta.bloqueLabel !== undefined;

  return (
    <div style={s.page}>
      <div style={s.quizHeader}>
        <div style={s.progressWrap}>
          <div style={{ ...s.progressBar, width: `${pct}%` }} />
        </div>
        <div style={s.quizCounter}>{num} / {total}</div>
      </div>

      {showBloqueLabel && (
        <div className="fu" style={s.bloqueTransicion}>
          <div style={s.bloqueIcon}>🎯</div>
          <div>
            <p style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase", marginBottom: 3 }}>
              Última parte
            </p>
            <p style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>
              {pregunta.bloqueLabel}
            </p>
            <p style={{ fontFamily: F.body, fontSize: 12, color: C.ink2, marginTop: 3 }}>
              5 preguntas para personalizar tu guía al máximo
            </p>
          </div>
        </div>
      )}

      <div style={{ padding: showBloqueLabel ? "16px 24px 0" : "24px 24px 0", flex: 1 }}>
        {isPerfilBlock && !showBloqueLabel && (
          <div style={s.perfilPill}>🎯 Perfil profesional</div>
        )}
        <p className="fu" style={s.quizQ}>{pregunta.texto}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          {pregunta.opciones.map((op, i) => (
            <button
              key={i}
              className="opt-btn fu"
              style={{
                ...s.optBtn,
                animationDelay: `${i * 0.07}s`,
                borderColor: selected === op ? C.gold : C.border,
                background: selected === op ? C.goldLight : C.card,
                color: selected === op ? C.goldDark : C.ink,
              }}
              onClick={() => onElegir(op)}
            >
              <span style={s.optLetter}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{op}</span>
              {selected === op && <span style={{ color: C.gold, fontSize: 18 }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px 36px" }}>
        <button
          style={{ ...s.ctaBtn, opacity: selected ? 1 : 0.4 }}
          onClick={onNext}
          disabled={!selected}
        >
          {num === total ? "Generar mi guía →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// LOADING
// ══════════════════════════════════════════════
function Loading() {
  const [step, setStep] = useState(0);
  const steps = [
    "Analizando tu perfil...",
    "Calculando tu potencial de mejora...",
    "Diseñando tu plan personalizado...",
    "Preparando tus argumentos...",
    "Finalizando tu guía...",
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ ...s.page, justifyContent: "center", alignItems: "center", gap: 32 }}>
      <div style={s.spinner} />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: F.display, fontSize: 22, color: C.ink, marginBottom: 12 }}>
          Creando tu guía
        </p>
        <p style={{ fontFamily: F.body, fontSize: 14, color: C.ink2, minHeight: 22, transition: "all .3s" }}>
          {steps[step]}
        </p>
      </div>
      <div style={s.loadDots}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ ...s.loadDot, animationDelay: `${i * 0.3}s`, background: i <= step ? C.gold : C.border }} />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// PREVIEW (con blur paywall)
// ══════════════════════════════════════════════
function Preview({ guia, onPagar, precio }) {
  if (!guia) return <div style={{ padding: 40, textAlign: "center", fontFamily: F.body, color: C.ink2 }}>Cargando vista previa...</div>;
  return (
    <div style={s.page}>
      <div style={{ padding: "28px 24px 0" }}>
        <div className="fu" style={s.previewTag}>📋 Tu guía está lista</div>
        <h2 className="fu fu1" style={s.previewTitle}>{guia.titulo}</h2>
        <div className="fu fu2" style={s.diagnosticoBox}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.green, display: "block", marginBottom: 6, fontFamily: F.body }}>
            📍 Tu diagnóstico
          </span>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>{guia.diagnostico}</p>
        </div>

        {/* Fase 1 visible */}
        <div className="fu fu3">
          <FaseCard fase={guia.fases[0]} visible />
        </div>

        {/* Fases 2-4 con blur */}
        <div style={{ position: "relative", marginTop: 12 }}>
          <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
            {guia.fases.slice(1).map((f) => <FaseCard key={f.numero} fase={f} visible />)}
            <div style={s.blurSectionFake}>
              <div style={s.fakeLine} /><div style={{ ...s.fakeLine, width: "70%" }} />
              <div style={s.fakeLine} /><div style={{ ...s.fakeLine, width: "55%" }} />
              <div style={s.fakeLine} /><div style={{ ...s.fakeLine, width: "80%" }} />
            </div>
          </div>
          <div style={s.blurOverlay}>
            <div style={s.lockBox}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
              <p style={{ fontFamily: F.display, fontSize: 18, color: C.ink, marginBottom: 6, fontWeight: 700 }}>
                3 fases más + extras
              </p>
              <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, marginBottom: 20, lineHeight: 1.5 }}>
                Plan semanas 3–8, momento exacto para hablar con tu jefe y frases literales para pedir la subida
              </p>
              <button style={s.payBtn} onClick={onPagar}>
                Desbloquear guía completa — {precio} €
              </button>
              <p style={{ fontSize: 11, color: "#aaa", marginTop: 10, fontFamily: F.body }}>
                Pago único · Acceso inmediato
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// GUIDE (completa, tras pago)
// ══════════════════════════════════════════════
function Guide({ guia }) {
  if (!guia) return null;
  return (
    <div style={s.page}>
      <div style={{ padding: "28px 24px 48px" }}>
        <div className="fu" style={s.guideSuccessBadge}>✅ Guía desbloqueada</div>
        <h1 className="fu fu1" style={s.guideMainTitle}>{guia.titulo}</h1>

        <div className="fu fu2" style={s.diagnosticoBox}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.green, display: "block", marginBottom: 6, fontFamily: F.body }}>
            📍 Tu diagnóstico
          </span>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>{guia.diagnostico}</p>
        </div>

        <p style={{ fontFamily: F.display, fontSize: 18, color: C.ink, margin: "28px 0 14px", fontWeight: 700 }}>
          Tu plan de 8 semanas
        </p>

        {guia.fases.map((f, i) => (
          <div key={i} className="fu" style={{ animationDelay: `${i * 0.1}s` }}>
            <FaseCard fase={f} visible />
          </div>
        ))}

        {/* Momento ideal */}
        <div style={{ ...s.extraCard, borderColor: C.gold, background: "#fffbf0" }}>
          <p style={s.extraTitle}>⏰ Cuándo pedir la reunión</p>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, lineHeight: 1.65 }}>{guia.momento_ideal}</p>
        </div>

        {/* Frases */}
        <div style={{ ...s.extraCard, borderColor: "#2d6a4f", background: "#f0faf4" }}>
          <p style={s.extraTitle}>🗣️ Frases exactas para tu jefe</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {guia.frases.map((fr, i) => (
              <div key={i} style={s.fraseBox}>
                <span style={s.fraseNum}>{i + 1}</span>
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink, lineHeight: 1.6, fontStyle: "italic" }}>"{fr}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advertencia */}
        <div style={{ ...s.extraCard, borderColor: C.red, background: "#fef6f5" }}>
          <p style={{ ...s.extraTitle, color: C.red }}>⚠️ Error que debes evitar</p>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, lineHeight: 1.65 }}>{guia.advertencia}</p>
        </div>

        <div style={s.footerShare}>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ink2, marginBottom: 12, textAlign: "center" }}>
            ¿Conoces a alguien que lo necesite?
          </p>
          <button style={s.shareBtn} onClick={() => {
            if (navigator.share) navigator.share({ title: "Guía subida de sueldo", url: window.location.href });
            else navigator.clipboard.writeText(window.location.href).then(() => alert("¡Enlace copiado!"));
          }}>
            📤 Compartir esta herramienta
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// COMPONENTE FASE
// ══════════════════════════════════════════════
function FaseCard({ fase }) {
  const colors = ["#fff8e6", "#edf7f0", "#eef3ff", "#fef6ff"];
  const borders = [C.gold, "#2d6a4f", "#3b5bdb", "#7c3aed"];
  const idx = (fase.numero - 1) % 4;
  return (
    <div style={{ ...s.faseCard, background: colors[idx], borderColor: borders[idx] }}>
      <div style={s.faseHeader}>
        <div style={{ ...s.faseNum, background: borders[idx] }}>F{fase.numero}</div>
        <div>
          <p style={{ fontFamily: F.display, fontSize: 15, fontWeight: 700, color: C.ink }}>{fase.nombre}</p>
          <p style={{ fontFamily: F.body, fontSize: 11, color: C.ink2, marginTop: 1 }}>{fase.semanas}</p>
        </div>
      </div>
      <p style={{ fontFamily: F.body, fontSize: 12, color: borders[idx], fontWeight: 700, marginBottom: 10, letterSpacing: 0.3 }}>
        OBJETIVO: {fase.objetivo}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fase.acciones.map((a, i) => (
          <div key={i} style={s.accionBox}>
            <div style={s.accionDot} />
            <div>
              <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{a.titulo}</p>
              <p style={{ fontFamily: F.body, fontSize: 12, color: C.ink2, lineHeight: 1.55 }}>{a.detalle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ESTILOS
// ══════════════════════════════════════════════
const s = {
  root: {
    minHeight: "100vh",
    background: C.bg,
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: F.body,
  },
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: C.bg,
  },
  // INTRO
  introTop: { padding: "48px 24px 20px" },
  introKicker: {
    fontFamily: F.body,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: C.gold,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  introTitle: {
    fontFamily: F.display,
    fontWeight: 900,
    fontSize: 38,
    color: C.ink,
    lineHeight: 1.1,
    marginBottom: 18,
    letterSpacing: -1,
  },
  introSub: {
    fontFamily: F.body,
    fontSize: 15,
    color: C.ink2,
    lineHeight: 1.65,
    fontWeight: 300,
  },
  introBadges: {
    display: "flex",
    gap: 8,
    padding: "16px 24px",
    flexWrap: "wrap",
  },
  badge: {
    background: C.goldLight,
    border: `1px solid ${C.gold}`,
    color: C.goldDark,
    fontSize: 11,
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: 100,
    fontFamily: F.body,
  },
  introCards: {
    display: "flex",
    gap: 10,
    padding: "0 24px 24px",
  },
  introCard: {
    flex: 1,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: "16px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ctaBtn: {
    width: "100%",
    background: `linear-gradient(135deg, ${C.gold}, #e8b84b)`,
    color: "#fff",
    fontFamily: F.body,
    fontWeight: 700,
    fontSize: 16,
    padding: "18px 0",
    borderRadius: 14,
    letterSpacing: 0.3,
    boxShadow: `0 8px 24px rgba(201,168,76,0.35)`,
  },
  // QUIZ
  quizHeader: {
    padding: "20px 24px 0",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  progressWrap: {
    flex: 1,
    height: 6,
    background: C.border,
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: `linear-gradient(90deg, ${C.gold}, #e8b84b)`,
    borderRadius: 100,
    transition: "width .4s ease",
  },
  quizCounter: {
    fontFamily: F.body,
    fontSize: 12,
    fontWeight: 700,
    color: C.ink2,
    minWidth: 36,
  },
  quizQ: {
    fontFamily: F.display,
    fontSize: 22,
    fontWeight: 700,
    color: C.ink,
    lineHeight: 1.35,
  },
  optBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    border: `2px solid`,
    borderRadius: 12,
    fontSize: 13,
    fontFamily: F.body,
    transition: "all .2s",
    textAlign: "left",
    width: "100%",
  },
  optLetter: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: C.border,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 12,
    color: C.ink2,
    flexShrink: 0,
  },
  // LOADING
  spinner: {
    width: 56,
    height: 56,
    border: `4px solid ${C.border}`,
    borderTop: `4px solid ${C.gold}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadDots: { display: "flex", gap: 8 },
  loadDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    animation: "pulse 1.5s ease infinite",
    transition: "background .4s",
  },
  // PREVIEW
  previewTag: {
    fontFamily: F.body,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: C.green,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  previewTitle: {
    fontFamily: F.display,
    fontSize: 26,
    fontWeight: 800,
    color: C.ink,
    lineHeight: 1.2,
    marginBottom: 18,
  },
  diagnosticoBox: {
    background: C.greenLight,
    border: `1px solid #b7e4c7`,
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 20,
  },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: "30%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    background: "linear-gradient(to bottom, transparent 0%, rgba(247,244,239,0.97) 35%, rgba(247,244,239,1) 100%)",
    zIndex: 10,
    paddingBottom: 32,
  },
  lockBox: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    padding: "24px 20px",
    margin: "0 8px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  },
  payBtn: {
    width: "100%",
    background: `linear-gradient(135deg, ${C.gold}, #e8b84b)`,
    color: "#fff",
    fontFamily: F.body,
    fontWeight: 700,
    fontSize: 15,
    padding: "16px 20px",
    borderRadius: 12,
    boxShadow: `0 6px 20px rgba(201,168,76,0.35)`,
    cursor: "pointer",
    border: "none",
  },
  blurSectionFake: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 10 },
  fakeLine: { height: 12, background: C.border, borderRadius: 6, width: "100%" },
  // GUIDE COMPLETA
  guideSuccessBadge: {
    fontFamily: F.body,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2,
    color: C.green,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  guideMainTitle: {
    fontFamily: F.display,
    fontSize: 28,
    fontWeight: 900,
    color: C.ink,
    lineHeight: 1.15,
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  faseCard: {
    border: `2px solid`,
    borderRadius: 16,
    padding: "18px 16px",
    marginBottom: 14,
  },
  faseHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  faseNum: {
    width: 36,
    height: 36,
    borderRadius: 10,
    color: "#fff",
    fontFamily: F.body,
    fontWeight: 800,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  accionBox: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    background: "rgba(255,255,255,0.6)",
    borderRadius: 10,
    padding: "10px 12px",
  },
  accionDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: C.gold,
    marginTop: 5,
    flexShrink: 0,
  },
  extraCard: {
    border: `2px solid`,
    borderRadius: 14,
    padding: "16px",
    marginBottom: 14,
  },
  extraTitle: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: 700,
    color: C.ink,
    marginBottom: 10,
  },
  fraseBox: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    background: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    padding: "10px 12px",
  },
  fraseNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: C.green,
    color: "#fff",
    fontFamily: F.body,
    fontWeight: 700,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  footerShare: {
    marginTop: 24,
    padding: "20px",
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
  },
  shareBtn: {
    width: "100%",
    background: C.ink,
    color: "#fff",
    fontFamily: F.body,
    fontWeight: 700,
    fontSize: 14,
    padding: "14px 0",
    borderRadius: 12,
  },
  // OPEN QUESTIONS
  openqHeader: {
    padding: "32px 24px 20px",
    borderBottom: `1px solid ${C.border}`,
  },
  openqBadge: {
    display: "inline-block",
    background: `linear-gradient(135deg, ${C.goldLight}, #fff8e6)`,
    border: `1px solid ${C.gold}`,
    color: C.goldDark,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "5px 14px",
    borderRadius: 100,
    fontFamily: F.body,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  openqTitle: {
    fontFamily: F.display,
    fontWeight: 800,
    fontSize: 26,
    color: C.ink,
    marginBottom: 10,
    lineHeight: 1.2,
  },
  openqSub: {
    fontFamily: F.body,
    fontSize: 14,
    color: C.ink2,
    lineHeight: 1.6,
    fontWeight: 300,
  },
  openqCard: {
    background: C.card,
    border: `2px solid`,
    borderRadius: 16,
    padding: "16px",
    transition: "border-color .2s, box-shadow .2s",
  },
  openqCardTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  openqEmoji: {
    fontSize: 22,
    lineHeight: 1.3,
    flexShrink: 0,
  },
  openqLabel: {
    fontFamily: F.body,
    fontSize: 14,
    fontWeight: 700,
    color: C.ink,
    lineHeight: 1.4,
    cursor: "default",
  },
  openqTextarea: {
    width: "100%",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    fontFamily: F.body,
    fontSize: 13,
    color: C.ink,
    lineHeight: 1.6,
    resize: "none",
    outline: "none",
  },
  openqHelper: {
    fontFamily: F.body,
    fontSize: 12,
    marginTop: 8,
    minHeight: 18,
  },
  // BLOQUE TRANSICIÓN (pregunta 11)
  bloqueTransicion: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    margin: "16px 24px 0",
    padding: "14px 16px",
    background: `linear-gradient(135deg, ${C.goldLight}, #fff8e6)`,
    border: `1.5px solid ${C.gold}`,
    borderRadius: 14,
  },
  bloqueIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: C.gold,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
  },
  perfilPill: {
    display: "inline-block",
    background: C.goldLight,
    border: `1px solid ${C.gold}`,
    color: C.goldDark,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "4px 12px",
    borderRadius: 100,
    fontFamily: F.body,
    textTransform: "uppercase",
    marginBottom: 14,
  },
};
