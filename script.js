// ============================================
// INVITACIÓN 15 AÑOS - NATASHA
// Confirmación por WhatsApp
// ============================================

// Número del administrador (solo él recibe los mensajes)
const ADMIN_PHONE = "+59891950107";

const confirmBtn = document.getElementById('confirmBtn');
const guestNameInput = document.getElementById('guestName');
const guestNameDisplay = document.getElementById('guestNameDisplay');
const guestListElement = document.getElementById('guestList');
const messageDiv = document.getElementById('message');
const accesoBanner = document.getElementById('accesoInvalidoBanner');

let invitados = [];
let nombreInvitado = null;

function obtenerNombreDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const nombre = urlParams.get('nombre');
    return nombre ? decodeURIComponent(nombre) : null;
}

function mostrarMensaje(texto, tipo) {
    messageDiv.textContent = texto;
    messageDiv.className = `message ${tipo}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 4000);
}

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

function confirmarAsistencia() {
    if (verificarFechaLimite()) return;
    
    if (!nombreInvitado) {
        mostrarMensaje('❌ Acceso no válido. Usá el enlace que recibiste por WhatsApp.', 'error');
        return;
    }
    
    // Enlace que SOLO el admin puede usar (no se comparte públicamente)
    const enlaceConfirmacion = `https://mattosardy.github.io/invitacion-natasha-15/admin.html?confirmar=${encodeURIComponent(nombreInvitado)}`;
    
    const mensaje = `🎉 *CONFIRMACIÓN DE ASISTENCIA* 🎉%0a%0a` +
        `*Nombre:* ${nombreInvitado}%0a` +
        `*Fecha y hora:* ${new Date().toLocaleString()}%0a%0a` +
        `✅ *¡${nombreInvitado} ha confirmado su asistencia!*%0a%0a` +
        `🔗 *Hacé clic aquí para marcarlo como confirmado:*%0a${enlaceConfirmacion}`;
    
    // El mensaje se envía SOLO al número del admin
    const url = `https://wa.me/${ADMIN_PHONE}?text=${mensaje}`;
    window.open(url, '_blank');
    
    mostrarMensaje(`📱 Gracias ${nombreInvitado}. Se abrirá WhatsApp para enviar tu confirmación.`, 'success');
    confirmBtn.disabled = true;
}

function habilitarBoton() {
    const fechaLimite = new Date('2026-05-29T23:59:59');
    const ahora = new Date();
    if (ahora > fechaLimite) {
        confirmBtn.disabled = true;
        return;
    }
    confirmBtn.disabled = false;
}

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

if (confirmBtn) confirmBtn.addEventListener('click', confirmarAsistencia);
if (botonMusica) botonMusica.addEventListener('click', controlarMusica);

init();

const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const tiempoEspera = esMovil ? 5000 : 7000;
setTimeout(() => {
    mostrarContenidoPrincipal();
}, tiempoEspera);

console.log('✅ Invitación lista - Confirmación por WhatsApp');