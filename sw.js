<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
  <title>DSDundIBChat · tutor espacial</title>
  <!-- jsPDF desde CDN (gratuito) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: system-ui, 'Segoe UI', Roboto, -apple-system, sans-serif;
    }
    body {
      background: #eef2f5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .chat-container {
      max-width: 720px;
      width: 100%;
      background: #ffffffdd;
      backdrop-filter: blur(4px);
      background: #fafcfe;
      border-radius: 2.5rem 2.5rem 1.8rem 1.8rem;
      box-shadow: 0 20px 40px rgba(44, 62, 102, 0.12);
      overflow: hidden;
      border: 1px solid #dbe1eb;
      transition: all 0.2s;
    }
    /* encabezado con icono de ajustes (doble clic) */
    .header {
      background: linear-gradient(145deg, #2c3e66, #3b4f7a);
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #a0b8d0;
    }
    .header h1 {
      color: white;
      font-size: 1.4rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header h1 small {
      font-size: 0.75rem;
      opacity: 0.8;
      font-weight: 300;
      margin-left: 6px;
    }
    .settings-icon {
      color: #f0e9d0;
      font-size: 1.8rem;
      cursor: pointer;
      transition: 0.2s;
      padding: 0 6px;
      user-select: none;
      border-radius: 30px;
      background: rgba(255,255,255,0.04);
      line-height: 1;
    }
    .settings-icon:hover {
      background: rgba(255,255,255,0.12);
      transform: rotate(20deg);
    }
    /* area de chat */
    .chat-box {
      padding: 1.2rem 1.2rem 0.8rem;
      min-height: 320px;
      max-height: 460px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f4f8fe;
      scroll-behavior: smooth;
    }
    .chat-msg {
      max-width: 85%;
      padding: 0.9rem 1.2rem;
      border-radius: 1.8rem;
      font-size: 0.95rem;
      line-height: 1.5;
      word-break: break-word;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      animation: fadeUp 0.2s;
    }
    .chat-msg.user {
      align-self: flex-end;
      background: #2c3e66;
      color: white;
      border-bottom-right-radius: 0.4rem;
    }
    .chat-msg.bot {
      align-self: flex-start;
      background: #ffffff;
      color: #1f2a3f;
      border: 1px solid #dbe1eb;
      border-bottom-left-radius: 0.4rem;
    }
    .chat-msg.bot .pdf-btn {
      display: inline-block;
      margin-top: 12px;
      background: #2c3e66;
      color: white;
      border: none;
      padding: 6px 16px;
      border-radius: 40px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: 0.15s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .chat-msg.bot .pdf-btn:hover {
      background: #1f3152;
      transform: scale(0.97);
    }
    .typing-indicator {
      align-self: flex-start;
      background: #eaf0f8;
      padding: 0.6rem 1.2rem;
      border-radius: 2rem;
      color: #2c3e66;
      font-weight: 400;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.95rem;
    }
    .typing-indicator span {
      animation: blink 1.2s infinite;
      font-size: 1.2rem;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0.3; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    .menu-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0.6rem 1.2rem 0.2rem;
      justify-content: center;
      background: #f4f8fe;
    }
    .menu-btn {
      background: #e3eaf3;
      border: none;
      border-radius: 60px;
      padding: 0.4rem 1rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: #1f2a3f;
      box-shadow: 0 1px 4px rgba(0,0,0,0.02);
      transition: 0.1s ease;
      cursor: pointer;
      background: #dce6f2;
      border: 1px solid #cbd7e8;
      flex: 1 0 auto;
      max-width: 120px;
    }
    .menu-btn.special {
      background: #f0d5b0;
      border-color: #cfb28b;
      color: #2c3e66;
      font-weight: 600;
    }
    .menu-btn:hover {
      transform: scale(0.96);
      background: #c9d6ea;
    }
    .menu-btn.special:hover { background: #e8c8a0; }

    .input-area {
      display: flex;
      padding: 0.6rem 1.2rem 1.2rem;
      gap: 8px;
      background: #f4f8fe;
      border-top: 1px solid #dce4ef;
    }
    .input-area input {
      flex: 1;
      border: 1px solid #cbd7e8;
      border-radius: 60px;
      padding: 0.7rem 1.2rem;
      font-size: 0.95rem;
      background: white;
      outline: none;
      transition: 0.15s;
    }
    .input-area input:focus { border-color: #2c3e66; box-shadow: 0 0 0 3px #2c3e6622; }
    .input-area button {
      background: #2c3e66;
      border: none;
      border-radius: 60px;
      padding: 0 1.8rem;
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: 0.15s;
      box-shadow: 0 4px 8px rgba(44,62,102,0.2);
    }
    .input-area button:hover { background: #1f3152; transform: scale(0.97); }

    /* modal (juego y ajustes) */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.25);
      backdrop-filter: blur(3px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.2rem;
      z-index: 999;
    }
    .modal-overlay.active { display: flex; }
    .modal-card {
      background: white;
      border-radius: 2.4rem;
      max-width: 480px;
      width: 100%;
      padding: 2rem 1.5rem;
      box-shadow: 0 30px 60px rgba(0,0,0,0.2);
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
      animation: fadeUp 0.25s;
    }
    .modal-card h2 {
      color: #2c3e66;
      margin-bottom: 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-card .close-modal {
      background: #eef2f5;
      border: none;
      border-radius: 40px;
      font-size: 1.3rem;
      padding: 0 14px;
      cursor: pointer;
      color: #2c3e66;
    }
    .quiz-options button {
      display: block;
      width: 100%;
      background: #eef4fc;
      border: 1px solid #cbd7e8;
      border-radius: 60px;
      padding: 10px 14px;
      margin: 6px 0;
      font-size: 0.95rem;
      text-align: left;
      transition: 0.1s;
      cursor: pointer;
    }
    .quiz-options button:hover { background: #dce6f2; }
    .quiz-feedback { margin: 10px 0; font-weight: 500; }
    .quiz-score { font-size: 1.1rem; background: #f0f4fe; padding: 6px 14px; border-radius: 60px; }
    .config-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    .config-field label { font-weight: 500; color: #1f2a3f; }
    .config-field input { padding: 10px; border-radius: 40px; border: 1px solid #cbd7e8; }
    .config-field button { background: #2c3e66; color: white; border: none; padding: 10px; border-radius: 40px; font-weight: 600; }

    /* responsivo */
    @media (max-width: 520px) {
      .header h1 { font-size: 1.1rem; }
      .menu-btn { font-size: 0.7rem; padding: 0.3rem 0.7rem; max-width: 90px; }
      .chat-box { max-height: 340px; }
    }
  </style>
</head>
<body>
<div class="chat-container" id="app">
  <div class="header">
    <h1>🚀 DSDundIBChat <small>tutor espacial</small></h1>
    <span class="settings-icon" id="settingsIcon" title="doble clic para configurar URL del Worker">⚙️</span>
  </div>
  <div class="chat-box" id="chatBox">
    <!-- mensajes dinámicos -->
  </div>
  <div class="menu-grid" id="menuGrid">
    <button class="menu-btn" data-topic="Hörverstehen">🎧 Hörverstehen</button>
    <button class="menu-btn" data-topic="Leseverstehen">📖 Leseverstehen</button>
    <button class="menu-btn" data-topic="Schreiben">✍️ Schreiben</button>
    <button class="menu-btn" data-topic="Mündlich">🗣️ Mündlich</button>
    <button class="menu-btn" data-topic="Grammatik">📐 Grammatik</button>
    <button class="menu-btn" data-topic="Vokabeln">📘 Vokabeln</button>
    <button class="menu-btn" data-topic="Redemittel">💬 Redemittel</button>
    <button class="menu-btn" data-topic="Idiomatik">🌀 Idiomatik</button>
    <button class="menu-btn special" id="resumenBtn">📄 Resumen</button>
    <button class="menu-btn special" id="juegoBtn">🎮 Juego</button>
  </div>
  <div class="input-area">
    <input type="text" id="userInput" placeholder="Escribe tu pregunta..." autocomplete="off">
    <button id="sendBtn">Enviar</button>
  </div>
</div>

<!-- Modal para juego / ajustes / resumen -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal-card" id="modalCard">
    <h2><span id="modalTitle">Juego astronómico</span><button class="close-modal" id="modalCloseBtn">✕</button></h2>
    <div id="modalBody"></div>
  </div>
</div>

<script>
  (function() {
    // ---------- CONFIGURACIÓN ----------
    let WORKER_URL = localStorage.getItem('dsd_worker_url') || 'https://tu-worker.workers.dev'; // reemplazar con la real
    const SYSTEM_PROMPT = `Eres DSDundIBChat, un tutor de alemán para estudiantes de 12 a 18 años. 
    Tus respuestas son cortas (máx 3 párrafos) a menos que se pida un resumen extenso. 
    Usa emojis espaciales: 🪐✏️👁️📝🔭, nunca emojis de dinero. 
    Si no sabes algo, dímelo amablemente. 
    Temas: Grammatik, Vokabeln, Redemittel, Idiomatik, Hörverstehen, Leseverstehen, Schreiben, Mündlich. 
    Sé claro, natural y motivador.`;

    // ---------- ESTADO ----------
    let chatHistory = []; // array de {role, content} (máx 10 pares)
    let currentSummaryText = ''; // para el botón PDF
    let currentSummaryTitle = '';

    // Elementos DOM
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // ---------- FUNCIONES DE CHAT ----------
    function addMessage(role, content, extra = null) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${role}`;
      msgDiv.innerHTML = content;
      if (extra && role === 'bot') {
        const btn = document.createElement('button');
        btn.className = 'pdf-btn';
        btn.textContent = '📥 Descargar PDF';
        btn.addEventListener('click', () => downloadPDF(currentSummaryTitle, currentSummaryText));
        msgDiv.appendChild(btn);
      }
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addTyping() {
      const typing = document.createElement('div');
      typing.className = 'typing-indicator';
      typing.id = 'typingIndicator';
      typing.innerHTML = '<span>.</span><span>.</span><span>.</span> Escribiendo';
      chatBox.appendChild(typing);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTyping() {
      const el = document.getElementById('typingIndicator');
      if (el) el.remove();
    }

    // añadir mensaje de bienvenida
    function showWelcome() {
      const welcome = "🌌 ¡Hola, futura astronauta! Soy DSDundIBChat, tu tutor espacial. Puedes preguntarme sobre Grammatik, Leseverstehen o usar el menú.";
      addMessage('bot', welcome);
      chatHistory.push({ role: 'assistant', content: welcome });
    }

    // llamada al worker
    async function sendToWorker(userMessage) {
      if (!WORKER_URL || WORKER_URL === 'https://tu-worker.workers.dev') {
        addMessage('bot', '⚠️ Configura la URL del Worker (doble clic ⚙️)');
        return;
      }
      // preparar historial (últimos 10 mensajes)
      const history = chatHistory.slice(-10);
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: userMessage }
      ];
      try {
        addTyping();
        const resp = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages })
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        removeTyping();
        if (data.error) {
          addMessage('bot', '⚠️ Error: ' + data.error);
          return;
        }
        const botReply = data.reply || 'No obtuve respuesta.';
        // comprobar si es resumen (contiene "resumen de" o viene del botón resumen)
        const isSummary = userMessage.toLowerCase().includes('resumen de') || userMessage.toLowerCase().includes('resumen sobre');
        if (isSummary || currentSummaryText) {
          // se almacena el texto completo para PDF
          currentSummaryText = botReply;
          currentSummaryTitle = userMessage.replace(/resumen de |resumen sobre /i, '').trim().slice(0, 30) || 'tema';
          addMessage('bot', botReply, true);
        } else {
          addMessage('bot', botReply);
        }
        chatHistory.push({ role: 'user', content: userMessage });
        chatHistory.push({ role: 'assistant', content: botReply });
        // mantener historial (10 pares)
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
      } catch (err) {
        removeTyping();
        addMessage('bot', '🔌 Error de conexión con el tutor IA. Verifica que el Worker esté activo y la URL correcta.');
        console.warn(err);
      }
    }

    // ---------- MENÚ / BOTONES ----------
    function handleMenuTopic(topic) {
      const prompt = `Explícame sobre ${topic} en alemán (para nivel A2-B1), con ejemplos y consejos.`;
      userInput.value = prompt;
      handleSend();
    }

    // Resumen (botón)
    function handleResumen() {
      const tema = prompt('Escribe el tema del resumen (ej: "los verbos modales"):');
      if (!tema) return;
      const promptMsg = `Resumen de ${tema}`;
      userInput.value = promptMsg;
      handleSend();
    }

    // Envío de mensaje
    async function handleSend() {
      const text = userInput.value.trim();
      if (!text) return;
      addMessage('user', text);
      userInput.value = '';
      await sendToWorker(text);
    }

    // ---------- PDF (jsPDF) ----------
    function downloadPDF(title, content) {
      if (!content) return alert('No hay contenido para generar PDF.');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(18);
      doc.text('📘 Resumen: ' + (title || 'tema'), 20, 30);
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, 45);
      doc.save(`resumen_${(title || 'tema').replace(/\s+/g,'_')}.pdf`);
    }

    // ---------- JUEGO (quiz astronómico) ----------
    const QUIZ = [
      { q: '¿Qué planeta es conocido como el "planeta rojo"?', options: ['Marte', 'Venus', 'Júpiter', 'Saturno'], correct: 0 },
      { q: '¿Cuál es la estrella más cercana a la Tierra?', options: ['Próxima Centauri', 'Sol', 'Sirio', 'Alfa Centauri'], correct: 1 },
      { q: '¿Cuántos planetas tiene el sistema solar?', options: ['8', '9', '7', '10'], correct: 0 },
      { q: '¿Qué galaxia contiene nuestro sistema solar?', options: ['Andrómeda', 'Vía Láctea', 'Triangulum', 'NGC 1300'], correct: 1 },
      { q: '¿Qué fenómeno ocurre cuando la Luna se interpone entre el Sol y la Tierra?', options: ['Eclipse solar', 'Eclipse lunar', 'Luna nueva', 'Luna llena'], correct: 0 },
      { q: '¿Cuál es el planeta más grande del sistema solar?', options: ['Júpiter', 'Saturno', 'Urano', 'Neptuno'], correct: 0 },
      { q: '¿Qué planeta tiene los anillos más visibles?', options: ['Júpiter', 'Saturno', 'Urano', 'Neptuno'], correct: 1 },
      { q: '¿Cómo se llama el satélite natural de la Tierra?', options: ['Luna', 'Fobos', 'Deimos', 'Ganímedes'], correct: 0 },
      { q: '¿Qué agencia espacial lanzó el telescopio Hubble?', options: ['NASA', 'ESA', 'Roscosmos', 'JAXA'], correct: 0 },
      { q: '¿Cuál es el cometa más famoso?', options: ['Halley', 'Encke', 'Borrelly', 'Swift-Tuttle'], correct: 0 },
      { q: '¿Qué planeta es conocido como el "planeta azul"?', options: ['Tierra', 'Neptuno', 'Urano', 'Venus'], correct: 0 },
      { q: '¿Qué es un agujero negro?', options: ['Región con gravedad extrema', 'Estrella muerta', 'Planeta oscuro', 'Nube de gas'], correct: 0 },
      { q: '¿Cuál es la velocidad de la luz aproximadamente?', options: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '100.000 km/s'], correct: 0 },
      { q: '¿Qué planeta tiene el día más largo?', options: ['Venus', 'Mercurio', 'Marte', 'Júpiter'], correct: 0 },
      { q: '¿Qué satélite de Júpiter es el más grande?', options: ['Ganímedes', 'Calisto', 'Io', 'Europa'], correct: 0 }
    ];

    let bestScore = parseInt(localStorage.getItem('dsd_quiz_best')) || 0;
    let currentQuiz = [];
    let quizIndex = 0;
    let quizCorrect = 0;
    let quizAnswered = false;

    function startQuiz() {
      // seleccionar 5 preguntas aleatorias sin repetición
      const shuffled = [...QUIZ].sort(() => Math.random() - 0.5);
      currentQuiz = shuffled.slice(0, 5);
      quizIndex = 0;
      quizCorrect = 0;
      quizAnswered = false;
      renderQuizQuestion();
    }

    function renderQuizQuestion() {
      if (quizIndex >= currentQuiz.length) {
        // fin del juego
        const isNewRecord = quizCorrect > bestScore;
        if (isNewRecord) {
          bestScore = quizCorrect;
          localStorage.setItem('dsd_quiz_best', bestScore);
        }
        modalBody.innerHTML = `
          <div style="text-align:center; padding: 8px 0;">
            <p style="font-size:1.6rem;">🏆 ${quizCorrect} / ${currentQuiz.length}</p>
            <p>${isNewRecord ? '🎉 ¡Nuevo récord!' : 'Mejor puntuación: ' + bestScore}</p>
            <button class="menu-btn special" style="margin:12px 0; padding:0.8rem 2rem;" id="quizNewGameBtn">🔄 Nueva partida</button>
            <button class="menu-btn" style="margin:4px;" id="quizCloseBtn">Cerrar</button>
          </div>
        `;
        document.getElementById('quizNewGameBtn')?.addEventListener('click', startQuiz);
        document.getElementById('quizCloseBtn')?.addEventListener('click', closeModal);
        return;
      }
      const q = currentQuiz[quizIndex];
      modalBody.innerHTML = `
        <div style="margin-bottom:12px; font-weight:600; color:#2c3e66;">Pregunta ${quizIndex+1}/${currentQuiz.length}</div>
        <p style="font-size:1.1rem; margin:6px 0 12px;">${q.q}</p>
        <div class="quiz-options" id="quizOptions">
          ${q.options.map((opt, idx) => `<button data-idx="${idx}">${String.fromCharCode(65+idx)}. ${opt}</button>`).join('')}
        </div>
        <div id="quizFeedback" class="quiz-feedback"></div>
        <div style="margin-top:10px; display:flex; justify-content:space-between;">
          <span class="quiz-score">⭐ ${quizCorrect} aciertos</span>
          <button class="menu-btn" id="quizCloseBtn" style="background:#dce4ef;">Cerrar</button>
        </div>
      `;
      document.getElementById('quizCloseBtn')?.addEventListener('click', closeModal);
      // eventos opciones
      document.querySelectorAll('#quizOptions button').forEach(btn => {
        btn.addEventListener('click', function(e) {
          if (quizAnswered) return;
          const idx = parseInt(this.dataset.idx);
          const correct = q.correct;
          const fb = document.getElementById('quizFeedback');
          if (idx === correct) {
            fb.innerHTML = '✅ ¡Correcto!';
            fb.style.color = '#1e7e34';
            quizCorrect++;
          } else {
            fb.innerHTML = `❌ Incorrecto. La respuesta correcta era: ${q.options[correct]}`;
            fb.style.color = '#a13d3d';
          }
          quizAnswered = true;
          // deshabilitar botones
          document.querySelectorAll('#quizOptions button').forEach(b => b.style.opacity = '0.6');
          // botón siguiente
          const nextBtn = document.createElement('button');
          nextBtn.className = 'menu-btn special';
          nextBtn.textContent = quizIndex === currentQuiz.length-1 ? 'Ver resultado' : 'Siguiente →';
          nextBtn.style.marginTop = '12px';
          nextBtn.addEventListener('click', function() {
            quizIndex++;
            quizAnswered = false;
            renderQuizQuestion();
          });
          fb.appendChild(nextBtn);
        });
      });
    }

    function openQuizModal() {
      modalTitle.textContent = '🎮 Juego astronómico';
      modalOverlay.classList.add('active');
      startQuiz();
    }

    function openSettingsModal() {
      modalTitle.textContent = '⚙️ Configurar Worker';
      modalBody.innerHTML = `
        <div class="config-field">
          <label>URL del Cloudflare Worker</label>
          <input type="text" id="workerUrlInput" value="${WORKER_URL}" placeholder="https://tu-worker.workers.dev">
          <button id="saveWorkerBtn">Guardar</button>
          <p style="margin-top:8px; font-size:0.8rem; color:#4a5a72;">Doble clic en ⚙️ para abrir esta configuración.</p>
        </div>
      `;
      document.getElementById('saveWorkerBtn').addEventListener('click', function() {
        const newUrl = document.getElementById('workerUrlInput').value.trim();
        if (newUrl) {
          WORKER_URL = newUrl;
          localStorage.setItem('dsd_worker_url', WORKER_URL);
          alert('URL guardada.');
          closeModal();
        } else {
          alert('Ingresa una URL válida.');
        }
      });
      modalOverlay.classList.add('active');
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
    }

    // ---------- EVENTOS ----------
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    // menú
    document.querySelectorAll('.menu-btn[data-topic]').forEach(btn => {
      btn.addEventListener('click', function() {
        handleMenuTopic(this.dataset.topic);
      });
    });
    document.getElementById('resumenBtn').addEventListener('click', handleResumen);
    document.getElementById('juegoBtn').addEventListener('click', openQuizModal);

    // ajustes doble clic
    document.getElementById('settingsIcon').addEventListener('dblclick', openSettingsModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    // Inicializar
    showWelcome();
    // Aviso si no está configurada la URL
    if (WORKER_URL === 'https://tu-worker.workers.dev') {
      addMessage('bot', '⚙️ Recuerda configurar la URL del Worker (doble clic en ⚙️)');
    }

    // ---------- SERVICE WORKER (offline parcial) ----------
    if ('serviceWorker' in navigator) {
      // intentamos registrar un sw inline (con blob) para cachear index.html y jsPDF
      try {
        const swCode = `
          self.addEventListener('install', e => {
            e.waitUntil(
              caches.open('dsd-cache-v1').then(cache => {
                return cache.addAll([
                  '/',
                  '/index.html',
                  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
                ]);
              })
            );
          });
          self.addEventListener('fetch', e => {
            e.respondWith(
              caches.match(e.request).then(res => res || fetch(e.request).catch(() => new Response('Offline', { status: 503 })))
            );
          });
        `;
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl).catch(() => {});
      } catch (e) {}
    }

  })();
</script>
</body>
</html>
