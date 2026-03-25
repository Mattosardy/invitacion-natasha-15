// ============================================
// INVITACIÓN 15 AÑOS - NATASHA
// Fecha del evento: 13 de Junio, 2026 - 22:00 hs
// Fecha límite: 29 de Mayo, 2026 (15 días antes)
// ============================================

// 1. Seleccionar elementos del HTML
const confirmBtn = document.getElementById('confirmBtn');
const guestNameInput = document.getElementById('guestName');
const guestListElement = document.getElementById('guestList');
const messageDiv = document.getElementById('message');

// 2. Array para guardar los invitados
let invitados = [];

// 3. Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    messageDiv.textContent = texto;
    messageDiv.className = `message ${tipo}`;
    
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 4000);
}

// 4. Función para actualizar la lista de invitados
function actualizarLista() {
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

// 5. Función para verificar fecha límite (15 días antes = 29 de Mayo 2026)
function verificarFechaLimite() {
    const fechaLimite = new Date('2026-05-29T23:59:59');
    const ahora = new Date();
    
    if (ahora > fechaLimite) {
        confirmBtn.disabled = true;
        mostrarMensaje('⏰ El plazo de confirmación finalizó el 29 de Mayo. ¡Gracias por tu interés!', 'error');
        return true;
    }
    return false;
}

// 6. Función para confirmar asistencia
function confirmarAsistencia() {
    if (verificarFechaLimite()) {
        return;
    }
    
    const nombre = guestNameInput.value.trim();
    
    if (nombre === '') {
        mostrarMensaje('Por favor, ingresa tu nombre completo', 'error');
        return;
    }
    
    const yaConfirmo = invitados.some(invitado => invitado.nombre.toLowerCase() === nombre.toLowerCase());
    
    if (yaConfirmo) {
        mostrarMensaje('Ya confirmaste tu asistencia anteriormente. ¡Te esperamos!', 'error');
        return;
    }
    
    invitados.push({
        nombre: nombre,
        fecha: new Date().toISOString()
    });
    
    localStorage.setItem('invitadosFiesta', JSON.stringify(invitados));
    guestNameInput.value = '';
    actualizarLista();
    mostrarMensaje(`🎉 ¡Gracias ${nombre}! Has confirmado tu asistencia. ¡Te esperamos el 13 de Junio! 🎉`, 'success');
    confirmBtn.disabled = true;
}

// 7. Función para habilitar/deshabilitar botón según input
function verificarInput() {
    const fechaLimite = new Date('2026-05-29T23:59:59');
    const ahora = new Date();
    
    if (ahora > fechaLimite) {
        confirmBtn.disabled = true;
        return;
    }
    
    if (guestNameInput.value.trim() !== '') {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

// 8. Cargar invitados guardados al iniciar
function cargarInvitadosGuardados() {
    const guardados = localStorage.getItem('invitadosFiesta');
    if (guardados) {
        invitados = JSON.parse(guardados);
        actualizarLista();
    }
}

// 9. CUENTA REGRESIVA
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

// 10. CONTROL DE MÚSICA
let musicaActiva = false;
const musica = document.getElementById('bgMusic');
const botonMusica = document.getElementById('musicToggle');

function controlarMusica() {
    if (musicaActiva) {
        musica.pause();
        botonMusica.textContent = '🎵 Activar Música';
        musicaActiva = false;
        console.log('Música pausada');
    } else {
        musica.play().then(() => {
            console.log('Música reproduciéndose');
            botonMusica.textContent = '🔇 Silenciar';
            musicaActiva = true;
        }).catch(error => {
            console.log('Error al reproducir:', error);
            mostrarMensaje('🎵 Haz clic en la página para activar la música', 'error');
            botonMusica.textContent = '🎵 Activar Música';
        });
    }
}

// 11. CONFIGURAR EVENTOS
confirmBtn.addEventListener('click', confirmarAsistencia);
guestNameInput.addEventListener('input', verificarInput);
botonMusica.addEventListener('click', controlarMusica);

// 12. INICIAR TODO
cargarInvitadosGuardados();
actualizarCuentaRegresiva();
setInterval(actualizarCuentaRegresiva, 1000);

console.log('✅ Invitación de Natasha - 15 Años - App iniciada correctamente!');
console.log('📅 Evento: 13 de Junio 2026 - 22:00 hs');
console.log('⚠️ Fecha límite de confirmación: 29 de Mayo 2026');
console.log('🎵 Música: archivo local musica-natasha.mp3');