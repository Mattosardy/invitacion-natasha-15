// ============================================
// INVITACIÓN 15 AÑOS - NATASHA
// Con integración a Google Apps Script
// ============================================

// Configuración de Google Apps Script (la URL la pegarás después)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhQjxF8OUcUx1ouSMQMnrn-X6XtRhLKE0IhhazWve8uLw_9o1myIss0pzCgwEy0ty3/exec";

const confirmBtn = document.getElementById('confirmBtn');
const guestNameInput = document.getElementById('guestName');
const guestNameDisplay = document.getElementById('guestNameDisplay');
const guestListElement = document.getElementById('guestList');
const messageDiv = document.getElementById('message');
const accesoBanner = document.getElementById('accesoInvalidoBanner');

let invitados = [];
let nombreInvitado = null;

// ============================================
// LEER NOMBRE DE LA URL
// ============================================
function obtenerNombreDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const nombre = urlParams.get('nombre');
    return nombre ? decodeURIComponent(nombre) : null;
}

// ============================================
// FUNCIÓN PARA NORMALIZAR TEXTOS (ignorar tildes, mayúsculas, espacios)
// ============================================
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, ' ');
}

// ============================================
// VERIFICAR QUE EL NOMBRE ESTÉ EN LA BASE DE DATOS
// ============================================
async function verificarNombreEnDB(nombre) {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=listar&t=${Date.now()}`);
        const data = await response.json();
        console.log('📋 Datos recibidos:', data);
        console.log('🔍 Buscando nombre exacto:', nombre);
        
        // Comparación exacta (sin normalizar)
        const encontrado = data.find(inv => inv.nombre === nombre);
        console.log('✅ Resultado búsqueda:', encontrado);
        
        return encontrado || null;
    } catch (error) {
        console.error('Error verificando:', error);
        return null;
    }
}

// ============================================
// GUARDAR CONFIRMACIÓN
// ============================================
async function guardarConfirmacion(nombre) {
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'confirmar',
                nombre: nombre,
                fecha: new Date().toISOString()
            })
        });
        
        const resultado = await response.json();
        console.log('Respuesta:', resultado);
        return resultado.success === true;
    } catch (error) {
        console.error('Error guardando:', error);
        return false;
    }
}

// ============================================
// MOSTRAR MENSAJES
// ============================================
function mostrarMensaje(texto, tipo) {
    messageDiv.textContent = texto;
    messageDiv.className = `message ${tipo}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 4000);
}

// ============================================
// ACTUALIZAR LISTA LOCAL
// ============================================
function actualizarListaLocal() {
    if (!guestListElement) return;
    if (invitados.length === 0) {
        guestListElement.innerHTML = '<li style="text-align: center;">✨ Aún no hay confirmaciones ✨</li>';
        return;
    }
    let html = '';
    for (let i = 0; i < invitados.length; i++) {
        html += `<li>✅ ${invitados[i].nombre}</li>`;
    }
    guestListElement.innerHTML = html;
}

// ============================================
// VERIFICAR FECHA LÍMITE
// ============================================
function verificarFechaLimite() {
    const fechaLimite = new Date('2026-05-29T23:59:59');
    const ahora = new Date();
    if (ahora > fechaLimite) {
        confirmBtn.disabled = true;
        mostrarMensaje('⏰ El plazo de confirmación finalizó el 29 de Mayo', 'error');
        return true;
    }
    return false;
}

// ============================================
// CONFIRMAR ASISTENCIA
// ============================================
async function confirmarAsistencia() {
    if (verificarFechaLimite()) return;
    
    if (!nombreInvitado) {
        mostrarMensaje('❌ Acceso no válido. Usá el enlace que recibiste por WhatsApp.', 'error');
        return;
    }
    
    const yaConfirmoLocal = invitados.some(invitado => invitado.nombre.toLowerCase() === nombreInvitado.toLowerCase());
    if (yaConfirmoLocal) {
        mostrarMensaje('✅ Ya confirmaste tu asistencia. ¡Te esperamos!', 'error');
        return;
    }
    
    mostrarMensaje('🔄 Verificando...', 'success');
    
    try {
        const invitadoEnDB = await verificarNombreEnDB(nombreInvitado);
        
        if (!invitadoEnDB) {
            mostrarMensaje('❌ Lo sentimos, tu nombre no está en la lista de invitados.', 'error');
            return;
        }
        
        if (invitadoEnDB.confirmado === "SI") {
            mostrarMensaje('✅ Ya confirmaste tu asistencia anteriormente. ¡Te esperamos!', 'error');
            return;
        }
        
        const guardado = await guardarConfirmacion(nombreInvitado);
        
        if (guardado) {
            invitados.push({
                nombre: nombreInvitado,
                fecha: new Date().toISOString()
            });
            localStorage.setItem('invitadosFiesta', JSON.stringify(invitados));
            mostrarMensaje(`🎉 ¡Gracias ${nombreInvitado}! Has confirmado tu asistencia. ¡Te esperamos! 🎉`, 'success');
            confirmBtn.disabled = true;
        } else {
            mostrarMensaje('❌ Error al guardar la confirmación. Intentá de nuevo.', 'error');
        }
        
    } catch (error) {
        console.error('Error general:', error);
        mostrarMensaje('❌ Error de conexión. Revisá tu internet.', 'error');
    }
}

// ============================================
// HABILITAR BOTÓN
// ============================================
function habilitarBoton() {
    const fechaLimite = new Date('2026-05-29T23:59:59');
    const ahora = new Date();
    if (ahora > fechaLimite) {
        confirmBtn.disabled = true;
        return;
    }
    confirmBtn.disabled = false;
}

// ============================================
// CUENTA REGRESIVA
// ============================================
function actualizarCuentaRegresiva() {
    const fechaEvento = new Date('2026-06-13T22:00:00');
    const ahora = new Date();
    const diferencia = fechaEvento - ahora;
    
    if (diferencia <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = dias.toString().padStart(2, '0');
    document.getElementById('hours').textContent = horas.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutos.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = segundos.toString().padStart(2, '0');
}

// ============================================
// PANTALLA DE BIENVENIDA
// ============================================
const welcomeScreen = document.getElementById('welcomeScreen');
const mainContent = document.getElementById('mainContent');

function mostrarContenidoPrincipal() {
    if (welcomeScreen) {
        welcomeScreen.classList.add('hide');
        setTimeout(() => {
            if (welcomeScreen && welcomeScreen.parentNode) {
                welcomeScreen.style.display = 'none';
            }
        }, 1000);
    }
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');
    }
}

// ============================================
// MÚSICA AUTOMÁTICA
// ============================================
let musicaActiva = false;
const musica = document.getElementById('bgMusic');
const botonMusica = document.getElementById('musicToggle');

function controlarMusica() {
    if (musicaActiva) {
        musica.pause();
        botonMusica.textContent = '🎵 ACTIVAR MÚSICA';
        musicaActiva = false;
    } else {
        musica.play().then(() => {
            botonMusica.textContent = '🔇 SILENCIAR';
            musicaActiva = true;
        }).catch(() => {
            mostrarMensaje('🎵 Haz clic para activar la música', 'error');
        });
    }
}

// ============================================
// INICIALIZAR
// ============================================
function init() {
    nombreInvitado = obtenerNombreDeURL();
    
    if (nombreInvitado) {
        guestNameDisplay.textContent = `🎸 ${nombreInvitado} 🎸`;
        guestNameInput.value = nombreInvitado;
        habilitarBoton();
        if (accesoBanner) accesoBanner.style.display = 'none';
    } else {
        guestNameDisplay.textContent = '⚠️ Acceso no válido';
        guestNameDisplay.style.color = '#e94560';
        guestNameDisplay.style.borderColor = '#e94560';
        confirmBtn.disabled = true;
        if (accesoBanner) accesoBanner.style.display = 'block';
        mostrarMensaje('❌ Acceso no válido. Usá el enlace que recibiste por WhatsApp.', 'error');
    }
    
    actualizarCuentaRegresiva();
    setInterval(actualizarCuentaRegresiva, 1000);
}

// ============================================
// EVENTOS
// ============================================
if (confirmBtn) confirmBtn.addEventListener('click', confirmarAsistencia);
if (botonMusica) botonMusica.addEventListener('click', controlarMusica);

// Iniciar
init();

// Pantalla de bienvenida
const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const tiempoEspera = esMovil ? 5000 : 7000;
setTimeout(() => {
    mostrarContenidoPrincipal();
}, tiempoEspera);

console.log('✅ Invitación lista con Google Apps Script');