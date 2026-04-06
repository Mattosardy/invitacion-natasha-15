// ============================================
// INVITACIÓN 15 AÑOS - NATASHA
// Con integración a SheetDB (base de datos compartida)
// ============================================

// Configuración de SheetDB
const SHEETDB_URL = "https://sheetdb.io/api/v1/csd1vhl35hj05";

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
// VERIFICAR QUE EL NOMBRE ESTÉ EN SHEETDB
// ============================================
async function verificarNombreEnSheetDB(nombre) {
    try {
        const response = await fetch(`${SHEETDB_URL}/search?nombre=${encodeURIComponent(nombre)}`);
        const data = await response.json();
        return data && data.length > 0;
    } catch (error) {
        console.error('Error verificando en SheetDB:', error);
        return false;
    }
}

// ============================================
// GUARDAR CONFIRMACIÓN EN SHEETDB
// ============================================
async function guardarConfirmacionEnSheetDB(nombre) {
    try {
        // Primero buscar si ya existe
        const searchResponse = await fetch(`${SHEETDB_URL}/search?nombre=${encodeURIComponent(nombre)}`);
        const existing = await searchResponse.json();
        
        if (existing && existing.length > 0) {
            // Actualizar existente
            await fetch(`${SHEETDB_URL}/nombre/${encodeURIComponent(nombre)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confirmado: "SI",
                    fecha_confirmacion: new Date().toISOString()
                })
            });
        } else {
            // Crear nuevo registro
            await fetch(SHEETDB_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombre,
                    telefono: "",
                    cantidad_personas: "1",
                    confirmado: "SI",
                    fecha_confirmacion: new Date().toISOString(),
                    ip: ""
                })
            });
        }
        console.log('✅ Confirmación guardada en SheetDB');
        return true;
    } catch (error) {
        console.error('Error guardando en SheetDB:', error);
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
    
    // Verificar si ya confirmó localmente
    const yaConfirmoLocal = invitados.some(invitado => invitado.nombre.toLowerCase() === nombreInvitado.toLowerCase());
    if (yaConfirmoLocal) {
        mostrarMensaje('✅ Ya confirmaste tu asistencia. ¡Te esperamos!', 'error');
        return;
    }
    
    // Verificar en SheetDB si ya confirmó
    const existeEnSheetDB = await verificarNombreEnSheetDB(nombreInvitado);
    if (!existeEnSheetDB) {
        mostrarMensaje('❌ Lo sentimos, tu nombre no está en la lista de invitados.', 'error');
        return;
    }
    
    // Guardar confirmación en SheetDB
    const guardado = await guardarConfirmacionEnSheetDB(nombreInvitado);
    
    if (guardado) {
        // Guardar también en localStorage local
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

// Iniciar
init();

// Pantalla de bienvenida
const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const tiempoEspera = esMovil ? 5000 : 7000;
setTimeout(() => {
    mostrarContenidoPrincipal();
}, tiempoEspera);

console.log('✅ Invitación lista con SheetDB');