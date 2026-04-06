// ============================================
// INVITACIÓN 15 AÑOS - NATASHA
// Versión pulida con banner de acceso inválido
// ============================================

const confirmBtn = document.getElementById('confirmBtn');
const guestNameInput = document.getElementById('guestName');
const guestNameDisplay = document.getElementById('guestNameDisplay');
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
// VERIFICAR QUE EL NOMBRE ESTÉ EN LA LISTA DEL ADMIN
// ============================================
function verificarNombreEnLista(nombre) {
    const listaCompleta = localStorage.getItem('listaInvitadosNatasha');
    if (listaCompleta) {
        const invitadosAdmin = JSON.parse(listaCompleta);
        return invitadosAdmin.some(i => i.nombre.toLowerCase() === nombre.toLowerCase());
    }
    return false;
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
function confirmarAsistencia() {
    if (verificarFechaLimite()) return;
    
    if (!nombreInvitado) {
        mostrarMensaje('❌ Acceso no válido. Usá el enlace que recibiste por WhatsApp.', 'error');
        return;
    }
    
    // Cargar lista actualizada de confirmados
    const guardados = localStorage.getItem('invitadosFiesta');
    if (guardados) {
        invitados = JSON.parse(guardados);
    }
    
    // Verificar si ya confirmó antes
    const yaConfirmo = invitados.some(invitado => invitado.nombre.toLowerCase() === nombreInvitado.toLowerCase());
    if (yaConfirmo) {
        mostrarMensaje('✅ Ya confirmaste tu asistencia. ¡Te esperamos!', 'error');
        return;
    }
    
    // Verificar que el nombre esté en la lista de invitados del admin
    const nombreValido = verificarNombreEnLista(nombreInvitado);
    
    if (!nombreValido) {
        mostrarMensaje('❌ Lo sentimos, tu nombre no está en la lista de invitados. Por favor contactá a Natasha.', 'error');
        return;
    }
    
    // Guardar confirmación
    invitados.push({
        nombre: nombreInvitado,
        fecha: new Date().toISOString()
    });
    
    localStorage.setItem('invitadosFiesta', JSON.stringify(invitados));
    mostrarMensaje(`🎉 ¡Gracias ${nombreInvitado}! Has confirmado tu asistencia. ¡Te esperamos! 🎉`, 'success');
    confirmBtn.disabled = true;
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
// CONTROL DE MÚSICA
// ============================================
let musicaActiva = false;
const musica = document.getElementById('bgMusic');
const botonMusica = document.getElementById('musicToggle');

function controlarMusica() {
    if (musicaActiva) {
        musica.pause();
        botonMusica.textContent = '🎵 Activar Música';
        musicaActiva = false;
    } else {
        musica.play().then(() => {
            botonMusica.textContent = '🔇 Silenciar';
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
        accesoBanner.style.display = 'none';
    } else {
        guestNameDisplay.textContent = '⚠️ Acceso no válido';
        guestNameDisplay.style.color = '#e94560';
        guestNameDisplay.style.borderColor = '#e94560';
        confirmBtn.disabled = true;
        accesoBanner.style.display = 'block';
        mostrarMensaje('❌ Acceso no válido. Usá el enlace que recibiste por WhatsApp.', 'error');
    }
    
    actualizarCuentaRegresiva();
    setInterval(actualizarCuentaRegresiva, 1000);
}

// ============================================
// EVENTOS
// ============================================
confirmBtn.addEventListener('click', confirmarAsistencia);
if (botonMusica) botonMusica.addEventListener('click', controlarMusica);

// INICIAR
init();

console.log('✅ Invitación lista - Versión pulida');